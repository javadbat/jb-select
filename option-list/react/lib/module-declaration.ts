import type { JBOptionListWebComponent } from "jb-select/option-list";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "jb-option-list": JBOptionListType;
    }
    // biome-ignore lint/suspicious/noExplicitAny: the intrinsic element must accept every generic option-list instance
    interface JBOptionListType extends React.DetailedHTMLProps<React.HTMLAttributes<JBOptionListWebComponent<any, any>>, JBOptionListWebComponent<any, any>> {
      class?: string;
    }
  }
}
