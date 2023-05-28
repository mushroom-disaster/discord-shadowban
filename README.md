# discord-shadowban

Why ban your users when you can instead shadowban them?

Delete any and all messages after they're sent, all powered by discord.js

## Config: 
There are two files called config.example.json and users.example.json. Copy both of them and rename the copies to config.json and users.json. Then fill in these values inside config.json

 `name:` Name the bot whatever you want  
 `status:` status of bot - `online`, `idle`, `invisible`, `dnd`  
 `loglevel`: 0 - no output except ready, 1 - logs the time and author of message, 2 - logs the time, author and content of message.  
 `token`: your super secret token from [discord](https://discordapp.com/developers/applications/)  

## Invite link:
Go to your bot application and paste the client ID for your bot in this link to get the invite link

`https://discordapp.com/api/oauth2/authorize?clientid=<YOUR-CLIENT-ID-HERE>&permissions=73728&scope=bot`

Permissions:
Manage Messages and Read Message History

## Starting the bot:
We're using `pnpm` here but you can just use `npm` if you'd like. If you don't know what `pnpm` is it's an alternative to `npm`. You can install it as a global package.

1. Install [Nodejs](https://nodejs.org/en) (I'm using NodeJS 18 LTS)
2. Optionally install [pnpm](https://pnpm.io/installation#using-npm)
3. Run `pnpm install` or `npm install` in your project root
4. Run `pnpm run start` or `npm run start`. If the console shows "Ready" then you're done