'use client'
/* eslint-disable react/display-name */
import React, { useRef, useImperativeHandle,CSSProperties } from 'react';
import 'jb-select';
// eslint-disable-next-line no-duplicate-imports
import { JBSelectWebComponent } from 'jb-select';
import { EventProps, useEvents } from './events-hook.js';
import { useJBSelectAttribute, type JBSelectAttributes } from './attributes-hook.js';
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
        // ref:React.RefObject<JBDateInputWebComponent>,
      }
    }
}
//TODO: use generic when using react19 ref
type TValue = any;
export const JBSelect = React.forwardRef((props:Props, ref) => {
  const element = useRef<JBSelectWebComponent>(null);
  useImperativeHandle(
    ref,
    () => (element ? element.current : undefined),
    [element],
  );


  useEvents(element,props);
  useJBSelectAttribute(element,props);
  return (
    <jb-select style={props.style?props.style:undefined} class={props.className?props.className:""} ref={element}>
      {props.children}
    </jb-select>
  );
});

export type Props = EventProps & JBSelectAttributes<TValue> & {
    style?:CSSProperties,
    className?: string,
    children?:React.ReactNode,
}
JBSelect.displayName = 'JBSelect';