/* eslint-disable react/display-name */
import React, { useEffect, useRef, useState, useImperativeHandle,CSSProperties } from 'react';
import 'jb-select';
import { useBindEvent } from '../../../../common/hooks/use-event.js';
// eslint-disable-next-line no-duplicate-imports
import { JBSelectWebComponent } from 'jb-select';
export type JBSelectEventType<T> = T & {
    target: JBSelectWebComponent
}
declare global {
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

export const JBSelect = React.forwardRef((props:JBSelectProps, ref) => {
  const element = useRef<JBSelectWebComponent>(null);
  const [refChangeCount, refChangeCountSetter] = useState(0);
  useImperativeHandle(
    ref,
    () => (element ? element.current : {}),
    [element],
  );
  useEffect(() => {
    refChangeCountSetter(refChangeCount + 1);
  }, [element.current]);
  useEffect(() => {
    if(element.current){
      element.current.value = props.value;
    }
  }, [props.value]);
  useEffect(() => {
    if (typeof props.getSelectedValueDOM == "function" && element.current && element.current) {
      element.current.callbacks.getSelectedValueDOM = props.getSelectedValueDOM;
    }
  }, [props.getSelectedValueDOM]);
  useEffect(() => {
    if (props.message !== null && props.message !== undefined ) {
      element.current?.setAttribute("message", props.message);
    }
  }, [props.message]);
  useEffect(() => {
    if (props.placeholder !== null && props.placeholder !== undefined) {
      element.current?.setAttribute("placeholder", props.placeholder);
    }
  }, [props.placeholder]);
  useEffect(() => {
    if (props.searchPlaceholder !== null && props.searchPlaceholder !== undefined) {
      element.current?.setAttribute("search-placeholder", props.searchPlaceholder);
    }
  }, [props.searchPlaceholder]);
  function onKeyup(e:JBSelectEventType<KeyboardEvent>) {
    if ( typeof props.onKeyup == "function") {
      props.onKeyup(e);
    }
  }
  function onChange(e:JBSelectEventType<Event>) {
    if (typeof props.onChange =="function") {
      props.onChange(e);
    }
  }
  function onInput(e:JBSelectEventType<InputEvent>) {
    if (typeof props.onInput == "function") {
      props.onInput(e);
    }
  }
  useBindEvent(element, 'keyup', onKeyup);
  useBindEvent(element, 'change', onChange);
  useBindEvent(element, 'input', onInput);
  return (
    <jb-select style={props.style?props.style:undefined} class={props.className?props.className:""} label={props.label} ref={element} required={props.required || 'false'} name={props.name??undefined}>
      {props.children}
    </jb-select>
  );
});

export type JBSelectProps = {
    style?:CSSProperties,
    label?: string,
    getSelectedValueDOM?: (option:any)=>HTMLElement,
    value?: any,
    onChange?: (e:JBSelectEventType<Event>)=>void,
    onKeyup?: (e:JBSelectEventType<KeyboardEvent>)=>void,
    onInput?: (e:JBSelectEventType<InputEvent>)=>void,
    required?: boolean,
    message?: string,
    placeholder?: string,
    searchPlaceholder?: string,
    className?: string,
    children?:React.ReactNode,
    name?:string
}
JBSelect.displayName = 'JBSelect';