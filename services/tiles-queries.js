const getRustTilesQuery = () => {
  return `
  select u.id,
         u.username,
         u.avatar_url,
         ug.last_seen,
         ug.about,
         ug.age,
         ug.gender,
         r.name as region_name,
         r.abbreviation as region_abbreviation,
         ug.languages,
         ug.preferred_platform,
         ug.discord,
         ur.hours as rust_hours,
         av1.name as rust_weekends,
         av2.name as rust_weekdays,
         ur.roles,
         ur.play_styles
    from public.users u 
    join public.user_general_infos ug 
      on ug.user_id = u.id
    join public.user_rust_infos ur
      on ur.user_id = u.id
    join public.regions r
      on r.id = ug.region
    join public.availabilities av1
      on av1.id = ur.weekends
    join public.availabilities av2
      on av2.id = ur.weekdays
   where u.id != :userId
     and ur.is_published = true
`;
};

module.exports = {
  getRustTilesQuery,
};
