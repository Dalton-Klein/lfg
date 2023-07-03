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
            ur.play_styles,
            ur.hours as hours,
            ur.server_type_id,
            ur.wipe_day_preference,
            sum(rd.points) as rank
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
   left join public.redeems rd
          on rd.user_id = u.id
      where u.id != :userId
        and ur.is_published = true
   group by u.id, ug.last_seen, 
            ug.about,
            ug.age,
            ug.gender,
            r.name,
            r.abbreviation,
            ug.languages,
            ug.preferred_platform,
            ug.discord,
            ur.hours,
            av1.name,
            av2.name,
            ur.roles,
            ur.play_styles,
            ur.hours,
            ur.server_type_id,
            ur.wipe_day_preference
`;
};

const getRocketLeagueTilesQuery = () => {
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
         ur.preferred_playlist as rocket_league_playlist,
         ur.rank as rocket_league_rank,
         ur.hours as rocket_league_hours,
         av1.name as rocket_league_weekends,
         av2.name as rocket_league_weekdays,
         ur.hours as hours
    from public.users u 
    join public.user_general_infos ug 
      on ug.user_id = u.id
    join public.user_rocket_league_infos ur
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

const getBattleBitTilesQuery = () => {
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
         ur.preferred_playlist as battle_bit_playlist,
         ur.preferred_class as battle_bit_class,
         ur.rank as battle_bit_rank,
         ur.hours as battle_bit_hours,
         av1.name as battle_bit_weekends,
         av2.name as battle_bit_weekdays,
         ur.hours as hours
    from public.users u 
    join public.user_general_infos ug 
      on ug.user_id = u.id
    join public.user_battle_bit_infos ur
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
  getRocketLeagueTilesQuery,
  getBattleBitTilesQuery,
};
