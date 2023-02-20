export default class Envs {
  static readonly SERVER_URL = import.meta.env.PROD
    ? window.origin
    : import.meta.env.VITE_API_URL;
  static readonly API_VER = import.meta.env.VITE_API_VERSION;
  static readonly API_URI = `${Envs.SERVER_URL}/api/${Envs.API_VER}`;
}
