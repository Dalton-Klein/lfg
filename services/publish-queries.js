const format = require("pg-format");

const checkGameProfileCompletionQuery = (tableName) => {
  // Can get data for any games' profile table
  return format(
    `
      select ur.*
        from public.%s ur
       where ur.user_id  = :userId
  `,
    tableName
  );
};

const checkIfUserCanPublishRustProfileQuery = () => {
  return `
      select ug.*, ur.*
        from public.user_general_infos ug
        join public.user_rust_infos ur
          on ur.user_id = ug.user_id 
       where ug.user_id  = :userId
  `;
};

const checkIfUserCanPublishRocketLeagueProfileQuery = () => {
  return `
      select ug.*, url.*
        from public.user_general_infos ug
        join public.user_rocket_league_infos url
          on url.user_id = ug.user_id 
       where ug.user_id  = :userId
  `;
};

const getAllProfilesPublicationStatusQuery = () => {
  return `
      select ur.is_published as rust_status, url.is_published as rocket_league_status
        from public.user_rust_infos ur
   left join public.user_rocket_league_infos url
          on url.user_id = :userId 
       where ur.user_id  = :userId
  `;
};

module.exports = {
  checkGameProfileCompletionQuery,
  checkIfUserCanPublishRustProfileQuery,
  checkIfUserCanPublishRocketLeagueProfileQuery,
  getAllProfilesPublicationStatusQuery,
};
