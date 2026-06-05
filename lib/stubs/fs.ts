import { PassThrough } from "./stream";

export function existsSync() {
  return false;
}
export function readFileSync() {
  return "";
}
export function createReadStream() {
  return new PassThrough();
}
const fs = { existsSync, readFileSync, createReadStream };
export default fs;
