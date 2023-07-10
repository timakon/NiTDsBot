const { REST, Routes } = require('discord.js');

const commands = [
  {
    name: 'notification',
    description: 'Оставь себе уведомление на будущее',
  },
];

const rest = new REST({ version: '10' }).setToken("MTEyNzU2MzczOTY4MDQ4OTQ3Mw.G8a0fP.8axJWE2HLEqw4TQBSK55pHeOdPpIG024ZyuNBI");

(async() => {try {
  console.log('Started refreshing application (/) commands.');

  await rest.put(Routes.applicationCommands('1127563739680489473'), { body: commands });

  console.log('Successfully reloaded application (/) commands.');
} catch (error) {
  console.error(error);
}}) ();