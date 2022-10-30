export type JBSelectCallbacks = {
    getOptionTitle: (option:any) => string;
    getOptionValue: (option:any) => any;
    getOptionDOM: null | ((option:any, onSelectCallback:(e:MouseEvent)=>void, isSelected:boolean) => HTMLOptionElement);
    getSelectedValueDOM: null | ((option:any) => HTMLElement);
}
export type JBSelectOptionElement = HTMLElement & {value?: any};
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