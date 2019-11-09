const Discord = require('discord.js');
const axios = require('axios');
const client = new Discord.Client();
require('dotenv').config();



const time  = Math.floor(new Date() / 1000) - 259200

//Testing message function for BOT
client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong')
    }
});

//News sender
client.on('message', msg => {
    axios.get('https://api-v3.igdb.com/pulses', 
    {
        data: 'fields *; where published_at >' + time + "; sort published_at asc;'",
        headers: {
            'user-key': process.env.API_KEY,
            Accept: 'application/json'
        }
    }).then(res => {
        if (msg.content === '!news'){
            const info = res.data
            let summaries = ""
            for (var i = 0; i < 2; i++){
                summaries += '\nArticle ' + i + ' Title: ' + info[i].title + '\n'
                summaries += 'Summary: ' + info[i].summary + '\n ------------------------------ \n'
                axios.get('https://api-v3.igdb.com/pulse_urls',
                {
                    data: 'fields *; where id = ' + info[i].website + ";'",
                    headers: {
                        'user-key': process.env.API_KEY,
                         Accept: 'application/json'
                    }
                }).then(result => {
                    summaries += 'URL for these articles: ' +  result.data[0].url + '\n'

                    
                })
                
            }
            setTimeout(()=>{msg.reply(summaries)},1000); //Temporary fix: URL wasnt adding to summaries string
        }
        
    })
})

//Uncomment to find small artworks by typing !artwork followed by the name of the game
// client.on('message', msg => {
//     const args = msg.content.slice(process.env.prefix.length).trim().split(/ +/g);
//     const command = args.shift().toLowerCase();
//     if(command === 'artwork') {
//         let game = args[0];
//         let artwork_id = [];
//         axios.get('https://api-v3.igdb.com/games',{
//             data: 'search ' + '"' + game + '"' + "; fields artworks;",
//             headers: {
//                 'user-key': process.env.API_KEY,
//                 Accept: 'application/json'
//             }
//         }).then(result => {
//             const data = result.data
//             //console.log(JSON.stringify(result.data, null, 2))
//             for (let i = 0; i<data.length; i++){
//                 artwork_id.push(data[i].artworks)
//             }
//             artwork_id = artwork_id.flat().filter(e => e);
//             console.log(artwork_id)
//             for (let j = 0; j<4; j++){
//                 axios.get('https://api-v3.igdb.com/artworks',{
//                     data: 'fields url; where id = ' + artwork_id[j] + ';',
//                     headers: {
//                         'user-key': process.env.API_KEY,
//                         Accept: 'application/json'
//                     }
//                 }).then(result => {
//                     let urls = ""
//                     let temp = result.data[0]
//                     console.log(temp.url)
//                     urls += 'https:' + temp.url + '\n'
//                     msg.reply(urls)

                    
//                 })
//             }
//         })
//       } 
// })

//Lists the games with the highest popularity score
client.on('message', msg => {
    let games = "\n **Most Hyped Games:** "
    if (msg.content === '!popular'){
        axios.get('https://api-v3.igdb.com/games',
        {
            data: "fields name,popularity; sort popularity desc;",
            headers: {
                'user-key': process.env.API_KEY,
                Accept: 'application/json'
            }

        }).then(result => {
            let data = result.data
            for (var i = 0; i < data.length; i++){
                games += '\n ' +  data[i].name
            }
            msg.reply(games)
            
        })
    }
})

//Other functions besides Game stuff
//Roll the dice
client.on('message', msg => {
    if (msg.content === '!rtd'){
        const sides = 6
        let roll = Math.floor(Math.random() * sides) + 1;
        msg.reply('\n You rolled a ' + '**' + roll + '**');
    }
})

client.login(process.env.BOT_TOKEN)