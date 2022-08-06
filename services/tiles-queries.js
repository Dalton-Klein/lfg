const getRustTilesQuery = () => {
  return `
  select u.id,
         u.username,
         u.avatar_url as "avatarUrl",
         ug.last_seen,
         ug.about,
         ug.age,
         ug.gender,
         r.name as region_name,
         r.abbreviation as region_abbreviation,
         ug.languages,
         ug.preferred_platform,
         ug.discord,
         av1.name as weekends,
         av2.name as weekdays,
         ur.roles,
         ur.play_styles
    from lfg.public.users u 
    join lfg.public.user_general_infos ug 
      on ug.user_id = u.id
    join lfg.public.user_rust_infos ur
      on ur.user_id = u.id
    join lfg.public.regions r
      on r.id = ug.region
    join lfg.public.availabilities av1
      on av1.id = ur.weekends
    join lfg.public.availabilities av2
      on av2.id = ur.weekdays
`;
};

module.exports = {
  getRustTilesQuery,
};
