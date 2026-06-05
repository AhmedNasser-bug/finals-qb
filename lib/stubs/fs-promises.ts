export const writeFile = async () => {};
export const readFile = async () => "";
export const mkdtemp = async () => "/tmp/temp";
export const rmdir = async () => {};
export const unlink = async () => {};

const fsPromises = { writeFile, readFile, mkdtemp, rmdir, unlink };
export default fsPromises;
