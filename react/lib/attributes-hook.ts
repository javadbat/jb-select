import type { JBSelectWebComponent, ValidationValue } from "jb-select";
import type { ValidationItem } from "jb-validation";
import { type RefObject, useEffect } from "react";

export type JBSelectAttributes<TValue> = {
  validationList?: ValidationItem<ValidationValue<TValue>>[],
  name?: string,
  label?: string,
  error?: string,
  value?: any,
  message?: string,
  placeholder?: string,
  searchPlaceholder?: string,
  required?: boolean,
  getSelectedValueDOM?: (option: any) => HTMLElement,

}
export function useJBSelectAttribute<TValue>(element: RefObject<JBSelectWebComponent>, props: JBSelectAttributes<TValue>) {
  useEffect(() => {
    if (props.message !== null && props.message !== undefined) {
      element.current?.setAttribute("message", props.message);
    } else {
      element.current?.removeAttribute("message");
    }
  }, [props.message]);

  useEffect(() => {
    if (element?.current) {
      element.current.validation.list = props.validationList || [];
    }
  }, [element.current, props.validationList]);

  useEffect(() => {
    if (props.label !== null && props.label !== undefined) {
      element.current?.setAttribute("label", props.label);
    } else {
      element.current?.removeAttribute("label");
    }
  }, [props.label, element.current]);

  useEffect(() => {
    if (props.required !== null && props.required !== undefined) {
      element.current?.setAttribute("required", "");
    } else {
      element.current?.removeAttribute("required");
    }
  }, [props.required]);

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
  useEffect(() => {
    if (props.error) {
      element?.current?.setAttribute('error', props.error);
    } else {
      element?.current?.removeAttribute('error');
    }
  }, [props.error]);

  useEffect(() => {
    if (props.name) {
      element?.current?.setAttribute('name', props.name || '');
    } else {
      element?.current?.removeAttribute('name');
    }
  }, [props.name]);
  useEffect(() => {
    if (element.current) {
      element.current.value = props.value;
    }
  }, [props.value]);
  useEffect(() => {
    if (typeof props.getSelectedValueDOM == "function" && element.current && element.current) {
      element.current.callbacks.getSelectedValueDOM = props.getSelectedValueDOM;
    }
  }, [props.getSelectedValueDOM]);
}