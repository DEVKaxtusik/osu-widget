import dotenv from 'dotenv';
dotenv.config();
import { createWidget } from "./providers/discord";

async function setup() {
  await createWidget();
}

setup();