const checkIfUserCanPublishRustProfileQuery = () => {
  return `
      select ug.*, ur.*
        from gangs.user_general_infos ug
        join gangs.user_rust_infos ur
          on ur.user_id = ug.user_id 
       where ug.user_id  = :userId
  `;
};

module.exports = {
  checkIfUserCanPublishRustProfileQuery,
};
