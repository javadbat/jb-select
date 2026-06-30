import type { JBOptionListWebComponent, JBOptionWebComponent, JBSelectWebComponent } from "jb-select";

type TOption = any;
type TValue = any;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      'jb-option-list': JBOptionListType;
      'jb-option': JBOptionType;
      'jb-select': JBSelectType;
    }
    interface JBOptionListType extends React.DetailedHTMLProps<React.HTMLAttributes<JBOptionListWebComponent<TOption, TValue>>, JBOptionListWebComponent<TOption, TValue>> {
      class?: string,
      // ref:React.RefObject<JBDateInputWebComponent>,
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
