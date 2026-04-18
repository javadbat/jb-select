'use client'
import React, { useEffect, useRef, useImperativeHandle, PropsWithChildren, ComponentProps, type RefObject } from 'react';
import { JBOptionWebComponent } from 'jb-select';
import './module-declaration.js';



export function JBOption<TValue> (props: JBOptionProps<TValue>){
  const element = useRef<JBOptionWebComponent<TValue>>(null);
  // value is inside ...rest
  const {children, ref,className, ...rest} = props;
  useImperativeHandle(
    ref,
    () => (element.current??undefined),
    [element],
  );

  return (
    <jb-option class={className} ref={element} {...rest}>
      {children}
    </jb-option>
  );
};

type Props<TValue> = {
  value:TValue,
  ref?: React.ForwardedRef<JBOptionWebComponent<TValue> | undefined>
}

export type JBOptionProps<TValue> = PropsWithChildren<React.JSX.JBOptionType & Props<TValue>>
JBOption.displayName = 'JBOption';