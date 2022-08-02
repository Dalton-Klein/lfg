const getConnectionsForUserQuerySenders = () => {
  return `
  select c.sender as user_id,
         u.id,
         u.username,
         u.avatar_url,
         ug.last_seen,
         ug.about,
         ug.age,
         ug.gender,
         ug.platforms,
         ug.discord,
    from lfg.public.connections c
    join lfg.public.users u 
      on u.id = c.sender
    join lfg.public.user_general_infos ug 
      on ug.user_id = u.id
   where c.acceptor = :userId
`;
};

const getConnectionsForUserQueryAcceptors = () => {
  return `
  select c.acceptor as user_id,
         u.id,
         u.username,
         u.avatar_url,
         ug.last_seen,
         ug.about,
         ug.age,
         ug.gender,
         ug.platforms,
         ug.discord,
    from lfg.public.connections c
    join lfg.public.users u 
      on u.id = c.acceptor
    join lfg.public.user_general_infos ug 
      on ug.user_id = u.id
   where c.sender = :userId
`;
};

module.exports = {
  getConnectionsForUserQuerySenders,
  getConnectionsForUserQueryAcceptors,
};
