export function assetUrl(path) {
  const cleanPath = path.replace(/^\/+/, "");
  const base = import.meta.env.BASE_URL || "/";
  return `${base.replace(/\/?$/, "/")}${cleanPath}`;
}