
var Discord = require("discord.js");

var mybot = new Discord.Client();

mybot.on("message", function (message) {
    if (message.content === "ping") {
        mybot.reply(message, "pong");
    }
});

mybot.loginWithToken("MTk1OTg0ODM5MzQwNDU3OTg1.Ck8cmw.UYOOP3-iaxaBPeLvXljO6t3FAvs");
// If you still need to login with email and password, use mybot.login("email", "password");