const createEndorsementQuery = () => {
	return `
    insert into public.endorsements ( receiver_id,
                                      type_id,
                                      sender_id,
                                      value,
                                      created_at,
                                      updated_at) 
        values (:receiverId, 
                :typeId, 
                :senderId, 
                :value,
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

const getEndorsementsForUser = () => {
	return `
        select max(en.id) as id, en.type_id, et.description, sum(en.value) as value
          from public.endorsements en
          join public.endorsement_types et
            on et.id = en.type_id
         where en.receiver_id = :receiverId
      group by en.type_id, et.description
  `;
};

const getEndorsementsBetweenUsersQuery = () => {
	return `
        select en.id as id, en.type_id, et.description, en.value
          from public.endorsements en
          join public.endorsement_types et
            on et.id = en.type_id
         where en.receiver_id = :receiverId
           and en.sender_id = :inputterId
      group by en.id, en.type_id, et.description
  `;
};

const getEndorsementOptionsQuery = () => {
	return `
      select et.*
        from public.endorsement_types et
       where et.platform_id in (:platformIdsToConsider)
    order by platform_id asc
  `;
};

module.exports = {
	createEndorsementQuery,
	removeEndorsementQuery,
	getEndorsementsForUser,
	getEndorsementsBetweenUsersQuery,
	getEndorsementOptionsQuery,
};
