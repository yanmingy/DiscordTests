//https://discordapp.com/oauth2/authorize?client_id=194909892711022593&scope=bot&permissions=0 

//Bot for storing sound files and playing them in discord server. Currently is only allowed to save mp3. Don't know if it can stream other files through ffmpeg.
/*
$join <voice channel name>
$leave <voice channel name>
$disconnect
$stop
$play <sound>
$help

You will need node-opus and ffmpeg as well as discord.io for this to run properly.

*/


var Discord = require('discord.io');
const fs = require('fs'); // Need this to parse through the sound folder.

var bot = new Discord.Client({
    autorun: true,
    token: "MTk0OTA5OTMxNDUzODA4NjQx.CkszhA.F7I4jBrHocx8WsZGBEMU217fgBw"
});

var chan; //Currently in this voice channel.
var vname; // Current voice channel name
var sound_titles = "";
//var sound_length = 0;
var terminate = false;


bot.on('ready', function() {
    console.log(bot.username + " - (" + bot.id + ")");
    getSoundNames();

});

//Grabbing raw data
bot.on('debug', function(rawEvent) { 
//console.log(rawEvent["t"]);
var data = rawEvent["d"];
//console.log(rawEvent["d"]);
if(data!=null && data!=undefined){
    var user_id;
    var channelID;
    var guild_id;
    var name;

    Object.keys(rawEvent["d"]).forEach(function(key) {


        if(key == "user_id"){
            user_id = data[key];

        }
        else if(key == "channel_id"){
            channelID = data[key];

        }
        else if(key == "guild_id"){
            guild_id = data[key];

        }
        else if(key == "name"){
            name = data[key];
        }

    });

    //Do this outside of the loop.

    if(rawEvent["t"] == "VOICE_STATE_UPDATE"){
        if(user_id == bot.id){
            console.log(user_id + " user_id");
            console.log(channelID + " channelID");
            console.log(guild_id + " guild_id");
            console.log("\n");
           //console.log(key);
           //console.log(data[key]);
            //var server = bot.channels[channelID].guild_id;
            var channels = bot.servers[guild_id].channels;
            //console.log(bot.servers);

            Object.keys(channels).forEach(function(key2) {

                if(channels[key2].id == channelID){
                    console.log(channels[key2].name);
                    vname = channels[key2].name;
                    chan = channelID;

                    setTimeout(function(){
                        playLocal(chan, "hello");
                    }, 500);

                    console.log("joined: "+chan);
                }
            });


        }
    }
}
});

//When discord updates, it auto disconnects the bot, this auto reconnects it.
bot.on('disconnect', function(errMsg, code) {
    if(!terminate){
        bot.connect();
        console.log("Auto Reconnect");       
    }

 });

bot.on('message', function(user, userID, channelID, message, rawEvent) {

    var args = message.split(" ");

    if(message.toLowerCase().search("kanye") != -1 ){
        send_text(channelID, "west");
    }

    if(args[0] == "$join"){
        join(channelID, message.substr(6,message.length));
    }

    if(args[0] == "$leave"){
        leave(channelID, message.substr(7,message.length));
    }

    if (args[0] === "$play") {

        //play(chan, message.substr(6, message.length));

        fs.stat("sounds/" + message.substr(6, message.length)+".mp3", function (err, stats) {
            if (err) {
                console.log(err);
                console.log("Tried to play something that DNE");
                send_text(channelID, message.substr(6, message.length) + " does not exist");
            }
            else {
                if (stats.isFile()) {
                    playLocal(chan, message.substr(6, message.length));
                    console.log("Played " + message.substr(6, message.length) + " at " + chan);
                }
            }
        });

    }

    if(message == "$stop"){
        bot.getAudioContext({ channel: chan, stereo: true}, function(stream) {stream.stopAudioFile();});
    }

    if(message == "$disconnect"){
        leave(channelID, vname);
        terminate = true;
        bot.disconnect();

    }

    if(message == "$help"){
        send_text(channelID, "Join voice channel: $join <voice channel name>\nLeave voice channel: $leave <voice channel name>\nDisconnect from server: $disconnect\nStop playing: $stop\n\nPlay something: $play <Sound Title>\nSound Titles:\n" + sound_titles);
        //Add a new mp3: $save <url.mp3> <name>
        //Remove a mp3: $rm <name>
        //\nSound Count: $cnt
    }

    //Plays mp3 url
    if(args[0] == "$playURL"){

        if(args.length < 2){
            send_text(channelID, "Too many arguments.");
        }
        else if(args[1].substr(args[1].length-4, args[1].length) != ".mp3"){
            send_text(channelID, "URL needs to end with .mp3");
        }
        else{
            playURL(chan,args[1]);
        }
    }

    //If you add a sound, update the help list. Not Safe
    /*if(args[0] == "$save" && bot.id != userID){


        if(args.length < 3){
            send_text(channelID, "$save <url> <name>");
        }
        else if(args[1].substr(args[1].length-4, args[1].length) != ".mp3" && args.length >= 3){
            send_text(channelID, "URL needs to end with .mp3");
        }
        else if(sound_titles>=200){
            send_text(channelID, "Too many sounds currently stored. Please delete some.\nCurrently stored sounds: " + sound_titles + "/200");
        }
        else{
            var name = buildString(args,2);
            saveFile(args[1], name, channelID);
        }
    }*/

    /*if(args[0] == "$rm"){
        deleteSound(message.substr(4,message.length), channelID);
    }*/

    /*if(message == "$cnt"){
        getSoundNames();
        send_text(channelID, "Currently stored sounds: " + sound_length + "/200");
    }*/
});

