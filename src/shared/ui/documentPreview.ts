/** Returns whether a MIME type can be rendered inline in the browser. */
export function isPreviewable(contentType: string | null): boolean {
  if (!contentType) return false;
  return contentType.startsWith("image/") || contentType === "application/pdf";
}
