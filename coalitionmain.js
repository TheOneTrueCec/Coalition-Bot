
// require the needed discord.js classes
const { Client, Intents, Message, Interaction } = require('discord.js');

var Datastore = require('nedb')
	, db= {};
		db.bounties = new Datastore({ filename: '../Discord-Bots/Data/bounties.db', autoload: true });
		db.srbTeams = new Datastore({ filename: '../Discord-Bots/Data/srbTeams.db', autoload: true });

//Config folder
const { cPrefix, token, admins, bounty_admins, srbusers } = require('./config.json');

// create a new Discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.once('ready', () => {
	console.log('Logged in as Coalition Integration Bot!');
	//client.channels.cache.get('830305706573561880').send("I'm back bitches!")

	client.guilds.cache.forEach(guild => {
		console.log(guild.id + ' | ' + guild.name);
	})
    
});

let temp = [];
let bountyLeaderboardNames = [];
let bountyLeaderboardCount = [];

var countNEW;
var countOLD;

client.on('messageCreate', async msg => {
	if (msg.content.startsWith(cPrefix)){

		const withoutPrefix = msg.content.slice(cPrefix.length);
		const split = withoutPrefix.split(/ +/);
		const command = split[0];
		const args = split.slice(1);

		if (command === 'ping') {
			msg.reply('Pong!')
			console.log('\x1b[38;2;204;204;204mPinged at \x1b[38;2;0;238;255m' + new Date());
		}

		if (command === 'pointlog' && (bounty_admins.includes(msg.author.id) || msg.member.roles.cache.some(role => role.id === '822206434380611634'))) {
			if (args.length == 2) {
				player = args[0];
				proof = args[1];
				bountyPointInput(player, proof);
				console.log ('\x1b[38;2;204;204;204mBounty logged by ' + msg.author.id + ' at \x1b[38;2;231;76;60m' + new Date());
				msg.react("👍");
			} else return;
		}

		if (command === 'bulklog' && (bounty_admins.includes(msg.author.id) || msg.member.roles.cache.some(role => role.id === '822206434380611634'))) {
			if (args.length == 2) {
				player = args[0];
				num = args[1];
				proof = (msg.author.id)
				for (let index = 0; index < num; index++) {
					bountyPointInput(player, proof);
					console.log ('\x1b[38;2;204;204;204mBounty logged by ' + msg.author.id + ' at \x1b[38;2;231;76;60m' + new Date());
				}
				msg.react("👍");
			} else return;			
		}

		if (command === 'abrem' && bounty_admins.includes(msg.author.id)) {
			if (args.length == 1) {
				player = args[0];
				db.bounties.remove({person: player},{multi: true}, function (err, numremoved) {});
				msg.react("👍");
			} else return;
		}

		if (command === 'arem' && bounty_admins.includes(msg.author.id)) {
			if (args.length == 1) {
				player = args[0];
				db.bounties.remove({_id: player},{}, function (err, numremoved) {});
				msg.react("👍");
			} else return;
		}

		if (command === 'pointreq') {
			if (args.length == 1) {
				player = args[0];
				db.bounties.count({person: player}, function (err, count) {msg.reply(player + ' has ' + count + ' bounty points.');});
			} else return;
		}

		if (command === 'blist') {
			if (args.length == 0) {
				db.bounties.find({}, function (err, docs) {

					

					///console.log(bountyLeaderboardNames);

					tempSTR = bountyLeaderboard(docs).toString()
					tempSTR = tempSTR.replace(/,/g , "\n")
					console.log(typeof tempSTR);
					msg.reply(tempSTR).then(msg => {setTimeout(() => msg.delete(), 300000)}).catch();

				});
			}
		}

		/*if (command === 'blead') {
			db.bounties.find({}, function (err, docs) {

				bountyLeaderboard(docs)
				var cycle = 0;
				var sorted = false;

				

				while (sorted == false){

					cycle++
					sorted = true;


					for (let index = 0; index < bountyLeaderboardNames.length; index++) {
						db.bounties.count({person: bountyLeaderboardNames[index]}, function (err, count) {
							bountyLeaderboardCount.push(count);
						})
					}
						

					for (let index = 1; index < bountyLeaderboardNames.length; index++) {
						if (bountyLeaderboardCount[index] > bountyLeaderboardCount[index-1]) {
							temp = bountyLeaderboardNames[index-1];
							bountyLeaderboardNames[index-1] = bountyLeaderboardNames[index];
							bountyLeaderboardNames[index] = temp;

							temp = bountyLeaderboardCount[index -1];
							bountyLeaderboardCount[index -1] = bountyLeaderboardCount[index];
							bountyLeaderboardCount[index] = temp;

							sorted = false;
						}
						
						//console.log(cycle + ' | ' + sorted + ' | ' + bountyLeaderboardNames[index] + ' | ' + bountyLeaderboardCount[index]  + '\n')
					}

						

						
				}
			}); 

			console.log (bountyLeaderboardNames);
		}*/



		if (command === 'sleave' && admins.includes(msg.author.id)) {
			if (args.length == 1) {

				client.guilds.cache.get(args[0]).leave()
				console.log('Guild Left')
				msg.react("👍");

			}
		}

		const srbsplit = withoutPrefix.split(/ /);
		
		const srbcommand = srbsplit[0]
		temp = srbsplit.slice(1);
		const srbargs = srbsplit.slice(1).toString().split(/,+/);
		

/*		console.log('\x1b[38;2;204;0;0m' + srbsplit + ' | ' + srbsplit.length + ' | ' + typeof(srbsplit))
		console.log(srbcommand)
		console.log(temp + ' | ' + temp.length + ' | ' + typeof(srbsplit))
		console.log(srbargs + ' | ' + srbargs.length + ' | ' + typeof(srbsplit))*/

		if (srbcommand === 'srbping') {
			msg.reply('Pong!')
			console.log('\x1b[38;2;204;204;204mPinged at \x1b[38;2;0;238;255m' + new Date());
		}

		if (srbcommand === 'ulist' && admins.includes(msg.author.id)) {
			if (srbargs.length == 0) {

				for (let index = 0; index < srbusers.length; index++) {
					client.channels.cache.get(msg.channelId).send(srbusers[index])					
				}
				console.log ('\x1b[38;2;204;0;204mSRBs Users called by ' + msg.author.id + ' at \x1b[38;2;76;231;60m' + new Date());
			} else return;
		}

		if (srbcommand === 'input' && srbusers.includes(msg.author.id)) {
			if (srbargs.length == 3) {

				msg.reply("benis");

				//console.log ('\x1b[38;2;255;255;0mSRB Team ' + args[0] + ' Logged by: ' + msg.author.id + ' at \x1b[38;2;76;60;231m' + new Date());
			} else return;
		}

		//Server DC functionality


		
	} /*else if (msg.content.startsWith(srbPrefix)){

		const withoutPrefix = msg.content.slice(srbPrefix.length);
		const split = withoutPrefix.split(/ +/);
		const command = split[0];
		const args = split.slice(1);

		msg.reply('Functionality not yet online');

		
	}*/ else return;

	

});



// login to Discord with your app's token
client.login(token);


function bountyPointInput (player, proof) {
	

	var doc = { person: player
               , picture: proof
               , today: new Date()
               };
	db.bounties.insert(doc, function (err, newDoc) {});

	return;
}

function bountyLeaderboard (docs) {
	for (let index = 0; index < docs.length; index++) {
		if (bountyLeaderboardNames.includes(docs[index].person) != true) {
			bountyLeaderboardNames.push(docs[index].person);
		}	
	}

	bountyLeaderboardNames = bountyLeaderboardNames.sort();

	return bountyLeaderboardNames;
}