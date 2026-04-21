import type { JBOptionWebComponent, JBSelectWebComponent } from "jb-select";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      'jb-option': JBOptionType;
      'jb-select': JBSelectType;
    }
    interface JBOptionType extends React.DetailedHTMLProps<React.HTMLAttributes<JBOptionWebComponent<any>>, JBOptionWebComponent<any>> {
      class?: string,
    }
    interface JBSelectType extends React.DetailedHTMLProps<React.HTMLAttributes<JBSelectWebComponent>, JBSelectWebComponent> {
      class?: string,
      label?: string,
      name?: string,
      required?: string | boolean,
      message?: string,
      tabindex?: string,
      size?: string,
      "hide-clean"?: string,
    }
  }
}