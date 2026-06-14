import dotenv from 'dotenv'
dotenv.config();
import { patchIdentity } from "./providers/discord";
import { fetchOsuProfile } from "./providers/osu";
import { toIdentity } from "./types/osuProfile";

async function run() {
  const userID = process.env.DISCORD_USER_ID!;
  const profile = await fetchOsuProfile("OSU_USERNAME"); // Here your osu! username

  const identity = toIdentity(profile);

  await patchIdentity(identity, userID);
}

run();