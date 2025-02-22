import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-select",
    path: "./lib/index.ts",
    outputPath: "./dist/index.js",
    umdName: "JBSelect",
    external: ["jb-validation", "jb-core"],
    globals: {
      "jb-validation": "JBValidation",
      "jb-core":"JBCore"
    },
  },
];
export const reactComponentList: ReactComponentBuildConfig[] = [
  {
    name: "jb-select-react",
    path: "./react/lib/index.tsx",
    outputPath: "./react/dist/index.js",
    external: ["jb-select", "prop-types", "react", "jb-core", "jb-core/react"],
    globals: {
      react: "React",
      "jb-select": "JBSelect",
      "jb-core":"JBCore",
      "jb-core/react":"JBCoreReact",
    },
    umdName: "JBSelectReact",
    dir: "./react"
  },
];