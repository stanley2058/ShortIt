import OpenGraphService from "../src/OpenGraphService";

describe("OpenGraphService", () => {
  beforeAll(async () => {
    await OpenGraphService.getInstance().connect();
  });

  it("fetches open graph metadata", async () => {
    const res1 = await OpenGraphService.getInstance().getOgMetadata(
      "https://google.com"
    );
    const res2 = await OpenGraphService.getInstance().getOgMetadata(
      "https://ogp.me"
    );

    expect(res1).toMatchObject({
      url: "https://google.com",
      ogTitle: "Google",
    });

    expect(res2).toMatchObject({
      url: "https://ogp.me",
      ogTitle: "Open Graph protocol",
      ogDescription:
        "The Open Graph protocol enables any web page to become a rich object in a social graph.",
      ogImage: "https://ogp.me/logo.png",
    });
  });

  afterAll(() => {
    OpenGraphService.getInstance().disconnect();
  });
});
