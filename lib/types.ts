export type JBSelectCallbacks<TOption,TValue> = {
    getOptionTitle: (option:TOption) => string;
    getOptionValue?: (option:TOption) => TValue;
    getOptionDOM: null | ((option:TOption, onSelectCallback:(e:MouseEvent)=>void, isSelected:boolean) => HTMLElement);
    getSelectedValueDOM: null | ((option:TOption) => HTMLElement);
}
//TODO: create real custom element for select options
export type JBSelectOptionElement<TOption> = HTMLElement & {value?: TOption};
export type JBSelectElements = {
    input: HTMLInputElement,
    componentWrapper: HTMLDivElement,
    selectedValueWrapper: HTMLDivElement,
    messageBox:HTMLDivElement,
    optionList: HTMLDivElement,
    optionListWrapper: HTMLDivElement,
    arrowIcon: HTMLDivElement,
    label:{
        wrapper: HTMLLabelElement,
        text: HTMLSpanElement
    },
    emptyListPlaceholder: HTMLDivElement,
}
export type ValidationValue<TOption,TValue> = {
    selectedOption:TOption | null,
    value:TValue | null,
    inputtedText:string
}