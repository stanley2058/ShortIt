import { TShortUrl } from "../src/types/TShortUrl";
import Database from "../src/databases/Database";

describe("database", () => {
  const url: TShortUrl = {
    id: "this_is_a_test_record",
    url: "https://google.com",
    userId: "abc@example.com",
    isOgCustom: false,
  };

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
