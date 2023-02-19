export default class Utils {
  static readonly API_URL = import.meta.env.VITE_API_URL;
  static readonly API_VER = import.meta.env.VITE_API_VERSION;
  static readonly API_URI = `${Utils.API_URL}/api/${Utils.API_VER}`;
}
