const checkIfUserCanPublishRustProfileQuery = () => {
	return `
      select ug.*, ur.*
        from lfg.public.user_general_infos ug
        join lfg.public.user_rust_infos ur
          on ur.user_id = ug.user_id 
       where ug.user_id  = :userId
  `;
};

module.exports = {
	checkIfUserCanPublishRustProfileQuery,
};
