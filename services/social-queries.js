const getPendingRequestUserIdsQuery = () => {
  return `
      select cr.receiver as userIds
        from public.connection_requests cr
       where cr.sender = :userId
             union
      select cr.sender
        from public.connection_requests cr
       where cr.receiver = :userId
  `;
};
const getExistingConnectionUserIdsQuery = () => {
  return `
      select c.acceptor as userIds
        from public.connections c
       where c.sender = :userId
             union
      select c.sender
        from public.connections c
       where c.acceptor = :userId
  `;
};

module.exports = {
  getPendingRequestUserIdsQuery,
  getExistingConnectionUserIdsQuery,
};
