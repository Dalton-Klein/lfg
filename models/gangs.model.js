module.exports = (sequelize, DataTypes) => {
  const gangs = sequelize.define(
    'gangs',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      avatar_url: {
        type: DataTypes.STRING,
        defaultValue: '',
        allowNull: false,
      },
      is_public: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
      is_published: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    },
    { schema: 'public', freezeTableName: true }
  );

  return gangs;
};
