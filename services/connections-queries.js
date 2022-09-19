const getConnectionsForUserQuerySenders = () => {
  return `
  select c.sender as user_id,
         c.platform,
         u.id,
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
         ug.psn,
         ug.xbox,
         av1.name as weekends,
         av2.name as weekdays,
         ur.roles,
         ur.play_styles
    from gangs.connections c
    join gangs.users u 
      on u.id = c.sender
    join gangs.user_general_infos ug 
      on ug.user_id = u.id
    join gangs.user_rust_infos ur
      on ur.user_id = u.id
    join gangs.regions r
      on r.id = ug.region
    join gangs.availabilities av1
      on av1.id = ur.weekends
    join gangs.availabilities av2
      on av2.id = ur.weekdays
   where c.acceptor = :userId
`;
};

const getConnectionsForUserQueryAcceptors = () => {
  return `
  select c.acceptor as user_id,
         c.platform,
         u.id,
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
         ug.psn,
         ug.xbox,
         av1.name as weekends,
         av2.name as weekdays,
         ur.roles,
         ur.play_styles
    from gangs.connections c
    join gangs.users u 
      on u.id = c.acceptor
    join gangs.user_general_infos ug 
      on ug.user_id = u.id
    join gangs.user_rust_infos ur
      on ur.user_id = u.id
    join gangs.regions r
      on r.id = ug.region
    join gangs.availabilities av1
      on av1.id = ur.weekends
    join gangs.availabilities av2
      on av2.id = ur.weekdays
   where c.sender = :userId
`;
};

const getIncomingPendingConnectionsForUserQuery = () => {
  return `
  select c.id as requestId,
         c.sender as user_id,
         c.platform,
         c.message,
         u.id as id,
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
         ug.psn,
         ug.xbox,
         av1.name as weekends,
         av2.name as weekdays,
         ur.roles,
         ur.play_styles
    from gangs.connection_requests c
    join gangs.users u 
      on u.id = c.sender
    join gangs.user_general_infos ug 
      on ug.user_id = u.id
    join gangs.user_rust_infos ur
      on ur.user_id = u.id
    join gangs.regions r
      on r.id = ug.region
    join gangs.availabilities av1
      on av1.id = ur.weekends
    join gangs.availabilities av2
      on av2.id = ur.weekdays
   where c.receiver = :userId
`;
};

const getOutgoingPendingConnectionsForUserQuery = () => {
  return `
  select c.id as requestId,
         c.receiver as user_id,
         c.platform,
         u.id,
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
         ug.psn,
         ug.xbox,
         av1.name as weekends,
         av2.name as weekdays,
         ur.roles,
         ur.play_styles
    from gangs.connection_requests c
    join gangs.users u 
      on u.id = c.receiver
    join gangs.user_general_infos ug 
      on ug.user_id = u.id
    join gangs.user_rust_infos ur
      on ur.user_id = u.id
    join gangs.regions r
      on r.id = ug.region
    join gangs.availabilities av1
      on av1.id = ur.weekends
    join gangs.availabilities av2
      on av2.id = ur.weekdays
   where c.sender = :userId
`;
};

const getConnectionInsertQuery = () => {
  return `
  insert into connections (sender, acceptor, platform, created_at, updated_at)
       values (:senderId, :acceptorId, :platform, now(), now())
  `;
};

const removePendingConnectionQuery = () => {
  return `
    delete from connection_requests
          where id = :id
  `;
};
module.exports = {
  getConnectionsForUserQuerySenders,
  getConnectionsForUserQueryAcceptors,
  getIncomingPendingConnectionsForUserQuery,
  getOutgoingPendingConnectionsForUserQuery,
  getConnectionInsertQuery,
  removePendingConnectionQuery,
};
