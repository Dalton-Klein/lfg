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
         select n.*, n.id as notification_id, u.username as other_username, u.avatar_url as other_user_avatar_url
           from public.notifications n
      left join public.users u
             on u.id = n.other_user_id
          where n.owner_id = :ownerId
       order by n.created_at desc
  `;
};

const getLastNotificationOfTypeQuery = () => {
  return `
         select n.*, n.id as notification_id
           from public.notifications n
          where n.owner_id = :ownerId
            and n.type_id = :typeId
       order by n.created_at desc
  `;
};

const getAllNotificationsQuery = () => {
  return `
         select n.*, u1.username as owner_username, u1.avatar_url as owner_avatar_url,
                u.username as other_username, u.avatar_url as other_user_avatar_url
           from public.notifications n
      left join public.users u
             on u.id = n.other_user_id
      left join public.users u1
             on u1.id = n.owner_id
          where n.type_id != 3
       order by n.created_at desc
  `;
};

module.exports = {
  createNotificationQuery,
  removeNotificationQuery,
  getNotificationsQuery,
  getLastNotificationOfTypeQuery,
  getAllNotificationsQuery,
};
