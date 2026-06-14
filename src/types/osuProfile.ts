export interface OsuProfile {
  name: string;
  profile: string;
  fav_map: string;
  country: string;
  global_placement: string;
  country_placement: string;
  overall_pp: string;
  top_play: string;
  playtime: string;
  is_supporter: boolean;
  playcount: number;
  flag: string;
}

export function toIdentity(profile: OsuProfile) {
  return {
    username: profile.name,
    data: {
      dynamic: [
        { type: 3, name: "osu_profile", value: { url: profile.profile } },
        { type: 1, name: "osu_name", value: profile.name },
        { type: 1, name: "osu_fav_map", value: profile.fav_map },
        { type: 1, name: "osu_country", value: profile.country },
        { type: 1, name: "osu_global_placement", value: profile.global_placement },
        { type: 1, name: "osu_country_placement", value: profile.country_placement },
        { type: 1, name: "osu_overall_pp", value: profile.overall_pp },
        { type: 1, name: "osu_top_play", value: profile.top_play },
        { type: 1, name: "osu_playtime", value: profile.playtime },
        { type: 1, name: "osu_is_supporter", value: profile.is_supporter ? "Yes" : "No" },
        { type: 2, name: "osu_playcount", value: String(profile.playcount) },
        { type: 3, name: "osu_flag", value: { url: profile.flag } },
      ],
    },
  };
}