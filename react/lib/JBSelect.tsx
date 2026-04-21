'use client'
/* eslint-disable react/display-name */
import React, { useRef, useImperativeHandle, type PropsWithChildren } from 'react';
import 'jb-select';
// eslint-disable-next-line no-duplicate-imports
import type { JBSelectWebComponent, SizeVariants } from 'jb-select';
import { type EventProps, useEvents } from './events-hook.js';
import { useJBSelectAttribute, type JBSelectAttributes } from './attributes-hook.js';
import type { JBElementStandardProps } from 'jb-core/react';
import './module-declaration.js';
export type JBSelectEventType<T> = T & {
  target: JBSelectWebComponent
}
export function JBSelect<TValue>(props: Props<TValue>) {
  const element = useRef<JBSelectWebComponent>(null);
  const { onChange, onInit, onInput, onKeyUp, onLoad, ref, error, getSelectedValueDOM, label, required, message, placeholder, searchPlaceholder, validationList, value, hideClear, ...otherProps } = props;
  useImperativeHandle(
    ref,
    () => (element.current??undefined),
    [element],
  );
  useEvents(element, { onChange, onInit, onInput, onKeyUp, onLoad });
  useJBSelectAttribute(element, { error, getSelectedValueDOM, label, required, message, placeholder, searchPlaceholder, validationList, value, hideClear });
  return (
    <jb-select ref={element} {...otherProps}>
      {props.children}
    </jb-select>
  );
};

export type Props<TValue> = PropsWithChildren<EventProps & JBSelectAttributes<TValue>> & JBElementStandardProps<JBSelectWebComponent, keyof EventProps & JBSelectAttributes<TValue>> & {
  ref?: React.ForwardedRef<JBSelectWebComponent|null|undefined>,
  size?: SizeVariants,
  name?: string,
  disabled?:boolean,
}