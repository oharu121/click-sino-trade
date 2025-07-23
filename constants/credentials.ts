import dotenv from "dotenv";
dotenv.config();

const credentials = {
  LINE_CHANNEL_ID: process.env["LINE_CHANNEL_ID"] || "",
  LINE_CHANNEL_SECRET: process.env["LINE_CHANNEL_SECRET"] || "",
  LINE_CHANNEL_ACCESS_TOKEN: process.env["LINE_CHANNEL_ACCESS_TOKEN"] || "",
};

export default credentials;
