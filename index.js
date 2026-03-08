import { Client, GatewayIntentBits } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once("ready", () => {
  console.log("Bot online");
});

client.on("messageCreate", message => {
  if (message.content === ".ping") {
    message.reply("Pong 🏓");
  }
});

client.login(MTQ0MzI2NTA2ODcyNzkyNjgxNA.GP8Npy.3XDu8BYLzRJmKQ3AR-EUED_wHx0ctUnlwZ8ezI);
