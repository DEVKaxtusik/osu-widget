import axios from "axios";

const discordApplicationId = process.env.APP_ID!;
const discordAPI = axios.create({
  baseURL: "https://discord.com/api/v10",
  headers: {
    "Authorization": "Bot " + process.env.DISCORD_TOKEN!
  }
});

export async function patchIdentity(identity: any, userID: string) {
  try {
    await discordAPI.patch(`/applications/${discordApplicationId}/users/${userID}/identities/0/profile`, identity);
  } catch (error: any) {
    console.error(`ERROR Discord API Patch failed: ${error.message}`);
    if (error.response) {
      console.error(`ERROR Status: ${error.response.status} | Data:`, JSON.stringify(error.response.data));
    }
    throw error;
  }
}