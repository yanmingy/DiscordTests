//The original weather bot?

var Discord = require("discord.js");
var weather = require('weather-js');


//Creates a discord client
var wbot = new Discord.Client();
wbot.loginWithToken("MTk0NTM1NjI4NDgwNzA4NjA5.CknW7A.cyeEpC16MtQzU7qagUJZLJC27SM");

var destroy = false;
var idle = false;
var help = "\nEmote Commands:\n!yum\n!gib\n!shrug\n!fat\n!kyu\n!lennyface\n!sadface\n!ugh\n!fatlenny\n!retard\n!comfort\n\nFunctions:\nSet game: !playing [game]\nGo idle (no response): !idle\nGo online (change from idle): !online\nChange username: !username <new name>\nCurrent Weather: !weather <zip or city>\n5 Day Forecast: !forecast <zip or city>\nRelog: !relog\nShut down bot: !destroy\nMessage to all Channels: !messageall <message>\nMessage one Channel: !message <channel> <message>\n"

//var chan = new Discord.Channel();
//On connection, say hi!
//Client.server is a cache of servers -> Cache of Server Channels 
wbot.on("ready", function(){
	console.log("Bot has connected");
	sendToAll("Ym-Bot has connected. \nFor a list of commands type !ihavedown");
});

//On message functions
wbot.on("message", function(message) {

	var content = message.content;

	if(content ==="!ihavedown"){
		wbot.reply(message,help);
	}

	if(!idle && message.author != wbot.user){

		//console.log(message.author+" "+wbot.user);

		//shortcuts
	    if(content === "kek") {
	        wbot.reply(message, "lenny");
	    }

	    if(content.search("ramen") != -1 || content.search("Ramen") !=-1){
	    	wbot.reply(message, "One ramen please (      ͡      ͜ʖ      ͡     )");
	    }

	    if(content === "!yum"){
	    	wbot.sendMessage(message.channel, "ლ(´ڡ`ლ)");
	    }

	    if(content === "!gib"){
	    	wbot.sendMessage(message.channel, "༼ つ ◕_◕ ༽つ");
	    }

	    if(content === "!shrug"){
	    	wbot.sendMessage(message.channel, "¯\\_(ツ)_/¯");
	    }

	    if(content === "!fat"){
	    	wbot.sendMessage(message.channel, "(￣ー￣)");
	    }

	    if(content === "!kyu"){
	    	wbot.sendMessage(message.channel, "／人◕ ‿‿ ◕人＼﻿");
	    }

	    if(content === "!lennyface"){
	    	wbot.sendMessage(message.channel, "( ͡° ͜ʖ ͡°)");
	    }

	    if(content === "!sadface"){
	    	wbot.sendMessage(message.channel, "(°ʖ̯°)");
	    }

	    if(content === "!ugh"){
	    	wbot.sendMessage(message.channel, "( ͡° ʖ̯ ͡°)");
	    }

	    if(content === "!fatlenny"){
	    	wbot.sendMessage(message.channel, "(      ͡      ͜ʖ      ͡     )");
	    }

	    if(content === "!retard"){
	    	wbot.sendMessage(message.channel, "ヽ(。_°)ノ");
	    }

	    if(content === "!comfort"){
	    	wbot.sendMessage(message.channel, "( T_T)＼(^-^ )");
	    }

	    //Set status to idle. The bot will now ignore everything except !online.
	    if(content === "!idle"){
	    	wbot.setStatusIdle();
	    	idle = true;
	    }

	    var args = content.split(" "); // split by space

	    //Set playing message
	    if (args[0] == "!playing"){
	    	wbot.setPlayingGame(content.substr(9,content.length));
	    }

	    //!weather
	    if(args[0]=="!weather" && args.length>1){
	    	getWeather(message);
	    }

	    //Set username
	    if(args[0] == "!username" && args.length>1){
	    	wbot.setUsername(content.substr(10,content.length));
	    }

	    //!forecast
	    if(args[0]=="!forecast" && args.length>1){
	    	getForecast(message);
	    }

	    //Sends a message to all channels
	    if(args[0] == "!messageall" && args.length>1){
	    	sendToAll(message.author.username+": "+content.substr(12,content.length));
	    }

	    //Sends a message to one channel
	    if(args[0] == "!message" && args.length>2){

	    	sendToChannel(message.author.username+": "+buildString(args,2) , args[1]);
	    }

	}
	else{
		//Goes online (able to function properly)
		if(content === "!online"){
			wbot.setStatusOnline();
			idle = false;
		}
	}

	//Global access regardless of status
	if(content === "!relog"){
	    wbot.logout();
	}

	//console.log(message.author.id);
	if(content === "!destroy" && message.author.id === "152981295616491520"){
		sendToAll("Ym-Bot has disconnected");
		destroy = true;
		setTimeout(function(){wbot.destroy();}, 200);

	}



});

