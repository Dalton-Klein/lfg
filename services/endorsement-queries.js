const createEndorsementQuery = () => {
	return `
    insert into public.endorsements ( receiver_id,
                                      type_id,
                                      sender_id,
                                      is_positive,
                                      created_at,
                                      updated_at) 
        values (:receiverId, 
                :typeId, 
                :senderId, 
                :isPositive,
                now(), 
                now())
     returning id;
`;
};

const removeEndorsementQuery = () => {
	return `
      delete from public.endorsements
            where receiver_id = :receiverId
              and type_id = :typeId
              and sender_id = :senderId
  `;
};

module.exports = {
	createEndorsementQuery,
	removeEndorsementQuery,
};
