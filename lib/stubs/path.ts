export function extname(p: string): string {
  const i = p.lastIndexOf(".");
  return i < 0 ? "" : p.substring(i);
}

export function join(...args: string[]): string {
  return args.filter(Boolean).join("/").replace(/\/+/g, "/");
}

export function basename(p: string, ext?: string): string {
  const i = p.lastIndexOf("/");
  let base = i < 0 ? p : p.substring(i + 1);
  if (ext && base.endsWith(ext)) {
    base = base.substring(0, base.length - ext.length);
  }
  return base;
}

const path = { extname, join, basename };
export default path;
