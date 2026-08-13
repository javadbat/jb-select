import type { EventTypeWithTarget } from "jb-core";
import type { JBListboxWebComponent } from "./jb-listbox.js";

export type JBListboxValue<TValue> = TValue | TValue[] | null;

export type JBListboxElements = {
  componentWrapper: HTMLDivElement;
  label: HTMLSpanElement;
  list: HTMLDivElement;
  optionSlot: HTMLSlotElement;
  message: HTMLDivElement;
};

export type JBListboxEventType<TEvent, TValue = unknown> = EventTypeWithTarget<TEvent, JBListboxWebComponent<TValue>>;
