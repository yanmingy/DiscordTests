//https://discordapp.com/oauth2/authorize?client_id=194909892711022593&scope=bot&permissions=0


var Discord = require('discord.io');
var bot = new Discord.Client({
    autorun: true,
    token: "MTk0OTA5OTMxNDUzODA4NjQx.CkszhA.F7I4jBrHocx8WsZGBEMU217fgBw"
});

var chan; //Currently in this voice channel.
var vname; // Current voice channel name

bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")");
});

bot.on('message', function(user, userID, channelID, message, rawEvent) {

    if (message === "$kanye") {
        bot.sendMessage({
            to: channelID,
            message: "west"
        });
    }

    if(message.substr(0,5) == "$join"){
        join(channelID, message.substr(6,message.length));
    }

    if(message.substr(0,6) == "$leave"){
        leave(channelID, message.substr(7,message.length));
    }

    if(message.substr(0,5) === "$play"){
        play(chan, message.substr(6,message.length));
        console.log("Played at "+chan);
    }

    if(message == "$stop"){
        bot.getAudioContext({ channel: chan, stereo: true}, function(stream) {stream.stopAudioFile();});
    }

    if(message == "$disconnect"){
        leave(channelID, vname);
        bot.disconnect();
    }

    if(message == "$help"){
        bot.sendMessage({to: channelID, message: "Join voice channel: $join <voice channel name>\nLeave voice channel: $leave <voice channel name>\nDisconnect from server: $disconnect\nStop playing: $stop\n\nPlay something: $play <Sound Title>\nSound Titles:\nafks\nakarin\nbrb\ngg\nglhf\nhaha\nhighnoon\nhorn\nnooo\nnormies\nns\nraise\ntutu\ntwice1\ntwice2\nwinky\n"});
    }


});

//Joins a specified voice channel.
function join(channelID, vcName){
    var server = bot.channels[channelID].guild_id
    var channels = bot.servers[server].channels;

    Object.keys(channels).forEach(function(key) {
        if(channels[key].name === vcName){
            bot.joinVoiceChannel(channels[key].id);
            chan = channels[key].id;
            vname = vcName;
            console.log("joined: "+chan);
        }
    });
}

//Leaves a channel
function leave(channelID, vcName){

    var server = bot.channels[channelID].guild_id
    var channels = bot.servers[server].channels;

    Object.keys(channels).forEach(function(key) {
        if(channels[key].name === vcName){
            bot.leaveVoiceChannel(channels[key].id);
            console.log("left: "+chan);
            chan = null;
            vname = null;
        }
    });
}

//Plays something on stream.
function play(chan, mp3FilePath){
        bot.getAudioContext({ channel: chan, stereo: true}, function(stream) {
        stream.playAudioFile("sounds/"+mp3FilePath+".mp3"); //To start playing an audio file, will stop when it's done.
        //stream.stopAudioFile(); //To stop an already playing file
        /*stream.once('fileEnd', function() {
            //Do something now that file is done playing. This event only works for files.
        });*/
        // OR
        //stream.send(rawPCMBuffer) //Piping a stream that the backend can execute the method .read(1920) on.

        //Experimental
        //stream.on('incoming', function(ssrc,buffer) {
            //Handle a buffer of PCM data.
        //});
    });
    // OR
    //bot.getAudioContext(channelID, function(stream) {
        //...
    //});
}
