'use client'
/* eslint-disable react/display-name */
import React, { useRef, useImperativeHandle, type PropsWithChildren } from 'react';
import 'jb-select';
// eslint-disable-next-line no-duplicate-imports
import type { JBSelectWebComponent, SizeVariants } from 'jb-select';
import { type EventProps, useEvents } from './events-hook.js';
import { useJBSelectAttribute, type JBSelectAttributes } from './attributes-hook.js';
import type { JBElementStandardProps } from 'jb-core/react';
export type JBSelectEventType<T> = T & {
    target: JBSelectWebComponent
}
declare module "react" {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      interface IntrinsicElements {
        'jb-select': JBSelectType;
      }
      interface JBSelectType extends React.DetailedHTMLProps<React.HTMLAttributes<JBSelectWebComponent>, JBSelectWebComponent> {
        class?:string,
        label?: string,
        name?:string,
        required?:string | boolean,
        message?:string,
        tabindex?:string,
        size?:string,
        "hide-clean"?:string,
      }
    }
}
export function JBSelect<TValue>(props:Props<TValue>) {
  const element = useRef<JBSelectWebComponent>(null);
  useImperativeHandle(
    props.ref,
    () => (element ? element.current : undefined),
    [element],
  );
  const {onChange,onInit,onInput,onKeyUp,onLoad,error,getSelectedValueDOM,label,name,required,message,placeholder,searchPlaceholder,validationList,value, hideClear, ...otherProps} = props;
  useEvents(element,{onChange,onInit,onInput,onKeyUp,onLoad});
  useJBSelectAttribute(element,{error,getSelectedValueDOM,label,name,required,message,placeholder,searchPlaceholder,validationList,value,hideClear});
  return (
    <jb-select ref={element} {...otherProps}>
      {props.children}
    </jb-select>
  );
};

export type Props<TValue> = PropsWithChildren<EventProps & JBSelectAttributes<TValue>> & JBElementStandardProps<JBSelectWebComponent, keyof EventProps & JBSelectAttributes<TValue>>  & {
    ref?: React.RefObject<JBSelectWebComponent>,
    size?: SizeVariants,
}
JBSelect.displayName = 'JBSelect';