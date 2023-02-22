// eslint-disable-next-line import/extensions, @typescript-eslint/ban-ts-comment
import Swal from "sweetalert2/dist/sweetalert2.js";
import { TOpenGraphUrl } from "../types/TOpenGraphUrl";
import Envs from "../Envs";
import { TShortUrl } from "../types/TShortUrl";
import { UrlFormValue } from "../types/TUrlFormValue";

type ReqOgUrl = TOpenGraphUrl & { id?: string };
type ResOgUrl = TOpenGraphUrl & { id: string };

export default class UrlService {
  private static readonly defaultFetchOption = {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  } as const;
  private static readonly error401 = new Error(
    "please login to perform this operation"
  );
  private static readonly error403 = new Error(
    "user identity does not match target identity"
  );
  private static readonly errorUnknown = new Error(
    "an unknown error has occurred"
  );

  static async submit(
    values: UrlFormValue,
    edit?: TShortUrl
  ): Promise<boolean> {
    try {
      const res = await UrlService.postUrl({
        id: edit?.id,
        url: values.url,
        ogTitle: values.ogTitle || undefined,
        ogDescription: values.ogDescription || undefined,
        ogImage: values.ogImage || undefined,
      });
      const shorted = `${Envs.SERVER_URL}/${res.id}`;
      const sRes = await Swal.fire({
        icon: "success",
        title: edit ? "Changes saved!" : "URL Shortened!",
        html: `<a href=${shorted} target="_blank">${shorted}</a>`,
        confirmButtonText: "Copy to clipboard!",
        showCancelButton: !edit,
      });
      if (sRes.isConfirmed) {
        await UrlService.copyToClipboard(shorted);
        return true;
      }
    } catch (err) {
      await Swal.fire({
        icon: "error",
        title: "Oh no! Something went wrong.",
        text: (err as Error).message,
      });
    }
    return false;
  }

  /**
   * Verifies if an URL is valid for ShortIt!
   * @param url URL to verify
   * @returns [isValid, invalid reason]
   */
  static verifyUrl(url: string): [boolean, string | null] {
    try {
      const toVerify = new URL(url);
      const base = new URL(Envs.SERVER_URL);
      const isValid = toVerify.host !== base.host;
      return [isValid, isValid ? null : "Cannot short an URL from ShortIt!"];
    } catch (err) {
      return [false, "Invalid URL"];
    }
  }

  static async postUrl(url: ReqOgUrl): Promise<ResOgUrl> {
    const res = await fetch(`${Envs.API_URI}/url`, {
      ...this.defaultFetchOption,
      method: "POST",
      body: JSON.stringify(url),
    });

    switch (res.status) {
      case 400:
        throw new Error("please supply the corresponded body parameters");
      case 401:
        throw this.error401;
      case 403:
        throw this.error403;
      case 200:
        return res.json();
      default:
        throw this.errorUnknown;
    }
  }

  static async getAllUrl(skip?: number, take?: number): Promise<TShortUrl[]> {
    const requestUrl = new URL(`${Envs.API_URI}/url`);
    if (skip) requestUrl.searchParams.append("s", skip.toString());
    if (take) requestUrl.searchParams.append("t", take.toString());

    const res = await fetch(requestUrl, {
      ...this.defaultFetchOption,
      method: "GET",
    });

    switch (res.status) {
      case 401:
        throw this.error401;
      case 200:
        return res.json();
      default:
        throw this.errorUnknown;
    }
  }

  static async countUrls(): Promise<number> {
    const requestUrl = new URL(`${Envs.API_URI}/url/count`);
    const res = await fetch(requestUrl, {
      ...this.defaultFetchOption,
      method: "GET",
    });

    switch (res.status) {
      case 401:
        throw this.error401;
      case 200:
        return ((await res.json()) as { count: number }).count;
      default:
        throw this.errorUnknown;
    }
  }

  static async deleteUrl(id: string): Promise<void> {
    const res = await fetch(`${Envs.API_URI}/url/${id}`, {
      ...this.defaultFetchOption,
      method: "DELETE",
    });

    switch (res.status) {
      case 401:
        throw this.error401;
      case 403:
        throw this.error403;
      case 204:
        return;
      default:
        throw this.errorUnknown;
    }
  }

  static async copyToClipboard(text: string): Promise<void> {
    if (!text) return;
    const encoded = encodeURI(text);
    if (!navigator.clipboard) this.fallbackCopyTextToClipboard(encoded);
    else await navigator.clipboard.writeText(encoded);
  }
  private static fallbackCopyTextToClipboard(text: string) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } finally {
      document.body.removeChild(textArea);
    }
  }
}
