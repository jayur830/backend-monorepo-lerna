module.exports = {
  types: [
    {
      value: 'feat',
      name: 'feat:\t\t신규 기능 개발로 인한 코드 변경 사항',
    },
    {
      value: 'fix',
      name: 'fix:\t\t버그 개선으로 인한 코드 변경 사항',
    },
    {
      value: 'docs',
      name: 'docs:\t\tmd 파일 및 기타 문서 변경 사항',
    },
    {
      value: 'style',
      name: 'style:\t코드 포맷팅, 세미콜론 누락 등 코드 정리에 의한 변경 사항',
    },
    { value: 'refactor', name: 'refactor:\t코드 리팩토링 변경 사항' },
    {
      value: 'test',
      name: 'test:\t\t테스트 코드 작성 및 수정에 대한 변경 사항',
    },
    {
      value: 'chore',
      name: 'chore:\t패키지 관련 설정 변경 사항',
    },
    {
      value: 'perf',
      name: 'perf:\t\t성능 개선으로 인한 코드 변경 사항',
    },
    {
      value: 'revert',
      name: 'revert:\t롤백에 의한 변경 사항',
    },
    {
      value: 'build',
      name: 'build:\t번들러 설정 또는 라이브러리 버전 등 빌드에 영향이 있는 변경 사항',
    },
    {
      value: 'ci',
      name: 'ci:\t\t배포 관련 구성파일 변경 사항',
    },
  ],
  scopes: [''],
  allowCustomScopes: true,
  subjectLimit: 255,
  allowBreakingChanges: ['feat', 'fix', 'refactor', 'chore', 'perf', 'revert', 'build'],
  skipQuestions: ['body'],
};
