const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ 
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ] 
});

const moment = require('moment-timezone');

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  sendMessages();
});

// client.on("messageCreate", async (message) => {
//   // const guild = message.guild;
//   // guild.members.fetch().then(members => {
//   //   members.filter(member => !member.user.bot).forEach(member => {
//   //     let lastMessage = member.lastMessage;
//   //     if (lastMessage) {
//   //       let today = new Date();
//   //       let lastMessageDate = new Date(lastMessage.createdAt);
//   //       if (lastMessageDate.getDate() == today.getDate() &&
//   //           lastMessageDate.getMonth() == today.getMonth() &&
//   //           lastMessageDate.getFullYear() == today.getFullYear()) {
//   //         console.log(`${member.user.username} sent a message today.`);
//   //       } else {
//   //         console.log(`${member.user.username} did not send a message today.`);
//   //       }
//   //     } else {
//   //       console.log(`${member.user.username} has not sent any messages.`);
//   //     }
//   //   });
//   }).catch(console.error);
  // const members = (await message.guild.members.fetch()).map(m => m.user);
  // members.forEach(member => {
  //   console.log(member);
  // });
// })

client.on('messageCreate', async (message) => {
  if (message.content.startsWith('/notification')) {
    const args = message.content.slice('/notification'.length).trim().split(/ +/);
    const [dateStr, timeStr] = args.slice(0, 2);
    const note = args.slice(2).join(' ');

    try {
      const targetTime = moment.tz(`${dateStr} ${timeStr}`, 'DD.MM.YYYY HH:mm', 'Europe/Moscow').toDate();
      const currentTime = new Date();

      if (targetTime < currentTime) {
        await message.reply('Нельзя запланировать уведомление в прошлом времени.');
        return;
      }

      const secondsUntilTarget = moment.duration(targetTime - currentTime).asSeconds();

      await new Promise((resolve) => setTimeout(resolve, secondsUntilTarget * 1000));

      await message.reply(`Напоминание для ${message.author}: ${note}`);
    } catch (err) {
      await message.reply('Неправильный формат даты или времени. Используйте формат "ДД.MM.ГГГГ" и "ЧЧ:ММ".');
    }
  }
});


async function sendMessages() {
  const channelId = '1127886418279149578'; // Замените CHANNEL_ID на ID канала, в котором бот должен отправлять сообщения
  const channel = await client.channels.fetch(channelId);

  if (!channel) {
    console.log(`Не удалось найти канал с ID: ${channelId}`);
    return;
  }

  while (true) {
    const now = new Date();
    console.log(now);
    const targetTime = new Date(0, 0, 0, 19, 36, 0); // Установите желаемое время (6:00)
    if (now.getHours() === targetTime.getHours() && now.getMinutes() === targetTime.getMinutes()) {
      try {
        await channel.send({files: ["./Frame_2.png"]});
      } catch (err) {
        console.log(`Не удалось отправить картинку в канал: ${channel.name}`);
      }

      const now = Date.now();
      const messages = await channel.messages.fetch({ limit: 100 });
      const filteredMessages = messages.filter(message => {
        return now - message.createdTimestamp <= 4 * 60 * 60 * 1000;
      });
      const members = await client.guilds.cache.get('1127886417830354964').members.fetch();
      const users = members.map(member => member.user);
      const usersWithMessages = new Set(filteredMessages.map(message => message.author));
      const usersWithoutMessages = users.filter(userId => !usersWithMessages.has(userId));

      usersWithoutMessages.forEach(user => {
        channel.send(`Привет, ${user.toString()}, где же твой отчет?)`)
      });
  }

    await new Promise((resolve) => setTimeout(resolve, 60 * 1000));
  }
}

client.login('MTEyNzU2MzczOTY4MDQ4OTQ3Mw.G8a0fP.8axJWE2HLEqw4TQBSK55pHeOdPpIG024ZyuNBI');
