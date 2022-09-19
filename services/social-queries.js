const getPendingRequestUserIdsQuery = () => {
	return `
      select cr.receiver as userIds
        from lfg.public.connection_requests cr
       where cr.sender = :userId
             union
      select cr.sender
        from lfg.public.connection_requests cr
       where cr.receiver = :userId
  `;
};
const getExistingConnectionUserIdsQuery = () => {
	return `
      select c.acceptor as userIds
        from lfg.public.connections c
       where c.sender = :userId
             union
      select c.sender
        from lfg.public.connections c
       where c.acceptor = :userId
  `;
};

module.exports = {
	getPendingRequestUserIdsQuery,
	getExistingConnectionUserIdsQuery,
};
