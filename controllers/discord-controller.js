const Sequelize = require("sequelize");
const { sequelize } = require("../models/index");
const { getUserInfo, searchForUserByUsername } = require("../services/user-common");
const { searchForGang, formGangInfoObject } = require("../controllers/gangs-controller");
const { EmbedBuilder, hyperlink } = require("discord.js");
const publishController = require("./publish-controller");
const moment = require("moment");

const interpretMessage = async (mssg) => {
  //***PROD GANGE TO G, t for nonprod
  const prefix = "g!";
  //Ignore mssg if sent from bot or doesnt have prefix
  if (mssg.author.username === "gangs-bot") return;
  if (mssg.content.substring(0, 2) !== prefix) return;
  //Determine game for command, if no game recognized send an example message
  const args = mssg.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();
  if (command === "help") {
    const embed = new EmbedBuilder()
      .setColor("#cc2936")
      .setTitle(`The gangs bot is here to help! Here is some helpful info.`)
      .addFields(
        {
          name: "Command Structure",
          value:
            "The commands have three parts [g!] to use the bot [game/group] to signify if you are pulling game stats or group info and [username/groupname] to signify the gamer or group.",
          inline: false,
        },
        {
          name: "Example 1",
          value:
            "'g! rust javascripted' would pull stats for the user 'javascripted' so other people can team with him.",
          inline: false,
        },
        {
          name: "Example 2",
          value: "'g! gang Rust Crew' would pull stats for the gang 'Rust Crew' so other people can join that gang.",
          inline: false,
        },
        {
          name: "Tip 1",
          value: "If you mispell the username, it will tell you that no user or group can be found",
          inline: false,
        },
        {
          name: "Tip 2",
          value: "You can prevent your profile from being accessed by 'unpublishing' your games profile on gangs.gg",
          inline: false,
        },
        {
          name: "Tip 3",
          value: "Supported games right now are rust, rocketLeague, and battleBit spelled exactly as they are here.",
          inline: false,
        }
      );
    mssg.reply({ embeds: [embed] });
  } else if (command === "rust" || command === "rocketLeague" || command === "battleBit") {
    // Check to make sure they added a username to check in the command
    if (args.length === 0) {
      mssg.reply(
        "You forgot to provide a gangs.gg username for the 'rust' command! Example 'g! rust [gangs username]'"
      );
    } else {
      const searchField = args.join(" ").trim();
      const foundUser = await searchForUserByUsername(searchField);
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
              const link = hyperlink(`${userInfo.username}'s profile`, `https://www.gangs.gg/#/profile/${userInfo.id}`);
              const embed = new EmbedBuilder()
                .setColor("#cc2936")
                .setTitle(`I am looking for Rust Teammates! Here is my info.`)
                .setThumbnail(userInfo.avatar_url)
                .setFooter({
                  iconURL:
                    "https://res.cloudinary.com/kultured-dev/image/upload/v1663879717/logo-v2-gangs.gg_womiyc.png",
                  text: `gangs bot  •  requested by ${mssg.author.username}`,
                })
                .setTimestamp()
                .addFields(
                  { name: "Connect With Me On gangs.gg", value: link, inline: false },
                  { name: "Username", value: `${userInfo.username}`, inline: true },
                  { name: "Age", value: `${userInfo.age}`, inline: true },
                  {
                    name: "About Me",
                    value: `${userInfo.about && userInfo.about.length > 0 ? userInfo.about.substring(0, 1023) : ""}`,
                    inline: true,
                  },
                  { name: "Hours", value: `${userInfo.rust_hours}`, inline: true },
                  {
                    name: "Server Type",
                    value: `${userInfo.rust_server_type_id === 1 ? "vanilla" : `${userInfo.rust_server_type_id}x`}`,
                    inline: true,
                  },
                  { name: "Region", value: `${userInfo.region_name}`, inline: true },
                  { name: "Weekday Availability", value: `${userInfo.rust_weekdays}`, inline: true },
                  { name: "Weekend Availability", value: `${userInfo.rust_weekends}`, inline: true }
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
        mssg.reply("No gangs.gg gamer found with username provided");
      }
    }
  } else if (command === "gang") {
    // Check to make sure they added a username to check in the command
    if (args.length === 0) {
      mssg.reply("You forgot to provide a gangs.gg gang name for the 'gang' command! Example 'g! gang [gang name]'");
    } else {
      const searchField = args.join(" ").trim();
      const foundGroup = await searchForGang(searchField);
      if (foundGroup && foundGroup.id && foundGroup.id > 0) {
        let gangInfo = await formGangInfoObject(foundGroup.id, -1);
        //Check if at least gen profile is complete
        const link = hyperlink(
          `${gangInfo.basicInfo.name}'s gang page`,
          `https://www.gangs.gg/#/gang/${gangInfo.basicInfo.id}`
        );
        const formattedRequirements = gangInfo.requirements.map((item) => `• ${item.description}`).join("\n");
        const embed = new EmbedBuilder()
          .setColor("#cc2936")
          .setTitle(`My gang is looking for Rust players! Here is our info.`)
          .setThumbnail(gangInfo.basicInfo.avatar_url)
          .setFooter({
            iconURL: "https://res.cloudinary.com/kultured-dev/image/upload/v1663879717/logo-v2-gangs.gg_womiyc.png",
            text: `gangs bot  •  requested by ${mssg.author.username}`,
          })
          .setTimestamp()
          .addFields(
            { name: "Join Our Gang On gangs.gg", value: link, inline: false },
            { name: "Group Name", value: `${gangInfo.basicInfo.name}`, inline: true },
            {
              name: "About",
              value: `${
                gangInfo.basicInfo.about && gangInfo.basicInfo.about.length > 0
                  ? gangInfo.basicInfo.about.substring(0, 1023)
                  : ""
              }`,
              inline: true,
            },
            { name: "Member Count", value: `${gangInfo.basicInfo.members.length}`, inline: true },
            {
              name: "Requirements",
              value: `${gangInfo.requirements[0] ? formattedRequirements : "none"}`,
              inline: true,
            }
          );
        mssg.reply({ embeds: [embed] });
      } else {
        mssg.reply(`There is no gang called ${searchField}!`);
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
