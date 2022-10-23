const format = require('pg-format');

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

module.exports = {
	checkGameProfileCompletionQuery,
	checkIfUserCanPublishRustProfileQuery,
};
