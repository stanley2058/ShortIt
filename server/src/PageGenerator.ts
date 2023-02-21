import { TShortUrl } from "./types/TShortUrl";

const baseRedirectHtml = `<html>
<head>
  <title>$OG_TITLE</title>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0; url=$URL">
  <meta property="og:url" content="$URL" />
  <meta property="og:title" content="$OG_TITLE" />
  $OPT_OG_INFO
  <script>
    window.location.href = "$URL"
  </script>
</head>
<body>
If you are not redirected automatically, follow this <a href="$URL">link to $OG_TITLE</a>.
</body>
</html>`;

export default class PageGenerator {
  static generate(url: TShortUrl): string {
    const title = url.ogTitle || url.url;
    let optOgInfo = "";
    if (url.ogDescription)
      optOgInfo += `<meta property="og:description" content="${url.ogDescription}" />`;
    if (url.ogImage)
      optOgInfo += `<meta property="og:image" content="${url.ogImage}" />`;

    const html = baseRedirectHtml
      .replace(/\$URL/g, url.url)
      .replace(/\$OG_TITLE/g, title)
      .replace("$OPT_OG_INFO", optOgInfo);

    return html;
  }
}
