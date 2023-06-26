const getUserDataByEmailQuery = () => {
  return `
       select u.id,
              u.email,
              u.username,
              u.hashed,
              u.num_of_strikes,
              u.avatar_url, 
              ug.about,
              ug.age,
              ug.gender,
              r.abbreviation as region,
              r.name as region_name,
              ug.languages,
              ug.preferred_platform,
              ug.discord,
              ug.psn,
              ug.xbox,
              ug.last_seen,
              av1.name,
              av2.name,
              ur.roles,
              ur.play_styles
         from public.users u
    left join public.user_general_infos ug
           on ug.user_id = u.id
    left join public.user_rust_infos ur
           on ur.user_id = u.id
    left join public.regions r
           on r.id = ug.region
    left join public.availabilities av1
           on av1.id = ur.weekends
    left join public.availabilities av2
           on av2.id = ur.weekdays
        where u.email = :email
  `;
};

const getUserDataBySteamIdQuery = () => {
  return `
            select u.id,
                   u.email,
                   u.username,
                   u.hashed,
                   u.num_of_strikes,
                   u.avatar_url, 
                   ug.about,
                   ug.age,
                   ug.gender,
                   r.abbreviation as region,
                   r.name as region_name,
                   ug.languages,
                   ug.preferred_platform,
                   ug.discord,
                   ug.psn,
                   ug.xbox,
                   ug.last_seen,
                   av1.name,
                   av2.name,
                   ur.roles,
                   ur.play_styles
              from public.users u
         left join public.user_general_infos ug
                on ug.user_id = u.id
         left join public.user_rust_infos ur
                on ur.user_id = u.id
         left join public.regions r
                on r.id = ug.region
         left join public.availabilities av1
                on av1.id = ur.weekends
         left join public.availabilities av2
                on av2.id = ur.weekdays
             where u.steam_id = :steamId
       `;
};
const getUserDataByIdQuery = () => {
  return `
             select u.id,
                    u.email,
                    u.username,
                    u.hashed,
                    u.num_of_strikes,
                    u.avatar_url, 
                    u.is_email_notifications, 
                    u.is_email_marketing,
                    u.input_device_id,
                    u.output_device_id,
                    (select count(id) from public.connections where sender = :userId) as connection_count_sender,
                    (select count(id) from public.connections where acceptor = :userId) as connection_count_acceptor,
                    ARRAY(
                     SELECT gang_id
                     FROM public.gang_roster g
                     WHERE g.user_id = :userId
                    ) AS gangs,
                    ARRAY(
                     SELECT
                     CASE
                            WHEN c.sender = :userId THEN c.acceptor
                            ELSE c.sender
                     END AS opposite_column
                     FROM public.connections c
                     WHERE c.sender = :userId OR c.acceptor = :userId
                    ) AS connections,
                    ug.about,
                    ug.age,
                    ug.gender,
                    r.abbreviation as region,
                    r.name as region_name,
                    ug.languages,
                    ug.preferred_platform,
                    ug.discord,
                    ug.psn,
                    ug.xbox,
                    ug.last_seen,
                    av1.name as rust_weekdays,
                    av2.name as rust_weekends,
                    ur.roles,
                    ur.play_styles,
                    ur.hours as rust_hours,
                    ur.is_published as rust_is_published,
                    rl.preferred_playlist as rocket_league_playlist,
                    rl.rank as rocket_league_rank,
                    rl.hours as rocket_league_hours, 
                    avrl1.name as rocket_league_weekdays,
                    avrl2.name as rocket_league_weekends,
                    rl.is_published as rocket_league_is_published
               from public.users u
          left join public.user_general_infos ug
                 on ug.user_id = u.id
          left join public.user_rust_infos ur
                 on ur.user_id = u.id
          left join public.user_rocket_league_infos rl
                 on rl.user_id = u.id
          left join public.regions r
                 on r.id = ug.region
          left join public.availabilities av1
                 on av1.id = ur.weekdays
          left join public.availabilities av2
                 on av2.id = ur.weekends
               left join public.availabilities avrl1
                 on avrl1.id = rl.weekdays
          left join public.availabilities avrl2
                 on avrl2.id = rl.weekends
              where u.id = :userId
           group by u.id, 
                    ug.about,
                    ug.age, 
                    ug.gender, 
                    r.abbreviation,
                    r.name ,
                    ug.languages,
                    ug.preferred_platform,
                    ug.discord,
                    ug.psn,
                    ug.xbox,
                    ug.last_seen,
                    av1.name,
                    av2.name,
                    ur.roles,
                    ur.play_styles,
                    ur.hours,
                    ur.is_published,
                    rl.preferred_playlist,
                    rl.rank,
                    rl.hours,
                    avrl1.name,
                    avrl2.name,
                    rl.is_published 
  `;
};

const searchUserByUsernameQuery = () => {
  return `
                  select u.id
                    from public.users u
                   where u.username = :inputString
       `;
};

const getSteamDataQuery = () => {
  return `
            select * 
              from public.steam_data
             where steam_id = :steamId
            `;
};

const storeSteamDataQuery = () => {
  return `
       insert into public.steam_data (id, steam_id, communityvisibilitystate, name, avatar_url, created_at, updated_at)
            values ((select max(id) + 1 from public.steam_data), :steamId, :communityvisibilitystate, :name, :avatar_url, current_timestamp, current_timestamp)
         returning id
       `;
};

const createUserQuery = () => {
  return `
       insert into public.users (id, email, username, hashed, steam_id, avatar_url, created_at, updated_at)
            values ((select max(id) + 1 from public.users), :email, :username, :hashed, :steam_id, :avatar_url, current_timestamp, current_timestamp)
         returning id, email, hashed, username
       `;
};

const createGeneralInfoQuery = () => {
  return `
  insert into public.user_general_infos (id, user_id, last_seen, created_at, updated_at)
       values ((select max(id) + 1 from public.user_general_infos), :userId, current_timestamp, current_timestamp, current_timestamp)
  `;
};

const createRustInfoQuery = () => {
  return `
  insert into public.user_rust_infos (id, user_id, hours, created_at, updated_at)
       values ((select max(id) + 1 from public.user_rust_infos), :userId, :rust_hours, current_timestamp, current_timestamp)
  `;
};

const createRocketLeagueInfoQuery = () => {
  return `
  insert into public.user_rocket_league_infos (id, user_id, hours, created_at, updated_at)
       values ((select max(id) + 1 from public.user_rust_infos), :userId, :rocket_league_hours, current_timestamp, current_timestamp)
  `;
};

module.exports = {
  getUserDataByEmailQuery,
  getUserDataBySteamIdQuery,
  getUserDataByIdQuery,
  searchUserByUsernameQuery,
  getSteamDataQuery,
  storeSteamDataQuery,
  createUserQuery,
  createGeneralInfoQuery,
  createRustInfoQuery,
  createRocketLeagueInfoQuery,
};
