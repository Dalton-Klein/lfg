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
    from lfg.public.connections c
    join lfg.public.users u 
      on u.id = c.sender
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
    from lfg.public.connections c
    join lfg.public.users u 
      on u.id = c.acceptor
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
   where c.sender = :userId
`;
};

const getIncomingPendingConnectionsForUserQuery = () => {
  return `
  select c.id as requestId,
         c.sender as user_id,
         c.platform,
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
    from lfg.public.connection_requests c
    join lfg.public.users u 
      on u.id = c.sender
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
    from lfg.public.connection_requests c
    join lfg.public.users u 
      on u.id = c.receiver
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
    delete from connections
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