//Grabs all the sound names for use in help. Also keeps track of how many songs are in the song folder. 
function getSoundNames(){

    var sounds = fs.readdirSync("sounds");
    sound_length = sounds.length;
    //Grabs sound titles.
    for(i = 0; i < sounds.length; i++){
        var title = sounds[i].substr(0,sounds[i].length-4);
        //console.log(title);
        sound_titles += title +"\n";
    }
}

//Unlinks the sound.
/*function deleteSound(name, channelID){
    fs.unlink('sounds/'+name+".mp3", function(err) {
       if (err) {
            send_text(channelID, "Sound not found");
            return console.log(err);
       }
       getSoundNames();
       console.log("File deleted successfully!");
       send_text(channelID, name+".mp3 has been deleted. "+"\nCurrently stored sounds: " + sound_length + "/200");

    });
}*/

//Abstraction for bot sending text.
function send_text(channelID, text_message){
    bot.sendMessage({
        to: channelID,
        message: text_message
    });
}

//Joins a specified voice channel.
function join(channelID, vcName){
    //console.log(channelID);
    try{
        var server = bot.channels[channelID].guild_id;
        var channels = bot.servers[server].channels;

        if(server != undefined && server !=null){
            Object.keys(channels).forEach(function(key) {
                if(channels[key].name === vcName){
                    bot.joinVoiceChannel(channels[key].id);
                }
        });
    }

    }
    catch(err){
        send_text(channelID, "Channel doesn't exist on this server.");
    }


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

//Saves a new mp3 files into the
/*function saveFile(url, name, channelID) {
    var req;
    if (url.search("https") != -1) {
        req = require('https');
    }
    else {
        req = require('http');
    }


    request = req.get(url, function (response) {
        if (response.statusCode === 200) {
            var file = fs.createWriteStream("sounds/"+name+".mp3");
            response.pipe(file);
            getSoundNames();
            send_text(channelID, "Saved mp3: " +name);
            console.log("Saved mp3: " +name);
        }
        // Add timeout.
        request.setTimeout(12000, function () {
            console.log("Invalid url or your file was too big.");
            request.abort();
        });
    }).on('error', (e) => {
        console.log(`Got error: ${e.message}`);
        send_text(channelID, "Invalid url")
        });
}*/

//Returns a built string from the split words.
function buildString(args, start){
    var built = "";

    for(i = start; i < args.length; i++){
        built+=args[i]+" ";
    }
    return built.substr(0,built.length-1);
}


//Plays something on stream.
function playLocal(chan, mp3FilePath){
        bot.getAudioContext({ channel: chan, stereo: true}, function(stream) {
        stream.playAudioFile("sounds/"+mp3FilePath+".mp3"); //To start playing an audio file, will stop when it's done.
        //stream.playAudioFile(mp3FilePath);
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

//Plays url mp3
function playURL(chan, URL){
        bot.getAudioContext({ channel: chan, stereo: true}, function(stream) {
        stream.playAudioFile(URL); //To start playing an audio file, will stop when it's done.
    });
}
