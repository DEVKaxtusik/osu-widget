import axios from "axios";

const widgetData = {
  display_name: "osu! Stats",
  surfaces: {
    widget_bottom: {
      layout: "widget_bottom_stats",
      components: {
        stat_5: {
          fields: {
            value: {
              value_type: "data",
              presentation_type: "text",
              value: "osu_top_play",
            },
            label: {
              value_type: "custom_string",
              presentation_type: "text",
              value: "Top Play pp",
            },
          },
        },
        stat_6: {
          fields: {
            value: {
              value_type: "data",
              presentation_type: "text",
              value: "osu_playtime",
            },
            label: {
              value_type: "custom_string",
              presentation_type: "text",
              value: "Playtime",
            },
          },
        },
        stat_3: {
          fields: {
            value: {
              value_type: "data",
              presentation_type: "text",
              value: "osu_country_placement",
            },
            label: {
              value_type: "custom_string",
              presentation_type: "text",
              value: "Country Placement",
            },
          },
        },
        stat_2: {
          fields: {
            value: {
              value_type: "data",
              presentation_type: "text",
              value: "osu_global_placement",
            },
            label: {
              value_type: "custom_string",
              presentation_type: "text",
              value: "Global Placement",
            },
          },
        },
        stat_4: {
          fields: {
            value: {
              value_type: "data",
              presentation_type: "text",
              value: "osu_overall_pp",
            },
            label: {
              value_type: "custom_string",
              presentation_type: "text",
              value: "Overall pp",
            },
          },
        },
        stat_1: {
          fields: {
            value: {
              value_type: "data",
              presentation_type: "text",
              value: "osu_country",
            },
            icon: {
              value_type: "data",
              presentation_type: "image",
              value: "osu_flag",
            },
            label: {
              value_type: "custom_string",
              presentation_type: "text",
              value: "Country",
            },
          },
        },
      },
    },
    add_widget_preview: {
      layout: "add_widget_preview_contained",
      components: {
        contained_image: {
          fields: {
            image: {
              value_type: "data",
              presentation_type: "image",
              value: "osu_profile",
            },
          },
        },
      },
    },
    widget_top: {
      layout: "widget_top_contained",
      components: {
        subtitle_2: {
          fields: {
            text: {
              value_type: "data",
              presentation_type: "text",
              value: "osu_is_supporter",
            },
            label: {
              value_type: "custom_string",
              presentation_type: "text",
              value: "Supporter",
            },
          },
        },
        title: {
          fields: {
            text: {
              value_type: "data",
              presentation_type: "text",
              value: "osu_name",
            },
          },
        },
        subtitle_1: {
          fields: {
            text: {
              presentation_type: "text",
              value_type: "data",
              value: "osu_fav_map",
              fallback: {
                value_type: "custom_string",
                presentation_type: "text",
                value: "None",
              },
            },
            label: {
              value_type: "custom_string",
              presentation_type: "text",
              value: "Favorite Map",
            },
          },
        },
        subtitle_3: {
          fields: {
            text: {
              value_type: "data",
              presentation_type: "number",
              value: "osu_playcount",
            },
            label: {
              value_type: "custom_string",
              presentation_type: "text",
              value: "Playcount",
            },
          },
        },
        contained_image: {
          fields: {
            image: {
              value_type: "data",
              presentation_type: "image",
              value: "osu_profile",
            },
          },
        },
      },
    },
    mini_profile: {
      layout: "mini_profile_contained_stat",
      components: {
        stat: {
          fields: {
            text: {
              value_type: "data",
              presentation_type: "text",
              value: "osu_name",
            },
            label: {
              value_type: "data",
              presentation_type: "text",
              value: "osu_global_placement",
            },
          },
        },
        contained_image: {
          fields: {
            image: {
              value_type: "data",
              presentation_type: "image",
              value: "osu_profile",
            },
          },
        },
      },
    },
    activity_accessory: {
      layout: "activity_accessory_stat",
      components: {
        stat: {
          fields: {
            text: {
              value_type: "custom_string",
              presentation_type: "text",
              value: "Check out my stats",
            },
          },
        },
      },
    },
  },
};

const discordApplicationId = process.env.APP_ID!;
const discordAPI = axios.create({
  baseURL: "https://discord.com/api/v10",
  headers: {
    Authorization: "Bot " + process.env.DISCORD_TOKEN!,
  },
});

export async function createWidget() {
  let widgetConfigId = await isExist();

  try {
    if (widgetConfigId) {
      console.log(`Updating existing widget config: ${widgetConfigId}`);
      await discordAPI.patch(
        `/applications/${discordApplicationId}/widget-configs/${widgetConfigId}`,
        widgetData,
      );
    } else {
      console.log("No existing config found. Creating a new one...");
      const createResponse = await discordAPI.post(
        `/applications/${discordApplicationId}/widget-configs`,
        widgetData,
      );
      widgetConfigId = createResponse.data.id;
    }
    
    await publishWidget(widgetConfigId!);
    console.log(`Successfully published widget configuration: ${widgetConfigId}`);
  } catch (error: any) {
    console.error("Error setting up/publishing widget: ", error?.response?.data || error.message);
  }
}

async function isExist(): Promise<string | null> {
  try {
    const response = await discordAPI.get(
      `/applications/${discordApplicationId}/widget-configs`,
    );

    const configs = response.data;

    if (configs && configs.length > 0) {
      return configs[0].id;
    }

    return null;
  } catch (error: any) {
    if (error.response) {
      console.error(`ERROR Fetching widget configs:`, JSON.stringify(error.response.data));
    }
    return null;
  }
}

async function publishWidget(configId: string): Promise<void> {
  try {
    await discordAPI.post(
      `/applications/${discordApplicationId}/widget-configs/${configId}/publish`
    );
  } catch (error: any) {
    console.error(`ERROR Publishing widget config ${configId}:`, error.message);
    if (error.response) {
      console.error(`ERROR Details:`, JSON.stringify(error.response.data));
    }
    throw error;
  }
}

export async function patchIdentity(identity: any, userID: string) {
  try {
    await discordAPI.patch(
      `/applications/${discordApplicationId}/users/${userID}/identities/0/profile`,
      identity,
    );
  } catch (error: any) {
    console.error(`ERROR Discord API Patch failed: ${error.message}`);
    if (error.response) {
      console.error(
        `ERROR Status: ${error.response.status} | Data:`,
        JSON.stringify(error.response.data),
      );
    }
    throw error;
  }
}