"use client";
import "jb-select/listbox/web-component";
import React, { type PropsWithChildren, useEffect, useImperativeHandle, useRef } from "react";
import type { JBElementStandardProps } from "jb-core/react";
import type { JBListboxEventType, JBListboxValue, JBListboxWebComponent } from "jb-select/listbox";
import type { ValidationItem } from "jb-validation";
import "./module-declaration.js";

type EventProps<TValue> = {
  onChange?: (event: JBListboxEventType<Event, TValue>) => void;
  onInit?: (event: JBListboxEventType<CustomEvent, TValue>) => void;
  onInput?: (event: JBListboxEventType<Event, TValue>) => void;
  onInvalid?: (event: JBListboxEventType<Event, TValue>) => void;
  onLoad?: (event: JBListboxEventType<CustomEvent, TValue>) => void;
};

type ListboxProps<TValue> = EventProps<TValue> & {
  disabled?: boolean;
  error?: string;
  initialValue?: JBListboxValue<TValue>;
  label?: string;
  message?: string;
  multiple?: boolean;
  name?: string;
  ref?: React.ForwardedRef<JBListboxWebComponent<TValue> | undefined>;
  required?: boolean;
  validationList?: ValidationItem<JBListboxValue<TValue>>[];
  value?: JBListboxValue<TValue>;
};

export type JBListboxProps<TValue> = PropsWithChildren<ListboxProps<TValue>> & JBElementStandardProps<JBListboxWebComponent<TValue>, keyof ListboxProps<TValue>>;

export function JBListbox<TValue>(props: JBListboxProps<TValue>) {
  const element = useRef<JBListboxWebComponent<TValue>>(null);
  const {
    children,
    disabled,
    error,
    initialValue,
    label,
    message,
    multiple,
    name,
    onChange,
    onInit,
    onInput,
    onInvalid,
    onLoad,
    ref,
    required,
    validationList,
    value,
    ...otherProps
  } = props;

  useImperativeHandle(ref, () => element.current ?? undefined, []);

  useEffect(() => {
    if (element.current) element.current.multiple = multiple ?? false;
  }, [multiple]);

  useEffect(() => {
    if (initialValue !== undefined && element.current) element.current.initialValue = initialValue;
  }, [initialValue]);

  useEffect(() => {
    if (value !== undefined && element.current) element.current.value = value;
  }, [value]);

  useEffect(() => {
    if (element.current) element.current.disabled = disabled ?? false;
  }, [disabled]);

  useEffect(() => {
    if (element.current) element.current.required = required ?? false;
  }, [required]);

  useEffect(() => {
    if (element.current) element.current.name = name || "";
  }, [name]);

  useEffect(() => {
    if (element.current?.validation) element.current.validation.list = validationList || [];
  }, [validationList]);

  useEffect(() => {
    const current = element.current;
    if (!current) return;
    const attributes = { error, label, message };
    for (const [key, attributeValue] of Object.entries(attributes)) {
      if (attributeValue !== undefined && attributeValue !== null) current.setAttribute(key, attributeValue);
      else current.removeAttribute(key);
    }
  }, [error, label, message]);

  useEffect(() => {
    const current = element.current;
    if (!current) return;
    const listeners: Array<[string, EventListener | undefined]> = [
      ["change", onChange as EventListener | undefined],
      ["init", onInit as EventListener | undefined],
      ["input", onInput as EventListener | undefined],
      ["invalid", onInvalid as EventListener | undefined],
      ["load", onLoad as EventListener | undefined],
    ];
    for (const [eventName, listener] of listeners) {
      if (listener) current.addEventListener(eventName, listener);
    }
    return () => {
      for (const [eventName, listener] of listeners) {
        if (listener) current.removeEventListener(eventName, listener);
      }
    };
  }, [onChange, onInit, onInput, onInvalid, onLoad]);

  return (
    <jb-listbox ref={element} {...otherProps}>
      {children}
    </jb-listbox>
  );
}

JBListbox.displayName = "JBListbox";
