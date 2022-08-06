module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define("users", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
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
    numOfStrikes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: true,
    },
    groupList: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      defaultValue: [],
    },
    avatar_url: {
      type: DataTypes.STRING,
      defaultValue: "/assets/avatarIcon.png",
      allowNull: true,
    },
  });

  return users;
};
