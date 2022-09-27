const createNotificationQuery = () => {
	return `
    insert into public.notifications ( owner_id,
                                  type_id,
                                  other_user_id,
                                  created_at,
                                  updated_at) 
        values (:ownerId, 
                :typeId, 
                :otherUserId, 
                now(), 
                now())
     returning id;
`;
};

const removeNotificationQuery = () => {
	return `
      delete from public.notifications
            where owner_id = :ownerId
              and type_id = :typeId
              and other_user_id = :otherUserId
  `;
};

const getNotificationsQuery = () => {
	return `
         select n.*, u.username as other_username, u.avatar_url as other_user_avatar_url
           from public.notifications n
      left join public.users u
             on u.id = n.other_user_id
          where owner_id = :ownerId
       order by n.created_at desc
  `;
};

module.exports = {
	createNotificationQuery,
	removeNotificationQuery,
	getNotificationsQuery,
};
