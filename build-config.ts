import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-select",
    path: "./lib/index.ts",
    outputPath: "./dist/index.js",
    umdName: "JBSelect",
    external: ["jb-validation", "jb-core","jb-form","jb-core/i18n","jb-core/theme", "jb-button", "jb-popover"],
    globals: {
      "jb-validation": "JBValidation",
      "jb-core":"JBCore",
      "jb-form":"JBForm",
      "jb-popover":"JBPopover",
      "jb-button":"JBButton",
      "jb-core/i18n":"JBCoreI18N",
      "jb-core/theme":"JBCoreTheme"
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