//Disconnect functionality. 
wbot.on("disconnected", function(){

	console.log("Bot has disconnected");

	if(!destroy){
			wbot.loginWithToken("MTk0NTM1NjI4NDgwNzA4NjA5.CknW7A.cyeEpC16MtQzU7qagUJZLJC27SM");
	}


});

//Returns a built string from the split words.
function buildString(args, start){
	var built = "";

	for(i = start; i < args.length; i++){
		built+=args[i]+" ";
	}
	return built.substr(0,built.length-1);
}


//Function for iterating through all channels and sending messages to each channel. Currently, there is no distinction between channels. All channels the bot is in will get the message.
function sendToAll(text_message){
	for(i = 0; i < wbot.servers.length; i++){
		var channel = wbot.servers[i].channels;
			for(j = 0; j < channel.length; j++){
				if(channel[j].type === 'text' && channel[j].name != "botcommands"){
					wbot.sendMessage(channel[j], text_message);
			}
		}
	}
}

//Sends to a specified channel.
function sendToChannel(text_message, channel_name){
	for(i = 0; i < wbot.servers.length; i++){
		var channel = wbot.servers[i].channels;
			for(j = 0; j < channel.length; j++){
				if(channel[j].type === 'text' && channel[j].name == channel_name){
					wbot.sendMessage(channel[j], text_message);
					return;
			}

		}
	}

	wbot.sendMessage(message.channel,"Invalid Channel Name!")
}


//Function for getting the weather. 
function getWeather(message){

	var location = message.content;
	location = location.substr(9,location.length);

	weather.find({search: location, degreeType: 'F'}, function(err, result) {
	  if(err){
	    console.log(err);
	    wbot.sendMessage(message.channel, "Invalid Location");
	  } 
	  else{

	      var weatherData = JSON.parse(JSON.stringify(result));
	      var location_name = weatherData[0].location.name;
	      var temperature = weatherData[0].current.temperature;
	      var sky = weatherData[0].current.skytext;
	      var feelslike = weatherData[0].current.feelslike;
	      var humidity = weatherData[0].current.humidity;
	      var wind = weatherData[0].current.winddisplay;

	      var weatherString = "Location: " + location_name + "\n";
	      weatherString += "Temperature: " + temperature + "F\n";
	      weatherString += "Condition: " + sky + "\n";
	      weatherString += "Feels Like: " + feelslike + "F\n"
	      weatherString += "Humidity: " + humidity + "%\n";
	      weatherString += "Winds: " + wind + "\n";
	      //console.log(weatherString); //Debug
	      wbot.sendMessage(message.channel, weatherString);

	  }
	});

}

function getForecast(message){

	var location = message.content;
	location = location.substr(10,location.length);

	weather.find({search: location, degreeType: 'F'}, function(err, result) {
	  if(err){
	    console.log(err);
	    wbot.sendMessage(message.channel, "Invalid Location");
	  } 
	  else{
	      //console.log(JSON.stringify(result, null, 2));
	      var weatherData = JSON.parse(JSON.stringify(result));
	      var weatherString = "Location:" + weatherData[0].location.name + "\n\n";

	      for(i = 0; i < weatherData[0].forecast.length; i++){
	      	var high = "High: " + weatherData[0].forecast[i].high + "F\n";
	      	var low = "Low: " + weatherData[0].forecast[i].low + "F\n";
	      	var condition = "Condition: " + weatherData[0].forecast[i].skytextday + "\n";
	      	var date = "Date: " + weatherData[0].forecast[i].date + "\n";
	      	var day = "Day: " + weatherData[0].forecast[i].day + "\n";

	      	if(weatherData[0].forecast[i].precip == ''){
	      		var prec = "Precipitation: " + 0 +"%\n";
	      	}
	      	else{
	      		var prec = "Precipitation: " + weatherData[0].forecast[i].precip +"%\n";
	      	}

	      	weatherString += date+day+high+low+condition+prec+"\n";
	      }
	      wbot.sendMessage(message.channel, weatherString);

	  }

	});

}



