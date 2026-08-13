import type { JBOptionWebComponent } from "jb-select/option";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "jb-option": JBOptionType;
    }
    interface JBOptionType extends React.DetailedHTMLProps<React.HTMLAttributes<JBOptionWebComponent<unknown>>, JBOptionWebComponent<unknown>> {
      class?: string;
    }
  }
}
