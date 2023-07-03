module.exports = (sequelize, DataTypes) => {
  // Use this script to seed initial account data
  // INSERT INTO public.user_battle_bit_infos (id, user_id, hours, preferred_playlist, preferred_class, rank, created_at, updated_at)
  //        SELECT u.id, u.id, 0, 1, 1, 1, NOW(), NOW()
  //          FROM public.users u;
  const user_battle_bit_infos = sequelize.define(
    "user_battle_bit_infos",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      hours: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      preferred_class: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      preferred_playlist: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      weekdays: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      weekends: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      is_published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    { schema: "public", freezeTableName: true }
  );

  return user_battle_bit_infos;
};
