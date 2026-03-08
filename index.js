const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
 intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent
 ]
});

let users = {};

function getUser(id){
 if(!users[id]){
  users[id] = {
   money: 1000,
   bank: 0
  };
 }
 return users[id];
}

client.once("ready", ()=>{
 console.log("Casino bot online");
});

client.on("messageCreate", (msg)=>{
 if(msg.author.bot) return;

 const args = msg.content.split(" ");
 const cmd = args[0];
 const id = msg.author.id;
 const user = getUser(id);

 // help
 if(cmd === ".help"){
  msg.reply(`
🎰 Lệnh bot

💰 Kinh tế
.balance
.work
.daily
.deposit
.withdraw
.pay

🎲 Game
.taixiu
.baucua
.slot
.coinflip
`);
 }

 // balance
 if(cmd === ".balance"){
  msg.reply(`💰 Ví: ${user.money} | 🏦 Bank: ${user.bank}`);
 }

 // work
 if(cmd === ".work"){
  const earn = Math.floor(Math.random()*200)+50;
  user.money += earn;
  msg.reply(`Bạn kiếm được ${earn}`);
 }

 // daily
 if(cmd === ".daily"){
  user.money += 500000;
  msg.reply("Bạn nhận 500000 tiền");
 }

 // deposit
 if(cmd === ".deposit"){
  const amount = parseInt(args[1]);
  if(user.money < amount) return msg.reply("Không đủ tiền");

  user.money -= amount;
  user.bank += amount;

  msg.reply(`Đã gửi ${amount} vào bank`);
 }

 // withdraw
 if(cmd === ".withdraw"){
  const amount = parseInt(args[1]);

  if(user.bank < amount) return msg.reply("Không đủ tiền bank");

  user.bank -= amount;
  user.money += amount;

  msg.reply(`Rút ${amount}`);
 }

 // pay
 if(cmd === ".pay"){
  const target = msg.mentions.users.first();
  const amount = parseInt(args[2]);

  if(!target) return;

  const t = getUser(target.id);

  if(user.money < amount) return msg.reply("Không đủ tiền");

  user.money -= amount;
  t.money += amount;

  msg.reply(`Đã chuyển ${amount}`);
 }

 // coinflip
 if(cmd === ".coinflip"){
  const bet = parseInt(args[1]);

  if(user.money < bet) return;

  const win = Math.random() < 0.5;

  if(win){
   user.money += bet;
   msg.reply(`Bạn thắng ${bet}`);
  }else{
   user.money -= bet;
   msg.reply(`Bạn thua ${bet}`);
  }
 }

 // slot
 if(cmd === ".slot"){
  const bet = parseInt(args[1]);

  const icons = ["🍒","🍋","🍉","⭐","💎"];

  const a = icons[Math.floor(Math.random()*5)];
  const b = icons[Math.floor(Math.random()*5)];
  const c = icons[Math.floor(Math.random()*5)];

  if(a===b && b===c){
   user.money += bet*3;
   msg.reply(`${a} ${b} ${c} JACKPOT +${bet*3}`);
  }else{
   user.money -= bet;
   msg.reply(`${a} ${b} ${c} Thua`);
  }
 }

 // tài xỉu
 if(cmd === ".taixiu"){
  const bet = parseInt(args[1]);
  const choice = args[2];

  const dice =
   Math.floor(Math.random()*6+1)+
   Math.floor(Math.random()*6+1)+
   Math.floor(Math.random()*6+1);

  const result = dice >= 11 ? "tai":"xiu";

  if(choice===result){
   user.money += bet;
   msg.reply(`🎲 ${dice} -> thắng`);
  }else{
   user.money -= bet;
   msg.reply(`🎲 ${dice} -> thua`);
  }
 }

 // bầu cua
 if(cmd === ".baucua"){
  const bet = parseInt(args[1]);
  const items = ["bau","cua","tom","ca","ga","nai"];
  const choice = args[2];

  const roll = items[Math.floor(Math.random()*6)];

  if(choice===roll){
   user.money += bet;
   msg.reply(`Ra ${roll} -> thắng`);
  }else{
   user.money -= bet;
   msg.reply(`Ra ${roll} -> thua`);
  }
 }

});

client.login(process.env.TOKEN);
