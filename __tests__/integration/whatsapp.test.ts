import WhatsappController from "../../src/whatsappweb/whatsapp.controller";

describe("Whatsapp bot", () => {
  it("should authenticate on whatsappweb", () => {
    const bot = new WhatsappController();
    expect(bot.path).toBe("/bot");
  });
});
