module.exports = (sequelize, DataTypes) => {
  const steam_data = sequelize.define(
    "steam_data",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      steam_id: {
        type: DataTypes.STRING(18),
        allowNull: false,
        defaultValue: 0,
      },
      communityvisibilitystate: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 0,
      },
      avatar_url: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 0,
      },
    },
    { schema: "public", freezeTableName: true }
  );

  return steam_data;
};
