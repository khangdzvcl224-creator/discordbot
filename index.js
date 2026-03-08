const {
Client,
GatewayIntentBits,
EmbedBuilder,
ActionRowBuilder,
StringSelectMenuBuilder
} = require("discord.js");

const client = new Client({
 intents:[
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
 ]
});

let money = {};
let history = [];
let txBets = {};

const bcItems = ["bau","cua","tom","ca","ga","nai"];

function getMoney(id){
 if(!money[id]) money[id] = 1000;
 return money[id];
}

client.once("ready",()=>{
 console.log("Casino bot online");
});

client.on("messageCreate", async(msg)=>{

 if(msg.author.bot) return;

 const id = msg.author.id;

 // ===== BAL =====

 if(msg.content === ".bal"){
  msg.reply(`💰 Bạn có **${getMoney(id)} Mcoin**`);
 }

 // ===== WORK =====

 if(msg.content === ".work"){
  const earn = Math.floor(Math.random()*200)+100;
  money[id] = getMoney(id) + earn;
  msg.reply(`Bạn kiếm được **${earn} Mcoin**`);
 }

 // ===== SOI CAU =====

 if(msg.content === ".soicau"){

  if(history.length === 0){
   msg.reply("Chưa có dữ liệu soi cầu");
   return;
  }

  msg.reply(`📈 Cầu gần đây:\n${history.join(" - ")}`);
 }

 // ===== TAI XIU =====

 if(msg.content.startsWith(".taixiu")){

  const args = msg.content.split(" ");

  if(args.length < 3){
   msg.reply("Ví dụ: .taixiu tai 100");
   return;
  }

  const bet = args[1];
  const amount = parseInt(args[2]);

  if(getMoney(id) < amount){
   msg.reply("Không đủ tiền");
   return;
  }

  const dice =
   Math.floor(Math.random()*6+1)+
   Math.floor(Math.random()*6+1)+
   Math.floor(Math.random()*6+1);

  const result = dice >=11 ? "tai":"xiu";

  history.push(result);
  if(history.length > 10) history.shift();

  if(bet === result){
   const win = amount*1.9;
   money[id] += win;
   msg.reply(`🎲 ${dice} → ${result}\nBạn thắng **${win} Mcoin**`);
  }else{
   money[id] -= amount;
   msg.reply(`🎲 ${dice} → ${result}\nBạn thua **${amount} Mcoin**`);
  }

 }

 // ===== BAU CUA =====

 if(msg.content.startsWith(".baucua")){

  const args = msg.content.split(" ");

  if(args.length < 3){
   msg.reply("Ví dụ: .baucua cua 100");
   return;
  }

  const choice = args[1];
  const amount = parseInt(args[2]);

  if(getMoney(id) < amount){
   msg.reply("Không đủ tiền");
   return;
  }

  const roll = [
   bcItems[Math.floor(Math.random()*6)],
   bcItems[Math.floor(Math.random()*6)],
   bcItems[Math.floor(Math.random()*6)]
  ];

  const win = roll.filter(x=>x===choice).length;

  if(win === 0){
   money[id] -= amount;
   msg.reply(`Ra ${roll.join(" | ")} → Thua`);
  }else{
   const prize = amount * win;
   money[id] += prize;
   msg.reply(`Ra ${roll.join(" | ")} → Trúng ${win}\n+${prize} Mcoin`);
  }

 }

});
if(msg.content.startsWith(".code")){

 const args = msg.content.split(" ");
 const code = args[1];

 if(!code){
  msg.reply("❌ Ví dụ: `.code THANTAIDEN`");
  return;
 }

 if(!codes[code]){
  msg.reply("❌ Code không tồn tại");
  return;
 }

 if(!usedCodes[code]) usedCodes[code] = [];

 if(usedCodes[code].includes(msg.author.id)){
  msg.reply("❌ Bạn đã dùng code này rồi");
  return;
 }

 const reward = codes[code];

 money[msg.author.id] = getMoney(msg.author.id) + reward;

 usedCodes[code].push(msg.author.id);

 const embed = new EmbedBuilder()
 .setTitle("🎁 Nhận Code Thành Công")
 .setDescription(`
🏷 Code: **${code}**

💰 Phần thưởng: **${reward.toLocaleString()} Mcoin**

👤 Người nhận: <@${msg.author.id}>
 `)
 .setColor("Gold")
 .setTimestamp();

 msg.reply({embeds:[embed]});
}
client.login(process.env.TOKEN);
