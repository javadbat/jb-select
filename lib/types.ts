import type { JBOptionWebComponent } from "./jb-option/jb-option";
import type {EventTypeWithTarget} from "jb-core";
import type{ JBSelectWebComponent } from "./jb-select";
export type JBSelectCallbacks<TValue> = {
    getSelectedValueDOM?:(value:TValue,content:HTMLElement) => HTMLElement;
}

export type JBSelectElements = {
    input: HTMLInputElement,
    componentWrapper: HTMLDivElement,
    selectedValueWrapper: HTMLDivElement,
    messageBox:HTMLDivElement,
    optionList: HTMLDivElement,
    optionListWrapper: HTMLDivElement,
    optionListSlot:HTMLSlotElement,
    arrowIcon: HTMLDivElement,
    label:{
        wrapper: HTMLLabelElement,
        text: HTMLSpanElement
    },
    emptyListPlaceholder: HTMLDivElement,
}
export type ValidationValue<TValue> = {
    selectedOption:JBOptionWebComponent<TValue> | null,
    value:TValue | null,
    inputtedText:string
}

export type JBSelectEventType<TEvent> = EventTypeWithTarget<TEvent,JBSelectWebComponent>
