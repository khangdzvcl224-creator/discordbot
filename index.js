const { Client, GatewayIntentBits, EmbedBuilder } = require("discord.js");

const client = new Client({
 intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
 ]
});

const prefix = ".";
const TOKEN = "TOKEN_BOT";
const ROLE_ID = "ROLE_PING";

let lastSpawn = 0;

client.on("ready", () => {
 console.log(`Bot online: ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {

 if (message.author.bot) return;
 if (!message.content.startsWith(prefix)) return;

 const args = message.content.slice(prefix.length).trim().split(/ +/);
 const cmd = args.shift().toLowerCase();

 // ping
 if (cmd === "ping") {
  message.reply("🏓 Bot vẫn hoạt động!");
 }

 // spawn bóng
 if (cmd === "spawn") {

  lastSpawn = Date.now();

  const embed = new EmbedBuilder()
   .setTitle("⚽ BÓNG ĐÃ SPAWN")
   .setDescription("Nhanh vào **Steal a Brainrot** để nhặt bóng!")
   .setColor("Green")
   .setTimestamp();

  message.channel.send({
   content: `<@&${ROLE_ID}>`,
   embeds: [embed]
  });
 }

 // bóng hiếm
 if (cmd === "rare") {

  const embed = new EmbedBuilder()
   .setTitle("🔥 BÓNG HIẾM XUẤT HIỆN")
   .setDescription("Có **Brainrot hiếm** trong server!")
   .setColor("Gold")
   .setTimestamp();

  message.channel.send({
   content: `<@&${ROLE_ID}>`,
   embeds: [embed]
  });
 }

 // timer spawn
 if (cmd === "timer") {

  if (!lastSpawn) {
   return message.reply("❌ Chưa có bóng spawn.");
  }

  let time = Math.floor((Date.now() - lastSpawn) / 1000);

  const embed = new EmbedBuilder()
   .setTitle("⏱ Thời gian từ lần spawn")
   .setDescription(`${time} giây`)
   .setColor("Blue");

  message.channel.send({ embeds: [embed] });
 }

 // help
 if (cmd === "help") {

  const embed = new EmbedBuilder()
   .setTitle("📜 Lệnh bot")
   .setDescription(`
.ping
.spawn
.rare
.timer
.help
`)
   .setColor("Purple");

  message.channel.send({ embeds: [embed] });
 }

});

client.login(TOKEN);
