import { useEvent } from "jb-core/react";
import type { RefObject } from "react";
import type { JBSelectWebComponent, JBSelectEventType } from 'jb-select';

export type EventProps = {
  /**
   * when component loaded, in most cases component is already loaded before react mount so you dont need this but if you load web-component dynamically with lazy load it will be called after react mount
   */
  onLoad?: (e: JBSelectEventType<CustomEvent>) => void,
  /**
 * when all property set and ready to use, in most cases component is already loaded before react mount so you dont need this but if you load web-component dynamically with lazy load it will be called after react mount
 */
  onInit?: (e: JBSelectEventType<CustomEvent>) => void,
  onChange?: (e: JBSelectEventType<Event>) => void,
  onKeyUp?: (e: JBSelectEventType<KeyboardEvent>) => void,
  onInput?: (e: JBSelectEventType<InputEvent>) => void,
}
export function useEvents(element: RefObject<JBSelectWebComponent>, props: EventProps) {
  useEvent(element, 'load', props.onLoad, true);
  useEvent(element, 'init', props.onInit, true);
  useEvent(element, 'keyup', props.onKeyUp);
  useEvent(element, 'change', props.onChange);
  useEvent(element, 'input', props.onInput);
}