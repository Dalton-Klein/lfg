const getRustTilesQuery = () => {
  return `
    select p.id, 
          p.content, 
          p.owner, 
          u.username, 
          u.avatar_url, 
          p.number_votes, 
          p."createdAt" as created_at, 
          p."updatedAt" as updated_at, 
          p.photo_url,
          c.name as category, 
          c.color as category_color,
          c.color,
          (SELECT array(
                  SELECT t.name
                    FROM topics t
                  WHERE t.id = any(p.topics) )) AS topic_names,
          (SELECT array(
                  SELECT t.color
                    FROM topics t
                  WHERE t.id = any(p.topics) )) AS topic_colors
      from posts p
      join users u
        on u.id = p.owner
      join categories c
        on c.id = p.categories
    order by p."createdAt" desc
`;
};

module.exports = {
  getRustTilesQuery,
};
