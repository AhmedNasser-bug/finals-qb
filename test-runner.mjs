import { register } from "node:module";
import { pathToFileURL } from "node:url";

register(
  "data:text/javascript," +
    encodeURIComponent(`
  export function resolve(specifier, context, nextResolve) {
    if (specifier === "@clerk/nextjs") {
      return {
        shortCircuit: true,
        url: "data:text/javascript,export const useAuth = () => ({ userId: null, isSignedIn: false });"
      };
    }
    let newSpecifier = specifier;
    if (specifier.startsWith("@/")) {
      newSpecifier = specifier.replace(/^@\\//, "file://" + process.cwd() + "/");
    }

    // Add missing extensions for local imports
    if ((newSpecifier.startsWith(".") || newSpecifier.startsWith("file://")) && !newSpecifier.match(/\\.[a-zA-Z0-9]+$/)) {
        newSpecifier = newSpecifier + ".ts";
    }

    return nextResolve(newSpecifier, context);
  }
`),
  pathToFileURL("./")
);

