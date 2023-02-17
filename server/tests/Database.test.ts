import { TShortUrl } from "../src/types/TShortUrl";
import Database from "../src/databases/Database";

describe("database", () => {
  const url: TShortUrl = {
    id: "this_is_a_test_record",
    url: "https://google.com",
    isOgCustom: false,
  };

  it("insert short url", async () => {
    const insertRes = await Database.getInstance().updateOrInsert(url);
    expect(url.id).toEqual(insertRes.id);
  });

  it("gets short url by id", async () => {
    const getRes = await Database.getInstance().get(url.id);
    expect(url.id).toEqual(getRes?.id);
  });

  it("update short url", async () => {
    const update = {
      ...url,
      url: "https://example.com",
    };
    const res = await Database.getInstance().updateOrInsert(update);
    expect(url.id).toEqual(res.id);
    expect(res.url).toEqual(update.url);
  });

  it("delete short url by id", async () => {
    await Database.getInstance().delete(url.id);
    const res = await Database.getInstance().get(url.id);
    expect(res).toBeNull();
  });

  afterAll((done) => {
    Database.getInstance().closeAllConnection();
    done();
  });
});
