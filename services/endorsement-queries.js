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

module.exports = {
  createEndorsementQuery,
  removeEndorsementQuery,
  getEndorsementsForUser,
};
