module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define("users", {
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    username: {
      unique: true,
      type: DataTypes.STRING,
      allowNull: false,
    },
    hashed: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    about: {
      type: DataTypes.STRING,
      defaultValue: "",
      allowNull: false,
    },
    numOfStrikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    groupList: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    avatarUrl: {
      type: DataTypes.STRING,
      defaultValue: "/assets/avatarIcon.png",
      allowNull: true,
    },
  });

  return users;
};
