// imports
const Discord = require('discord.js')
const fs = require('fs')

const data = fs.readFileSync('config.json')
const config = JSON.parse(data)

const client = new Discord.Client()
client.on('ready', () => {
  console.log('Ready')
  client.user.setPresence({ // set presencez
    status: config.status
  })
})
client.on('message', message => checkMessage(message))
client.login(config.token)

function logMessage (message) {
  if (config.log_level >= 1) console.log(`${message.createdAt} - Deleted message from ${message.author.username}`)
  if (config.log_level === 2) console.log(`message: \`${message.content}\``)
}

function checkMessage (message) {
  // check for message sent by author
  if (config.users.includes(message.author.id)) {
    message.delete() // delete message
    logMessage(message) // log message
  }
}
