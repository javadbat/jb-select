import type { ReactComponentBuildConfig, WebComponentBuildConfig } from "../../tasks/build/builder/src/types.ts";

export const webComponentList: WebComponentBuildConfig[] = [
  {
    name: "jb-option",
    path: "./option/web-component/lib/index.ts",
    outputPath: "./option/web-component/dist/index.js",
    tsConfigPath: "./option/web-component/tsconfig.json",
    umdName: "JBOption",
    dir: "./option",
  },
  {
    name: "jb-option-list",
    path: "./option-list/web-component/lib/index.ts",
    outputPath: "./option-list/web-component/dist/index.js",
    tsConfigPath: "./option-list/web-component/tsconfig.json",
    external: ["jb-select/option"],
    globals: {
      "jb-select/option": "JBOption",
    },
    umdName: "JBOptionList",
    dir: "./option-list",
  },
  {
    name: "jb-listbox",
    path: "./listbox/web-component/lib/index.ts",
    outputPath: "./listbox/web-component/dist/index.js",
    tsConfigPath: "./listbox/web-component/tsconfig.json",
    external: ["jb-select/option", "jb-validation", "jb-form", "jb-core", "jb-core/theme", "jb-core/i18n"],
    globals: {
      "jb-select/option": "JBOption",
      "jb-validation": "JBValidation",
      "jb-form": "JBForm",
      "jb-core": "JBCore",
      "jb-core/theme": "JBCoreTheme",
      "jb-core/i18n": "JBCoreI18N",
    },
    umdName: "JBListbox",
    dir: "./listbox",
  },
  {
    name: "jb-select",
    path: "./web-component/lib/index.ts",
    outputPath: "./web-component/dist/index.js",
    tsConfigPath: "./web-component/tsconfig.json",
    umdName: "JBSelect",
    external: ["jb-validation", "jb-core","jb-form","jb-core/i18n","jb-core/theme", "jb-button", "jb-popover", "jb-select/option", "jb-select/option-list"],
    globals: {
      "jb-validation": "JBValidation",
      "jb-core":"JBCore",
      "jb-form":"JBForm",
      "jb-popover":"JBPopover",
      "jb-button":"JBButton",
      "jb-core/i18n":"JBCoreI18N",
      "jb-core/theme":"JBCoreTheme",
      "jb-select/option":"JBOption",
      "jb-select/option-list":"JBOptionList"
    },
  },
];
export const reactComponentList: ReactComponentBuildConfig[] = [
  {
    name: "jb-option-react",
    path: "./option/react/lib/index.tsx",
    outputPath: "./option/react/dist/index.js",
    external: ["jb-select/option", "react"],
    globals: {
      react: "React",
      "jb-select/option": "JBOption",
    },
    umdName: "JBOptionReact",
    dir: "./option/react",
    tsConfigPath: "./option/react/tsconfig.json",
  },
  {
    name: "jb-option-list-react",
    path: "./option-list/react/lib/index.tsx",
    outputPath: "./option-list/react/dist/index.js",
    external: ["jb-select/option-list", "react"],
    globals: {
      react: "React",
      "jb-select/option-list": "JBOptionList",
    },
    umdName: "JBOptionListReact",
    dir: "./option-list/react",
    tsConfigPath: "./option-list/react/tsconfig.json",
  },
  {
    name: "jb-listbox-react",
    path: "./listbox/react/lib/index.tsx",
    outputPath: "./listbox/react/dist/index.js",
    external: ["jb-select/listbox", "jb-select/listbox/web-component", "react", "jb-core", "jb-core/react"],
    globals: {
      react: "React",
      "jb-select/listbox": "JBListbox",
      "jb-select/listbox/web-component": "JBListbox",
      "jb-core": "JBCore",
      "jb-core/react": "JBCoreReact",
    },
    umdName: "JBListboxReact",
    dir: "./listbox/react",
  },
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
