export function parsePortraitDataUrl(dataUrl: string) {
  const matched = dataUrl.match(/^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/=]+)$/);
  if (!matched) return null;
  const [, contentType, encoded] = matched;
  const extension = contentType === "image/png" ? "png" : contentType === "image/webp" ? "webp" : "jpg";
  return { contentType, extension, buffer: Buffer.from(encoded, "base64") };
}
