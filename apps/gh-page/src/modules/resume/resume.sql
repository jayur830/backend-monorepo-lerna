
SELECT
  i.title,
  i.github,
  h.id AS historyId,
  h.company_name as companyName,
  h.start_date AS companyStartDate,
  h.end_date AS companyEndDate,
  h.website,
  h.description AS companyDescription,
  l.id AS logoId,
  l.src,
  l.alt,
  l.width AS logoWidth,
  l.height AS logoHeight,
  d.id AS historyDetailId,
  d.group AS historyDetailGroup,
  d.name AS projectName,
  d.start_date AS projectStartDate,
  d.end_date AS projectEndDate,
  d.tech_list AS techList,
  d.description AS historyDetailDescription
FROM resume_info i
JOIN resume_history h
ON i.id = h.resume_info_id
LEFT JOIN company_logo l
ON l.id = h.logo_id
JOIN resume_history_detail d
ON h.id = d.history_id
WHERE i.id = 1
ORDER BY
  companyStartDate DESC,
  projectStartDate DESC;