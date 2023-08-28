const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const { getUserInfo, searchForUserByUsername } = require("../services/user-common");
const { EmbedBuilder } = require("discord.js");

const interpretMessage = async (mssg) => {
  const prefix = "g!";
  if (mssg.author.username === "gangs-bot") return;
  if (mssg.content.substring(0, 2) !== prefix) return;
  console.log("mssg? ", mssg);
  const args = mssg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === "rust" || command === "rocketLeague" || command === "battleBit") {
    // Command-specific argument recommendation
    if (args.length === 0) {
      mssg.reply("You forgot to provide a gangs.gg username for the 'rust' command! Example 'g! rust admin'");
    } else {
      const foundUser = await searchForUserByUsername(args[0]);
      if (foundUser.length) {
        let userInfo = await getUserInfo(foundUser[0].id);
        userInfo = userInfo[0];
        const embed = new EmbedBuilder()
          .setColor("#0099ff")
          .setTitle(`I am looking for Rust Teammates! Here is my info.`)
          .addFields(
            { name: "Username", value: `${userInfo.username}` },
            { name: "Age", value: `${userInfo.age}` },
            {
              name: "About Me",
              value: `${userInfo.about && userInfo.about.length > 0 ? userInfo.about.substring(0, 1023) : ""}`,
            },
            { name: "Region", value: `${userInfo.region_name}` },
            { name: "Hours", value: `${userInfo.rust_hours}` },
            {
              name: "Preferred Server Type",
              value: `${userInfo.rust_server_type_id === 1 ? "vanilla" : `${userInfo.rust_server_type_id}x`}`,
            },
            { name: "Weekday Availability", value: `${userInfo.rust_weekdays}` },
            { name: "Weekend Availability", value: `${userInfo.rust_weekends}` },
            { name: "Connect With Me On gangs.gg", value: `https://www.gangs.gg/#/profile/${userInfo.id}` }
          );

        mssg.reply({ embeds: [embed] });
      } else {
        mssg.reply("No gangs.gg gamer found with username");
      }
    }
  } else {
    mssg.reply("You did not provide a valid command! Commands are 'rust', 'rocketLeague', 'battleBit' or 'gang'");
  }
};

module.exports = {
  interpretMessage,
};
