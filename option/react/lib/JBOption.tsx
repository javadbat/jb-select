"use client";
import "jb-select/option";
import React, { type PropsWithChildren, useImperativeHandle, useRef } from "react";
import type { JBOptionWebComponent } from "jb-select/option";
import "./module-declaration.js";

export function JBOption<TValue>(props: JBOptionProps<TValue>) {
  const element = useRef<JBOptionWebComponent<TValue>>(null);
  // value is inside ...rest
  const { children, ref, className, ...rest } = props;
  useImperativeHandle(ref, () => element.current ?? undefined, []);

  return (
    <jb-option class={className} ref={element} {...rest}>
      {children}
    </jb-option>
  );
}

type Props<TValue> = {
  value: TValue;
  ref?: React.ForwardedRef<JBOptionWebComponent<TValue> | undefined>;
};

export type JBOptionProps<TValue> = PropsWithChildren<React.JSX.JBOptionType & Props<TValue>>;
JBOption.displayName = "JBOption";
