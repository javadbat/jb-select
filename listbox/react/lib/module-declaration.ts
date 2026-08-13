import type { JBListboxWebComponent } from "jb-select/listbox";

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "jb-listbox": JBListboxType;
    }
    // biome-ignore lint/suspicious/noExplicitAny: the intrinsic element must accept every generic listbox instance
    interface JBListboxType extends React.DetailedHTMLProps<React.HTMLAttributes<JBListboxWebComponent<any>>, JBListboxWebComponent<any>> {
      class?: string;
      disabled?: boolean;
      initialValue?: unknown;
      label?: string;
      message?: string;
      multiple?: boolean;
      name?: string;
      required?: boolean;
      value?: unknown;
    }
  }
}
