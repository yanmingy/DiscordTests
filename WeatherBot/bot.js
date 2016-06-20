var Discord = require("discord.js");

var wbot = new Discord.Client();


wbot.on("message", function(message) {
    if(message.content === "ping") {
        wbot.reply(message, "pong");
    }
});

wbot.loginWithToken("MTk0NTM1NjI4NDgwNzA4NjA5.CknW7A.cyeEpC16MtQzU7qagUJZLJC27SM");
// If you still need to login with email and password, use wbot.login("email", "password");