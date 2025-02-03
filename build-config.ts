import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-select",
    path: "./lib/index.ts",
    outputPath: "./dist/index.js",
    umdName: "JBSelect",
    external: ["jb-validation"],
    globals: {
      "jb-validation": "JBValidation",
    },
  },
];
export const reactComponentList: ReactComponentBuildConfig[] = [
  {
    name: "jb-select-react",
    path: "./react/lib/index.tsx",
    outputPath: "./react/dist/index.js",
    external: ["jb-select", "prop-types", "react"],
    globals: {
      react: "React",
      "prop-types": "PropTypes",
    },
    umdName: "JBSelectReact",
    dir: "./react"
  },
];