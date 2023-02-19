export default class UrlService {
  static verifyUrl(url: string): boolean {
    try {
      // eslint-disable-next-line no-new
      new URL(url);
      return true;
    } catch (err) {
      return false;
    }
  }
}
