// imports
const Discord = require('discord.js')
const fs = require('fs')

const data = fs.readFileSync('config.json')
const config = JSON.parse(data)
const prefix = '$'
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
  if (message.author.bot) return

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()
    if (command === 'shadowbans') {
      if (message.member.permissions.has('MANAGE_ROLES')) {
        const users = config.users.map((user) => `<@!${user}>\n`)
        const reply = `**Wanted List**:
        ${users}
        `
        message.channel.send(reply, { allowedMentions: { users: [] } })
      } else {
        message.channel.send('Nice try, bucko! You need to be a mod to use this command')
      }
    }

    if (command === 'addshadowban') {
      if (!message.member.permissions.has('MANAGE_ROLES')) {
        message.channel.send('Nice try, bucko! You need to be a mod to use this command')
        return
      }

      if (args.length === 0) {
        message.channel.send('I need to see ID, Pal')
        return
      }

      if (config.users.includes(args[0])) {
        message.channel.send('A man cannot be wanted twice at the same time, bub')
        return
      }

      const newConfig = { ...config }
      newConfig.users.push(
        args[0]
      )
      fs.writeFileSync('config.json', JSON.stringify(newConfig, null, '\t'))
      message.channel.send('I\'ll keep an eye out for \'em')
    }

    if (command === 'removeshadowban') {
      if (!message.member.permissions.has('MANAGE_ROLES')) {
        message.channel.send('Nice try, bucko! You need to be a mod to use this command')
        return
      }

      if (args.length === 0) {
        message.channel.send('I need to see ID, Pal')
        return
      }

      if (!config.users.includes(args[0])) {
        message.channel.send('Who even is this? Not on my list')
        return
      }

      const newConfig = { ...config }
      const index = newConfig.users.indexOf(args[0])
      if (index > -1) {
        newConfig.users.splice(index, 1)
      }
      fs.writeFileSync('config.json', JSON.stringify(newConfig, null, '\t'))
      message.channel.send('They\'re free now')
    }
  } else {
    // check for message sent by author
    if (config.users.includes(message.author.id)) {
      message.delete() // delete message
      logMessage(message) // log message
    }
  }
}
