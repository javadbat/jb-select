import type { JBSelectWebComponent } from "jb-select";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      'jb-select': JBSelectType;
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
      value?: any,
      initialValue?: any,
    }
  }
}
