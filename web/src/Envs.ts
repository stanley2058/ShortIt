export default class Envs {
  static readonly API_URL = import.meta.env.VITE_API_URL;
  static readonly API_VER = import.meta.env.VITE_API_VERSION;
  static readonly API_URI = `${Envs.API_URL}/api/${Envs.API_VER}`;
}
