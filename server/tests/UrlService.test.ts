import Database from "../src/databases/Database";
import UrlService from "../src/UrlService";

describe("UrlService", () => {
  beforeAll(async () => {
    await Database.getInstance().connect();
  });

  it("creates new unique url", async () => {
    const id = await UrlService.generateUrlId();
    expect(id.length).toBeGreaterThanOrEqual(4);
  });

  it("maps ShortUrl to TResOpenGraphUrl", () => {
    const mapped = UrlService.mapShortUrlToResOGUrl({
      id: "Test",
      url: "https://example.com",
      createdAt: new Date(),
      isOgCustom: false,
      ogDescription: null,
      ogImage: null,
      ogTitle: null,
      userId: null,
      views: 0,
    });
    expect(mapped).toEqual({
      id: "Test",
      url: "https://example.com",
    });
  });

  it("fetches open graph metadata", async () => {
    const res1 = await UrlService.fetchOgMetadata("https://google.com");
    const res2 = await UrlService.fetchOgMetadata("https://ogp.me");

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

  afterAll((done) => {
    Database.getInstance()
      .disconnect()
      .finally(() => done());
  });
});
