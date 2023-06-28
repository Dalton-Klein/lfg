const { sequelize } = require("../../models");

const schemaName = "public";
const tableName = "users";
const columnName = "steam_id";
const dataType = "varchar(255)"; //bit | int | char(5) | varchar(255)
const nullSetting = "not null"; // 'not null' | ''
const defaultValue = `""`;

module.exports = {
  up: async ({ context: sequelize }) => {
    await sequelize.query(
      `
			  do $$
				begin
        if not exists (
                      select column_name from information_schema.columns
                       where column_name = N'${columnName}'
                         and table_name = N'${tableName}'
                      )
				then
                 alter table ${schemaName}.${tableName}
                   add column ${columnName} ${dataType} default '' ${nullSetting};
				end if;
				end;
				$$;
      `
    );
  },

  down: async ({ context: sequelize }) => {
    return "nothing happened cause no function yet!";
  },
};
