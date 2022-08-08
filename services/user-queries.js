const getUserDataQuery = () => {
  return `
    select u.email,
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
           ur.user_id,
           av1.name,
           av2.name,
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
     where u.email = :email
  `;
};

const createUserQuery = () => {
  return `
  insert into lfg.public.users (id, email, username, hashed, created_at, updated_at)
       values ((select max(id) + 1 from lfg.public.users), :email, :username, :hashed, current_timestamp, current_timestamp)
    returning id, email, hashed, username
  `;
};

const createGeneralInfoQuery = () => {
  return `
  insert into lfg.public.user_general_infos (id, user_id, created_at, updated_at)
       values ((select max(id) + 1 from lfg.public.user_general_infos), :userId, current_timestamp, current_timestamp)
  `;
};

const createRustInfoQuery = () => {
  return `
  insert into lfg.public.user_rust_infos (id, user_id, created_at, updated_at)
       values ((select max(id) + 1 from lfg.public.user_rust_infos), :userId, current_timestamp, current_timestamp)
  `;
};

module.exports = {
  createUserQuery,
  createGeneralInfoQuery,
  createRustInfoQuery,
  getUserDataQuery,
};
