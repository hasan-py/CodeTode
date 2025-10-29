export const buildQueryString = (
  params: Record<string, string | number | boolean | undefined | null>
): string => {
  const esc = encodeURIComponent;
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${esc(k)}=${esc(String(v))}`)
    .join("&");
  return query ? `?${query}` : "";
};
