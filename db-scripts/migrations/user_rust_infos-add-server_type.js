const { sequelize } = require("../../models");

const schemaName = "public";
const tableName = "user_rust_infos";
const columnName = "server_type_id";
const dataType = "int"; //bit | int | char(5) | varchar(255)
const nullSetting = "not null"; // 'not null' | ''
const defaultValue = `1`;

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
                   add column ${columnName} ${dataType} default ${defaultValue} ${nullSetting};
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
