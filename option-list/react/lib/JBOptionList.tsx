"use client";
/* eslint-disable react/display-name */
import "jb-select/option-list";
// biome-ignore lint/style/useImportType: the classic JSX transform needs React at runtime
import React, { useEffect, useImperativeHandle, useRef } from "react";
import type { JBOptionListWebComponent } from "jb-select/option-list";
import "./module-declaration.js";

export function JBOptionList<TOption, TValue>(props: JBOptionListProps<TOption, TValue>) {
  const element = useRef<JBOptionListWebComponent<TOption, TValue>>(null);
  const { ref } = props;
  useImperativeHandle(ref, () => element.current ?? undefined, []);
  useEffect(() => {
    if (element.current && Array.isArray(props.optionList)) {
      element.current.optionList = props.optionList;
    }
  }, [props.optionList]);
  useEffect(() => {
    if (element.current && typeof props.getTitle == "function") {
      element.current.setCallback("getTitle", props.getTitle);
    }
  }, [props.getTitle]);
  useEffect(() => {
    if (element.current && typeof props.getValue == "function") {
      element.current.setCallback("getValue", props.getValue);
    }
  }, [props.getValue]);
  useEffect(() => {
    if (element.current && typeof props.getContentDOM == "function") {
      element.current.setCallback("getContentDOM", props.getContentDOM);
    }
  }, [props.getContentDOM]);
  return <jb-option-list ref={element}></jb-option-list>;
}

export type JBOptionListProps<TOption, TValue> = {
  optionList: TOption[];
  getTitle?: (option: TOption) => string;
  getValue?: (option: TOption) => TValue;
  getContentDOM?: (option: TOption) => HTMLElement;
  ref?: React.ForwardedRef<JBOptionListWebComponent<TOption, TValue> | undefined>;
};
JBOptionList.displayName = "JBOptionList";
