const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const { getUserInfo, searchForUserByUsername } = require("../services/user-common");
const { EmbedBuilder } = require("discord.js");
const publishController = require("./publish-controller");

const interpretMessage = async (mssg) => {
  //***PROD GANGE TO G, to for nonprod
  const prefix = "g!";
  //Ignore mssg if sent from bot or doesnt have prefix
  if (mssg.author.username === "gangs-bot") return;
  if (mssg.content.substring(0, 2) !== prefix) return;
  //Determine game for command, if no game recognized send an example message
  const args = mssg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === "rust" || command === "rocketLeague" || command === "battleBit") {
    // Check to make sure they added a username to check in the command
    if (args.length === 0) {
      mssg.reply(
        "You forgot to provide a gangs.gg username for the 'rust' command! Example 'g! rust [gangs username]'"
      );
    } else {
      const foundUser = await searchForUserByUsername(args[0]);
      if (foundUser.length) {
        const genCompletionResult = await publishController.checkGeneralProfileCompletion(
          {
            body: {
              userId: foundUser[0].id,
              token: "",
            },
          },
          {},
          false
        );
        //Check if Gen Profile Is Complete
        if (genCompletionResult.status === "success") {
          let userInfo = await getUserInfo(foundUser[0].id);
          //Check if at least gen profile is complete
          userInfo = userInfo[0];
          //Build Message For Rust
          if (command === "rust") {
            //Check If Rust Profile Published
            if (userInfo.rust_is_published) {
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
              mssg.reply("This user has not published their Rust profile!");
            }
          } else if (command === "rocketLeague") {
            if (userInfo.rocket_league_is_published) {
            } else {
              mssg.reply("This user has not published their Rocket League profile!");
            }
          } else if (command === "battleBit") {
            if (userInfo.battle_bit_is_published) {
            } else {
              mssg.reply("This user has not published their BattleBit profile!");
            }
          }
        } else {
          mssg.reply("This user has not completed their profile yet!");
        }
      } else {
        mssg.reply("No gangs.gg gamer found with username");
      }
    }
  } else {
    mssg.reply(
      "You did not provide a valid command! Commands are 'rust', 'rocketLeague', 'battleBit' or 'gang'. Ex: g! rust [gangs username]"
    );
  }
};

module.exports = {
  interpretMessage,
};
