module.exports = (sequelize, DataTypes) => {
  const gang_roster = sequelize.define( 
    'gang_roster',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      gang_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    { schema: 'public', freezeTableName: true }
  );

  return gang_roster;
};
