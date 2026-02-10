import type { JBOptionWebComponent } from "./jb-option/jb-option";
import type {EventTypeWithTarget} from "jb-core";
import type{ JBSelectWebComponent } from "./jb-select";
import type {JBButtonWebComponent} from "jb-button";
import type { JBPopoverWebComponent } from "jb-popover";
export type JBSelectCallbacks<TValue> = {
    getSelectedValueDOM?:(value:TValue,content:HTMLElement) => HTMLElement;
}

export type JBSelectElements = {
    input: HTMLInputElement,
    componentWrapper: HTMLDivElement,
    selectedValueWrapper: HTMLDivElement,
    messageBox:HTMLDivElement,
    optionList: HTMLDivElement,
    optionListWrapper: JBPopoverWebComponent,
    optionListSlot:HTMLSlotElement,
    arrowIcon: HTMLDivElement,
    clearButton: JBButtonWebComponent,
    label:{
        wrapper: HTMLLabelElement,
        text: HTMLSpanElement
    },
    emptyListPlaceholder: HTMLDivElement,
    mobileSearchInputWrapper:HTMLDivElement,
    frontBox:HTMLDivElement
}
export type ValidationValue<TValue> = {
    selectedOption:JBOptionWebComponent<TValue> | null,
    value:TValue | null,
    inputtedText:string
}

export type JBSelectEventType<TEvent> = EventTypeWithTarget<TEvent,JBSelectWebComponent>
