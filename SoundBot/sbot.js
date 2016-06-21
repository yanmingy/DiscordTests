//https://discordapp.com/oauth2/authorize?client_id=194909892711022593&scope=bot&permissions=0


var Discord = require('discord.io');
var bot = new Discord.Client({
    autorun: true,
    token: "MTk0OTA5OTMxNDUzODA4NjQx.CkszhA.F7I4jBrHocx8WsZGBEMU217fgBw"
});

bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")");
});

bot.on('message', function(user, userID, channelID, message, rawEvent) {
    if (message === "ping") {
        bot.sendMessage({
            to: channelID,
            message: "pong"
        });
    }
});