export function exec() {
  throw new Error("child_process.exec is not available in the browser.");
}
const childProcess = { exec };
export default childProcess;
