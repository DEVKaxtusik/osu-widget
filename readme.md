## Example Surface Layout

![Example data](./assets/example_data.png)
![Example layout](./assets/example_layout.png)

## Prerequisites

Before running the script, you will need to register applications on both developer portals:

1. **osu! API Credentials:** Go to your [osu! Account Settings](https://osu.ppy.sh/home/account/edit#oauth), scroll down to **OAuth Applications**, and click **New Application**. Copy your `Client ID` and `Client Secret`.
2. **Discord App Credentials:** Go to the [Discord Developer Portal](https://discord.com/developers/applications), create an application, and retrieve your `Application ID` (App ID) and Bot `Token`.

## Installation

Clone the repository and install the required dependencies:

```bash
pnpm install

```

Ensure you have your TypeScript configuration set up if you are compiling manually, or use `ts-node` / `tsx` to execute the file directly.

## Configuration

Copy `.env.example` to a new file named `.env` in the root directory and populate it with your environment variables. In src/index.ts replace `OSU_USERNAME` with yours.

## Usage

To execute the synchronization pipeline once:

```bash
pnpm dlx ts-node src/index.ts

```

# Roadmap

- Support for discord application slashcommands (User identity refreshing via command)
