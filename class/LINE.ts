import credentials from "../constants/credentials";
import * as line from "@line/bot-sdk";

line.middleware({
  channelSecret: credentials.LINE_CHANNEL_SECRET,
});

class LINE {
  private client;

  constructor() {
    this.client = new line.messagingApi.MessagingApiClient({
      channelAccessToken: credentials.LINE_CHANNEL_ACCESS_TOKEN,
    });
  }

  public async sendText(to: string, text: string) {
    await this.client.pushMessage({
      to,
      messages: [
        {
          type: "textV2",
          text,
          substitution: {
            laugh: {
              type: "emoji",
              productId: "670e0cce840a8236ddd4ee4c",
              emojiId: "001",
            },
            sad: {
              type: "emoji",
              productId: "670e0cce840a8236ddd4ee4c",
              emojiId: "007",
            },
            everyone: {
              type: "mention",
              mentionee: {
                type: "all",
              },
            },
          },
        },
      ],
    });
  }
}

export default new LINE();
