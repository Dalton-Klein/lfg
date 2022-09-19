const getPendingRequestUserIdsQuery = () => {
  return `
      select cr.receiver as userIds
        from gangs.connection_requests cr
       where cr.sender = :userId
             union
      select cr.sender
        from gangs.connection_requests cr
       where cr.receiver = :userId
  `;
};
const getExistingConnectionUserIdsQuery = () => {
  return `
      select c.acceptor as userIds
        from gangs.connections c
       where c.sender = :userId
             union
      select c.sender
        from gangs.connections c
       where c.acceptor = :userId
  `;
};

module.exports = {
  getPendingRequestUserIdsQuery,
  getExistingConnectionUserIdsQuery,
};
