//The original weather bot?

var Discord = require("discord.js");
var weather = require('weather-js');


//Creates a discord client
var wbot = new Discord.Client();
wbot.loginWithToken("MTk0NTM1NjI4NDgwNzA4NjA5.CknW7A.cyeEpC16MtQzU7qagUJZLJC27SM");

var destroy = false;

//var chan = new Discord.Channel();
//On connection, say hi!
//Client.server is a cache of servers -> Cache of Server Channels 
wbot.on("ready", function(){
	console.log("Bot has connected");
	sendToAll("Ym-Bot has connected");
});

//On message functions
wbot.on("message", function(message) {

	var content = message.content;

    if(content === "kek") {
        wbot.reply(message, "lenny");
    }

    if(content === "!relog"){
    	wbot.logout();
    }

    if(content === "!destroy"){
    	wbot.destroy();
    	destroy = true;
    }

    //!weather
    if(content.substr(0,8)=="!weather"){
    	getWeather(message);
    }

    //!forecast
    if(content.substr(0,9)=="!forecast"){
    	getForecast(message);
    }

});

//Disconnect functionality. 
wbot.on("disconnected", function(){

	sendToAll("Ym-Bot has disconnected")
	console.log("Bot has disconnected");

	if(!destroy){
			wbot.loginWithToken("MTk0NTM1NjI4NDgwNzA4NjA5.CknW7A.cyeEpC16MtQzU7qagUJZLJC27SM");
	}


});


//Function for iterating through all channels and sending messages to each channel. Currently, there is no distinction between channels. All channels the bot is in will get the message.
function sendToAll(text_message){
	for(i = 0; i < wbot.servers.length; i++){
		var channel = wbot.servers[i].channels;
			for(j = 0; j < channel.length; j++){
				if(channel[j].type === 'text'){
					wbot.sendMessage(channel[i], text_message);
			}
		}
	}
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
	location = location.substr(9,location.length);

	weather.find({search: location, degreeType: 'F'}, function(err, result) {
	  if(err){
	    console.log(err);
	    wbot.sendMessage(message.channel, "Invalid Location");
	  } 
	  else{
	      //console.log(JSON.stringify(result, null, 2));
	      var weatherData = JSON.parse(JSON.stringify(result));
	      var weatherString = "";

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



