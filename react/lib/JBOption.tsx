'use client'
/* eslint-disable react/display-name */
import React, { useEffect, useRef, useImperativeHandle, PropsWithChildren, ComponentProps } from 'react';
import { JBOptionWebComponent } from 'jb-select';
//TODO: make it generic when remove forward ref
type TValue = any;

declare module "react" {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'jb-option': JBOptionType;
    }
    interface JBOptionType extends React.DetailedHTMLProps<React.HTMLAttributes<JBOptionWebComponent<TValue>>, JBOptionWebComponent<TValue>> {
      class?: string,
    }
  }
}
export const JBOption = React.forwardRef((props: JBOptionProps<TValue>, ref) => {
  const element = useRef<JBOptionWebComponent<TValue>>(null);
  const {value,children,className, ...rest} = props;
  useImperativeHandle(
    ref,
    () => (element ? element.current : undefined),
    [element],
  );
  
  useEffect(() => {
    if (element.current && value !== undefined) {
      element.current.value = value;
    }
  }, [value, element]);

  return (
    <jb-option class={className} ref={element} {...rest}>
      {children}
    </jb-option>
  );
});

type Props<TValue> = {
  value:TValue
}

export type JBOptionProps<TValue> = PropsWithChildren<React.JSX.JBOptionType & Props<TValue>>
JBOption.displayName = 'JBOption';