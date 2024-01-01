/* eslint-disable @typescript-eslint/no-var-requires */
const { faker } = require('@faker-js/faker');
const { isEqual, shuffle, uniqWith } = require('lodash');
const dayjs = require('dayjs');
const { writeFile } = require('fs');

function getInsertQuery(tableName, columns, data) {
  return `INSERT INTO \`${tableName}\` (${columns
    .map((column) => `\`${column}\``)
    .join(', ')}) VALUES\n${data
    .map(
      (row) =>
        `  (${row
          .map((value) => (typeof value === 'number' ? value : `'${value}'`))
          .join(', ')})`,
    )
    .join(',\n')};`;
}

function fetchKakaoLocation(categoryGroupCode) {
  return Array(45)
    .fill(1)
    .map((_, i) =>
      fetch(
        `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=${categoryGroupCode}&x=127.0278758930755&y=37.49812150546278&radius=20000`,
        {
          headers: {
            Authorization: `KakaoAK [KAKAO_REST_API_KEY]`,
          },
        },
      )
        .then((response) => response.json())
        .then((data) => data.documents.map((document) => document.id)),
    );
}

(async () => {
  const userList = Array(3)
    .fill(1)
    .map(() => faker.string.alphanumeric({ length: 28 }));

  const placeList = shuffle([
    ...new Set(
      (
        await Promise.all([
          ...fetchKakaoLocation('CT1'),
          ...fetchKakaoLocation('FD6'),
          ...fetchKakaoLocation('CE7'),
        ])
      ).flat(),
    ),
  ]);

  const profileData = userList.map((userId) => [
    faker.person.firstName(),
    faker.lorem.sentence(10),
    faker.lorem.sentence(7),
    faker.image.url(),
    faker.image.url(),
    faker.internet.url(),
    userId,
  ]);

  const profileDataQuery = getInsertQuery(
    'profile',
    [
      'nick_name',
      'description',
      'sub_title',
      'background_image_url',
      'profile_image_url',
      'instagram_url',
      'user_id',
    ],
    profileData,
  );

  const followData = shuffle(
    uniqWith(
      userList
        .map((userId) => {
          const excludedMeUserList = userList.filter((id) => id !== userId);
          return Array(faker.number.int({ max: 30 }))
            .fill(userId)
            .map((me) => [
              me,
              excludedMeUserList[
                faker.number.int({ max: excludedMeUserList.length - 1 })
              ],
            ]);
        })
        .flat(),
      isEqual,
    ),
  );

  const followDataQuery = getInsertQuery(
    'follower',
    ['from_user_id', 'to_user_id'],
    followData,
  );

  const placeRatingData = shuffle(
    uniqWith(
      userList
        .map((userId) =>
          Array(faker.number.int({ max: Math.round(placeList.length / 2) }))
            .fill(1)
            .map(() => [
              placeList[faker.number.int({ max: placeList.length - 1 })],
              userId,
              faker.number.int({ min: 1, max: 5 }),
            ]),
        )
        .flat(),
      (a, b) => a[0] === b[0] && a[1] === b[1],
    ),
  );

  const placeRatingDataQuery = getInsertQuery(
    'place_rating',
    ['place_id', 'user_id', 'rating'],
    placeRatingData,
  );

  const placeLikeData = shuffle(
    uniqWith(
      userList
        .map((userId) =>
          Array(faker.number.int({ max: Math.round(placeList.length / 2) }))
            .fill(1)
            .map(() => [
              userId,
              placeList[faker.number.int({ max: placeList.length - 1 })],
            ]),
        )
        .flat(),
      isEqual,
    ),
  );

  const placeLikeDataQuery = getInsertQuery(
    'place_like',
    ['user_id', 'place_id'],
    placeLikeData,
  );

  const reviewData = shuffle(
    uniqWith(
      shuffle(userList)
        .slice(0, faker.number.int({ max: Math.round(userList.length / 2) }))
        .map((userId) =>
          Array(faker.number.int({ max: Math.round(placeList.length / 2) }))
            .fill(1)
            .map(() => [
              faker.lorem.lines(1),
              faker.lorem.paragraph(2),
              faker.image.url(),
              faker.number.int({ min: 1, max: 5 }),
              faker.internet.url(),
              dayjs().format('YYYY-MM-DD HH:mm:ss'),
              dayjs().format('YYYY-MM-DD HH:mm:ss'),
              userId,
              placeList[
                faker.number.int({ max: Math.round(placeList.length / 2) })
              ],
            ]),
        )
        .flat(),
      isEqual,
    ),
  ).map((row, i) => [i + 1, ...row]);

  const reviewDataQuery = getInsertQuery(
    'review',
    [
      'id',
      'title',
      'content',
      'image_url',
      'rating',
      'instagram_post_url',
      'created_at',
      'updated_at',
      'user_id',
      'place_id',
    ],
    reviewData,
  );

  const reviewIdList = reviewData.map(([reviewId]) => reviewId);

  const reviewLikeData = shuffle(
    uniqWith(
      shuffle(userList)
        .slice(0, faker.number.int({ max: Math.round(userList.length / 2) }))
        .map((userId) =>
          Array(faker.number.int({ max: Math.round(reviewIdList.length / 2) }))
            .fill(1)
            .map(() => [
              userId,
              reviewIdList[faker.number.int({ max: reviewIdList.length - 1 })],
            ]),
        )
        .flat(),
      isEqual,
    ),
  );

  const reviewLikeDataQuery = getInsertQuery(
    'review_like',
    ['user_id', 'review_id'],
    reviewLikeData,
  );

  const dcl = `
DELETE FROM \`profile\`;
DELETE FROM \`follower\`;
DELETE FROM \`place_rating\`;
DELETE FROM \`place_like\`;
DELETE FROM \`review_like\`;
DELETE FROM \`review\`;

SET foreign_key_checks = 0;
TRUNCATE TABLE \`profile\`;
TRUNCATE TABLE \`follower\`;
TRUNCATE TABLE \`place_rating\`;
TRUNCATE TABLE \`place_like\`;
TRUNCATE TABLE \`review_like\`;
TRUNCATE TABLE \`review\`;
SET foreign_key_checks = 1;

ALTER TABLE \`profile\` AUTO_INCREMENT = 0;
ALTER TABLE \`follower\` AUTO_INCREMENT = 0;
ALTER TABLE \`place_rating\` AUTO_INCREMENT = 0;
ALTER TABLE \`place_like\` AUTO_INCREMENT = 0;
ALTER TABLE \`review_like\` AUTO_INCREMENT = 0;
ALTER TABLE \`review\` AUTO_INCREMENT = 0;

${profileDataQuery}

${followDataQuery}

${placeRatingDataQuery}

${placeLikeDataQuery}

${reviewDataQuery}

${reviewLikeDataQuery}
  `;

  writeFile('dummy.sql', Buffer.from(dcl), () => null);
})();
