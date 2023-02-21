import { UseFormReturnType, useForm } from "@mantine/form";
import UrlService from "../services/UrlService";
import { TShortUrl } from "../types/TShortUrl";
import { UrlFormValue } from "../types/TUrlFormValue";

export default function useMetadataForm(
  edit?: TShortUrl
): UseFormReturnType<UrlFormValue> {
  return useForm({
    initialValues: {
      url: edit?.url || "",
      ogTitle: edit?.ogTitle || "",
      ogImage: edit?.ogImage || "",
      ogDescription: edit?.ogDescription || "",
    },

    validate: {
      url: (value) => UrlService.verifyUrl(value)[1],
      ogImage: (value) =>
        value ? (UrlService.verifyUrl(value) ? null : "Invalid URL") : null,
    },
  });
}
