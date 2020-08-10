const Discord = require('discord.js');
const client = new Discord.Client();
const config = require(`./config.json`);
const fs = require('fs')
const util = require('util')

var express = require('express');
var app = express();

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

//console.log ping recieved from Uptimebot (used to keep project online even after 5 minutes of innactivity)
const http = require('http');
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});

client.on('message', message => {
  var args = message.content.split(/[ ]/);
    
    var command = message.content.split(" ")[0];
    command = command.toLowerCase().slice(config.prefix.length);



if(command === "ping") {
  message.channel.send(`pong - moderation`)
}


if(command === 'purge') {
  if(args[0].length > 6 + config.prefix.length) return;
	  if (!message.member.hasPermission('MANAGE_MESSAGES') && message.author.id !== config.owner) return message.channel.send('Sorry! Only Staff members with the Manage Messages Permissuon can use this command')
    if(args.slice(1).length < 1) {
      message.channel.send('How many messages do you want me to delete? (max 99)').catch(console.error);
    } else {
      if(args.slice(1) === "0") {
        message.channel.send('I\'m sorry, i cant do that, try again, (max messages 99)').catch(console.error);
      } else {
      if(args[1].length >= 3) {
        message.channel.send('Whoaaaaaaaaaaaaaaaah, too many bro, the most i can delete is 99, and if the messages are over 2 weeks old, better go get some coffee, i cant delete them').catch(console.error);
      } else {
        var msg;
        if(args.length === 1) {
            msg=2;
        } else {
          msg=parseInt(args[1]) + 1;
        }
        message.channel.fetchMessages({limit: msg}).then(messages => {
          if(messages.size <= 1) return;
          message.channel.bulkDelete(messages)}).catch(console.log).then(() => {
				message.channel.send(`${msg -1} message(s) deleted`).then(m => {
					m.delete(5000)
				})});
      }
    }
  }
}


    if(command === "kick") {
//    	if(!message.member.hasPermission("KICK_MEMBERS")) return message.reply('Sorry! Only Staff members with the Kick Members Permissuon can use this command');
    	
    	var user = message.mentions.users.first();
    	var author = message.author;
    	var reason = args.slice(2).join(" ");
    	var modlog = message.guild.channels.find('name', 'warning-log');
    	
        if(!user) return message.reply('Who are you kicking?? Try again: u!kick <@user> <reason>');
        if(!reason) return message.reply(`Why are you kicking ${user}? Try again: u!kick <@user> <reason>`);
        if(!modlog) return message.reply('I cannot find a mod-log channel, please make a text channel named `mod-logs`').catch(console.error);
        
        	const embed = new Discord.RichEmbed()
			 .setColor(0x00AE86)
			 .setTimestamp()
			 .setDescription(`**Action:** Kick\n**Target:** ${user}\n**Moderator:** ${author}\n**Reason:** ${reason}`);

			 client.channels.get(modlog.id).send({embed}).catch(console.error);
        
        user.send(`
        **Kick Warning**
        
You been kicked from \`${message.guild.name}\` for \`${reason}\``);
        message.guild.member(user).kick().then(() => {
        	message.channel.send(`${author.username} has kicked ${user} for ${reason}`);
        });
    }
    
        if(command === "ban") {
    	if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply('Sorry! Only Staff members with the Ban Members Permissuon can use this command!');
    	
    	var user = message.mentions.users.first();
    	var author = message.author;
    	var reason = args.slice(2).join(" ");
    	var modlog = message.guild.channels.find('name', 'warning-log');
    	
        if(!user) return message.reply('Who are you banning?? Try again: u!ban <@user> <reason>');
        if(!reason) return message.reply(`Why are you banning ${user}? Try again: u!ban <@user> <reason>`);
        var modlog = message.guild.channels.find('name', 'warning-log');
        if(!modlog) return message.reply('I cannot find a mod-log channel, please make a text channel named `mod-logs`').catch(console.error);
        
        	const embed = new Discord.RichEmbed()
			 .setColor(0x00AE86)
			 .setTimestamp()
			 .setDescription(`**Action:** Ban\n**Target:** ${user}\n**Moderator:** ${author}\n**Reason:** ${reason}`);

			 client.channels.get(modlog.id).send({embed}).catch(console.error);
        
        user.send(`
        **Ban Warning**
        
You been banned from \`${message.guild.name}\` for \`${reason}\``);
        message.guild.member(user).ban().then(() => {
        	message.channel.send(`${author.username} has banned ${user} for ${reason}`);
        });
    }
    
    if(command === "unban") {
    	if(!message.member.hasPermission("BAN_MEMBERS")) return message.reply("Sorry! Only Staff members with the Ban Members Permissuon can use this command!");
    	
    	var user = message.mentions.users.first();
    	var author = message.author;
    	var reason = args.slice(2).join(" ");
     	var modlog = message.guild.channels.find('name', 'warning-log');
     	
     	
        if(!modlog) return message.reply('I cannot find a mod-log channel, please make a text channel named `mod-logs`').catch(console.error);
        
        	const embed = new Discord.RichEmbed()
			 .setColor(0x00AE86)
			 .setTimestamp()
			 .setDescription(`**Action:** Unban\n**Target:** <@${args.slice(1).join(" ")}>\n**Moderator:** ${author}`);

			 client.channels.get(modlog.id).send({embed}).catch(console.error);
			 
			 message.guild.unban(args.slice(1).join(" ")).then(user => {
			 	message.channel.send(`<@${author.id}> has unbanned ${user.username}#${user.discriminator}/<@${user.id}>.`)
			 });
    }
    if(command === "warn") {
	  
	  var reason = args.slice(2).join(" ");
	  var user = message.mentions.users.first();
	  var author = message.author;
	  var modlog = message.guild.channels.find('name', 'warning-log');

const embed = new Discord.RichEmbed()
  .setTimestamp()
  .setColor(0x00AE86)
  .setDescription(`
   **Action:** User Warned
**Moderator:** ${message.author.username}#${message.author.discriminator}
**User:** ${message.mentions.users.first().username}#${message.mentions.users.first().discriminator}
**Channel:** <#${message.channel.id}>
**Reason:** \`${reason}\`
  `)

	  if(!user) return message.reply(`Who do you want to warn?`);
	  if(!reason) return message.reply(`Why do you want to warn ${user}`)

	  user.send(`You have been warned by **${author}** in **${message.guild.name}** for **${reason}**`).then(() => {
	  message.channel.send(`Warned ;)`)
	  }).then(() => {
  client.channels.get(modlog.id).send({embed});
	  }).then(() => {
client.channels.get(modlog.id).send(`<@${user.id}>`);
		  });
};
  
  if(command === "globalban") {
  if(message.author.id !== config.masteradit && message.author.id !== config.damon && message.author.id !== config.nickpdx)
    return message.channel.send(`Only United Central Leaders can use this command!`)

  
  	var user = message.mentions.users.first();
    	var author = message.author;
    	var reason = args.slice(2).join(" ");
    	
        if(!user) return message.reply('Who are you banning?? Try again: u!globalban <@user> <reason>');
        if(!reason) return message.reply(`Why are you banning ${user}? Try again: u!globalban <@user> <reason>`);
user.send(`
        **Ban Warning**
        
You been banned globally banned from all United Central servers`);
  
        client.guilds.forEach(g => {
  client.guilds.forEach(g => {
g.ban(user), { reason: "United Central Global Ban"}
  })

        	message.channel.send(`${author.username} has banned ${user} for ${reason}`);
        });
    }
    
});
client.login("NDczMDkyNzMyMDQzMjY0MDAx.DuPoQA.4yFZf6ia9HT4eP99iEcOREhxfEc");