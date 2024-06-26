module.exports = (sequelize, DataTypes) => {
  const users = sequelize.define(
    "users",
    {
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
        defaultValue: "",
        allowNull: false,
      },
      input_device_id: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false,
      },
      output_device_id: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false,
      },
      is_email_notifications: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      is_email_marketing: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    { schema: "public", freezeTableName: true }
  );

  return users;
};
