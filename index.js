const {Client, Intents} = require("discord.js");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});

const getSignificado = async function (palavra) {
  try {
    const res = await axios.get(`https://significado.herokuapp.com/v2/${palavra}`);
    return res.data[0].meanings;
  } catch (error) {
    console.log(error);
  }
};

const getSinonimo = async function (palavra) {
  try {
    const res = await axios.get(`https://significado.herokuapp.com/v2/sinonimos/${palavra}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (msg) => {
  try {
    const palavra = msg.content.split(" ")[1];

    if (!palavra) return;

    if (msg.content.includes("!significado")) {
      let significados = "";
      const significadosArr = await getSignificado(palavra);
      significadosArr.forEach((str) => (significados += `• ${str} \n`));
      msg.reply(significados);
    }

    if (msg.content.includes("!sinonimo")) {
      let sinonimos = "";
      const sinonimosArr = await getSinonimo(palavra);
      sinonimosArr.forEach((str) => (sinonimos += `• ${str} \n`));
      msg.reply(sinonimos);
    }
  } catch (error) {
    console.log(error);
    msg.reply("não entendi o que vc quis dizer :(");
  }
});

client.login(process.env.CLIENT_TOKEN);
