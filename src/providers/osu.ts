import axios from "axios";
import { OsuProfile } from "../types/osuProfile";

const OSU_CLIENT_ID = process.env.OSU_CLIENT_ID!;
const OSU_CLIENT_SECRET = process.env.OSU_CLIENT_SECRET!;

const parseOsuMode = (mode?: string): string => {
  const m = (mode || "STD").toUpperCase();
  const mapping: Record<string, string> = {
    STD: "osu",
    MANIA: "mania",
    TAIKO: "taiko",
    CATCH: "fruits",
  };
  return mapping[m] || "osu";
};

const mappedMode = parseOsuMode(process.env.OSU_MODE);

async function getOsuToken(): Promise<string> {
  try {
    const response = await axios.post("https://osu.ppy.sh/oauth/token", {
      client_id: OSU_CLIENT_ID,
      client_secret: OSU_CLIENT_SECRET,
      grant_type: "client_credentials",
      scope: "public",
    });
    return response.data.access_token;
  } catch (error: any) {
    console.error(`ERROR Failed to obtain osu! OAuth token: ${error.message}`);
    if (error.response) {
      console.error(`ERROR Status: ${error.response.status} | Data:`, JSON.stringify(error.response.data));
    }
    throw error;
  }
}

export async function fetchOsuProfile(username: string): Promise<OsuProfile> {
  if (!username || username.trim() === "") {
    throw new Error("Username parameter is missing or empty.");
  }

  const token = await getOsuToken();
  const apiConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };

  try {
    const userRes = await axios.get(`https://osu.ppy.sh/api/v2/users/${username}/${mappedMode}`, apiConfig);
    const user = userRes.data;
    const userId = user.id;

    const [topPlayRes, mostPlayedRes] = await Promise.all([
      axios.get(`https://osu.ppy.sh/api/v2/users/${userId}/scores/best`, { 
        ...apiConfig, 
        params: { limit: 1, mode: mappedMode } 
      }),
      axios.get(`https://osu.ppy.sh/api/v2/users/${userId}/beatmapsets/most_played`, { 
        ...apiConfig, 
        params: { limit: 1 } 
      })
    ]);

    const topPlay = topPlayRes.data;
    const mostPlayed = mostPlayedRes.data;

    const formatPlaytime = (seconds: number) => {
      const d = Math.floor(seconds / (3600 * 24));
      const h = Math.floor((seconds % (3600 * 24)) / 3600);
      const m = Math.floor((seconds % 3600) / 60);
      return `${d}d ${h}h ${m}m`;
    };

    const formatRank = (rank: number | null) =>
      rank ? `#${rank.toLocaleString("en-US")}` : "Unranked";

    return {
      name: user.username,
      profile: user.avatar_url,
      fav_map: mostPlayed.length > 0 ? `${mostPlayed[0].beatmapset.title} by ${mostPlayed[0].beatmapset.creator}` : "No maps played",
      country: user.country.name,
      global_placement: formatRank(user.statistics.global_rank),
      country_placement: formatRank(user.statistics.country_rank),
      overall_pp: `${Math.round(user.statistics.pp)} pp`,
      top_play: topPlay.length > 0 ? `${Math.round(topPlay[0].pp)} pp` : "0 pp",
      playtime: formatPlaytime(user.statistics.play_time),
      is_supporter: user.is_supporter,
      playcount: user.statistics.play_count,
      flag: `https://flagsapi.com/${user.country_code}/flat/64.png`,
    };
  } catch (error: any) {
    console.error(`ERROR osu! profile resolution failed for user [${username}] in mode [${mappedMode}]`);
    if (error.response) {
      console.error(`ERROR URL: ${error.config?.url} | Status: ${error.response.status} | Data:`, JSON.stringify(error.response.data));
    } else {
      console.error(`ERROR Message: ${error.message}`);
    }
    throw error;
  }
}