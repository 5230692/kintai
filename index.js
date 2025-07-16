require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const axios = require("axios");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => {
  console.log(`✅ Bot logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== process.env.CHANNEL_ID) return;

  const payload = {
    user: message.author.username,
    message: message.content,
    timestamp: message.createdTimestamp,
  };

  try {
    await axios.post(
      process.env.GAS_WEBHOOK_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log("📤 Data sent to GAS");
  } catch (err) {
    console.error("❌ Failed to send data to GAS", err.message);
  }
});

client.login(process.env.DISCORD_TOKEN);
