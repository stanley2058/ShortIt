import Database from "../src/databases/Database";
import Env from "../src/Env";
import UrlService from "../src/UrlService";

jest.mock("../src/databases/Connection");

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

  it("verifies URL", () => {
    expect(UrlService.verifyUrl("test_string")).toEqual(false);
    expect(UrlService.verifyUrl("http://google")).toEqual(true);
    expect(UrlService.verifyUrl("https://google.")).toEqual(true);
    expect(UrlService.verifyUrl("https://google.com")).toEqual(true);
    expect(UrlService.verifyUrl("https://google.com?123=456")).toEqual(true);
    expect(UrlService.verifyUrl(`${Env.baseUrl}/test`)).toEqual(false);
  });

  afterAll((done) => {
    Database.getInstance()
      .disconnect()
      .finally(() => done());
  });
});
