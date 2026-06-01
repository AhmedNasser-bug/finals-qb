import { register } from "node:module";
import { pathToFileURL } from "node:url";

register(
  "data:text/javascript," +
    encodeURIComponent(`
  import { fileURLToPath } from "node:url";
  import fs from "node:fs";

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
      let fileUrlString = newSpecifier;
      if (newSpecifier.startsWith(".")) {
        fileUrlString = new URL(newSpecifier, context.parentURL).href;
      }
      try {
        const filePath = fileURLToPath(fileUrlString);
        if (fs.existsSync(filePath + ".ts")) {
          newSpecifier = newSpecifier + ".ts";
        } else if (fs.existsSync(filePath + ".tsx")) {
          newSpecifier = newSpecifier + ".tsx";
        } else {
          newSpecifier = newSpecifier + ".ts";
        }
      } catch (err) {
        newSpecifier = newSpecifier + ".ts";
      }
    }

    return nextResolve(newSpecifier, context);
  }
`),
  pathToFileURL("./")
);
