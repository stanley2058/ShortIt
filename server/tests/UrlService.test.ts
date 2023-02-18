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

  afterAll((done) => {
    Database.getInstance()
      .disconnect()
      .finally(() => done());
  });
});
