import { type JBOptionWebComponent } from "./jb-option/jb-option";

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