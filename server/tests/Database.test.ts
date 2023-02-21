import { TShortUrl } from "../src/types/TShortUrl";
import Database from "../src/databases/Database";

jest.mock("../src/databases/Connection");

describe("database", () => {
  const url = {
    id: "this_is_a_test_record",
    url: "https://google.com",
    userId: "abc@example.com",
    isOgCustom: false,
  } satisfies TShortUrl;

  beforeAll(async () => {
    await Database.getInstance().connect();
  });

  it("insert short url", async () => {
    const res = await Database.getInstance().updateOrInsert(url);
    expect(url.id).toEqual(res.id);
  });

  it("gets short url by id", async () => {
    const res = await Database.getInstance().get(url.id);
    expect(url.id).toEqual(res?.id);
  });

  it("gets short url by user", async () => {
    const res = await Database.getInstance().getByUser(url.userId ?? "");
    expect(res).toHaveLength(1);
    expect(url.id).toEqual(res[0].id);

    const resWithLimit = await Database.getInstance().getByUser(
      url.userId ?? "",
      1,
      1
    );
    expect(resWithLimit).toHaveLength(0);
  });

  it("gets url counts by user", async () => {
    const res = await Database.getInstance().countByUser(url.userId);
    expect(res).toEqual(1);
  });

  it("update short url", async () => {
    const update: TShortUrl = {
      ...url,
      url: "https://example.com",
      isOgCustom: true,
      ogTitle: "Test!",
      ogDescription: "Test record!",
      ogImage: "https://example.com/example.png",
    };
    const res = await Database.getInstance().updateOrInsert(update);
    expect(url.id).toEqual(res.id);
    expect(res.url).toEqual(update.url);
  });

  it("gets short url by url", async () => {
    const res1 = await Database.getInstance().getByUrl(
      "https://example.com",
      undefined,
      true
    );
    const res2 = await Database.getInstance().getByUrl("https://google.com");
    const res3 = await Database.getInstance().getByUrl(
      "https://example.com",
      "123@example.com"
    );
    const res4 = await Database.getInstance().getByUrl(
      "https://example.com",
      "abc@example.com"
    );
    const res5 = await Database.getInstance().getByUrl("https://example.com");

    const res6 = await Database.getInstance().getByUrl(
      "https://example.com",
      "abc@example.com",
      true
    );

    expect(res1).toBeNull();
    expect(res2).toBeNull();
    expect(res3).toBeNull();
    expect(res4).toBeNull();
    expect(res5).toBeNull();
    expect(res6).toBeTruthy();
  });

  it("delete short url by id", async () => {
    await Database.getInstance().delete(url.id);
    const res = await Database.getInstance().get(url.id);
    expect(res).toBeNull();
  });

  afterAll(async () => {
    await Database.getInstance().disconnect();
  });
});
