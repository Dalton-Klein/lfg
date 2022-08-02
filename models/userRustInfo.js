module.exports = (sequelize, DataTypes) => {
  const user_rust_infos = sequelize.define("user_rust_infos", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    weekdays: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    weekends: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    roles: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    play_styles: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
  });

  return user_rust_infos;
};
