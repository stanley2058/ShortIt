import PageGenerator from "../src/PageGenerator";
import UrlService from "../src/UrlService";

describe("PageGenerator", () => {
  const base = {
    id: "0775dd48-61d3-4984-aa72-b08d01b8fae7",
    alias: "TEST",
    isOgCustom: false,
    url: "https://example.com",
    urlHash: UrlService.toSHA256("https://example.com"),
  };
  it("generate redirect html", () => {
    const res1 = PageGenerator.generate({
      ...base,
    });
    const res2 = PageGenerator.generate({
      ...base,
      ogTitle: "Test!",
      ogDescription: "TestDes",
      ogImage: "https://example.com/example.png",
    });

    expect(res1).toMatch(new RegExp(`<title>${base.url}</title>`));
    expect(res1).toMatch(new RegExp(`window.location.href = "${base.url}"`));
    expect(res1).toMatch(
      new RegExp(`<meta http-equiv="refresh" content="0; url=${base.url}">`)
    );
    expect(res2).toMatch(new RegExp(`<a href="${base.url}">link to Test!</a>`));
    expect(res2).toMatch(/<meta property="og:title" content="Test!" \/>/);
    expect(res2).toMatch(
      new RegExp(`<meta property="og:description" content="TestDes" />`)
    );
  });
});
