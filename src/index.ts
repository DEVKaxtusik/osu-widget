import dotenv from 'dotenv'
dotenv.config();
import { createWidget, patchIdentity } from "./providers/discord";
import { fetchOsuProfile } from "./providers/osu";
import { toIdentity } from "./types/osuProfile";

async function run() {
  const userID = process.env.DISCORD_USER_ID!;
  const profile = await fetchOsuProfile(process.env.OSU_NAME!);

  const identity = toIdentity(profile);

  await patchIdentity(identity, userID);
}

run();