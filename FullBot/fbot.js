
var Discord = require("discord.js");

var fbot = new Discord.Client();
var voice;

fbot.on("ready", function () {
    console.log("Bot has connected");
    for (i = 0; i < fbot.servers.length; i++) {
        var channel = fbot.servers[i].channels;
        for (j = 0; j < channel.length; j++) {
            if (channel[j].type === 'voice') {

                fbot.joinVoiceChannel(channel[j], function (err, connection) {

                    if (err) {
                        console.log("There was an error in your shitty code.");
                        console.log(err);
                    }
                    else {
                        voice = connection;
                    }

                });
                return;
            }

        }
    }
});



fbot.on("message", function (message) {
    if (message.content === "ping") {
        fbot.reply(message, "pong");
    }

    if (voice != undefined) {
        console.log("playing");
        voice.setVolume(0.25);
        voice.playFile("http://mp3komplit.wapka.mobi/music/down/45802342/2692558/NjBiNHN2RndUV0lod2YzUXE0UmVMSDVKdytGd3RudU44WWYzZEQ5bUNnN1JmN0xyUGc=/SISTAR+-+I+Like+That.mp3");
    }


});

fbot.loginWithToken("MTk1OTg0ODM5MzQwNDU3OTg1.Ck8cmw.UYOOP3-iaxaBPeLvXljO6t3FAvs");