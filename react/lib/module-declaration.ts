import type { JBOptionWebComponent } from "jb-select";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      'jb-option': JBOptionType;
    }
    interface JBOptionType extends React.DetailedHTMLProps<React.HTMLAttributes<JBOptionWebComponent<any>>, JBOptionWebComponent<any>> {
      class?: string,
    }
  }
}