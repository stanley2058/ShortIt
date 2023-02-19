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

  afterAll((done) => {
    Database.getInstance()
      .disconnect()
      .finally(() => done());
  });
});
