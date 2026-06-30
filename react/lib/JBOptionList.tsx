'use client'
/* eslint-disable react/display-name */
import React, { useEffect, useRef, useImperativeHandle } from 'react';
// eslint-disable-next-line no-duplicate-imports
import { JBOptionListWebComponent } from 'jb-select';
import './module-declaration.js';
type TOption = any;
type TValue = any;

export const JBOptionList = React.forwardRef((props: JBOptionListProps<TOption,TValue>, ref) => {
  const element = useRef<JBOptionListWebComponent<TOption, TValue>>(null);
  useImperativeHandle(
    ref,
    () => (element ? element.current : undefined),
    [element],
  );
  useEffect(() => {
    if (element.current && Array.isArray(props.optionList)) {
      element.current.optionList = props.optionList;
    }
  }, [props.optionList, element]);
  useEffect(() => {
    if (element.current && typeof props.getTitle == "function") {
      element.current.setCallback("getTitle",props.getTitle);
    }
  }, [props.getTitle, element]);
  useEffect(() => {
    if (element.current && typeof props.getValue == "function") {
      element.current.setCallback("getValue",props.getValue);
    }
  }, [props.getValue, element]);
  useEffect(() => {
    if (element.current && typeof props.getContentDOM == "function") {
      element.current.setCallback("getContentDOM",props.getContentDOM);
    }
  }, [props.getContentDOM, element]);
  return (
    <jb-option-list ref={element}>
    </jb-option-list>
  );
});

export type JBOptionListProps<TOption,TValue> = {
  optionList: TOption[],
  getTitle?: (option: TOption) => string,
  getValue?: (option: TOption) => TValue,
  getContentDOM?: (option: TOption) => HTMLElement,
}
JBOptionList.displayName = 'JBOptionList';
