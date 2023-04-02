const { sequelize } = require('../../models');

const schemaName = 'public';
const tableName = 'gangs';
const columnName = 'chat_platform_id';
const dataType = 'bit'; //bit | int | char(5) | varchar(255)
const nullSetting = 'not null'; // 'not null' | ''
const constraintName = 'DF__gangs__chat_platform_id';
const defaultValue = 0;

module.exports = {
	up: async ({ context: sequelize }) => {
		const transaction = await sequelize.transaction();
		await sequelize.query(
			`
        if not exists (
                      select 1 from sys.columns
                       where name = N'${columnName}'
                         and object_id = object_id(N'${schemaName}.${tableName}')
                      )
                 alter table ${schemaName}.${columnName}
                         add ${columnName} ${dataType} ${nullSetting}
                  constraint ${constraintName}
                     default (${defaultValue})
                 with values
      `,
			{ transaction }
		);
		const result = await sequelize.query(
			`
        select 1 from sys.columns
        where name = N'${columnName}'
        and object_id = object_id(N'${schemaName}.${tableName}')
      `,
			{ transaction }
		);

		if (result[1] !== 1) {
			await transaction.rollback();
			throw new Error(`Column ${schemaName}.${tableName}.${columnName} not created due to error`);
		} else {
			return await transaction.commit();
		}
	},

	down: async ({ context: sequelize }) => {
		return 'nothing happened cause no function yet!';
	},
};
