module.exports = (sequelize, DataTypes) => {
  const userGeneralInfo = sequelize.define("user_general_infos", {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    about: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    gender: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    region: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    languages: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
  });

  return userGeneralInfo;
};
