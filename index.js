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
  const users = JSON.parse(fs.readFileSync('users.json'))

  if (message.content.startsWith(prefix)) {
    const args = message.content.slice(prefix.length).split(/ +/)
    const command = args.shift().toLowerCase()
    if (command === 'shadowbans') {
      showShadowBans(message, users)
    }

    if (command === 'addshadowban') {
      addShadowBan(message, args, users)
    }

    if (command === 'removeshadowban') {
      removeShadowBan(message, args, users)
    }
  } else {
    // check for message sent by author
    if (users.includes(message.author.id)) {
      message.delete() // delete message
      logMessage(message) // log message
    }
  }
}

function showShadowBans (message, users) {
  if (message.member.permissions.has('MANAGE_ROLES')) {
    let reply
    if (users.length > 0) {
      const shadowBannedUsers = users.map((user) => `<@!${user}>\n`)
      reply = `**Wanted List**:
      ${shadowBannedUsers}
      `
    } else {
      reply = 'You have a crime free town here, partner'
    }

    message.channel.send(reply, { allowedMentions: { users: [] } })
  } else {
    message.channel.send('Nice try, bucko! You need to be a mod to use this command')
  }
}

function removeShadowBan (message, args, users) {
  if (!message.member.permissions.has('MANAGE_ROLES')) {
    message.channel.send('Nice try, bucko! You need to be a mod to use this command')
    return
  }

  if (args.length === 0) {
    message.channel.send('I need to see ID, Pal')
    return
  }

  if (!users.includes(args[0])) {
    message.channel.send('Who even is this? Not on my list')
    return
  }

  const newUsers = [...users]
  const index = newUsers.indexOf(args[0])
  if (index > -1) {
    newUsers.splice(index, 1)
  }
  fs.writeFileSync('users.json', JSON.stringify(newUsers, null, '\t'))
  message.channel.send('They\'re free now')
}

function addShadowBan (message, args, users) {
  if (!message.member.permissions.has('MANAGE_ROLES')) {
    message.channel.send('Nice try, bucko! You need to be a mod to use this command')
    return
  }

  if (args.length === 0) {
    message.channel.send('I need to see ID, Pal')
    return
  }

  if (users.includes(args[0])) {
    message.channel.send('A man cannot be wanted twice at the same time, bub')
    return
  }

  const newUsers = [...users]
  newUsers.push(
    args[0]
  )
  fs.writeFileSync('users.json', JSON.stringify(newUsers, null, '\t'))
  message.channel.send('I\'ll keep an eye out for \'em')
}
