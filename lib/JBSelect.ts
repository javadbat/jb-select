import HTML from './JBSelect.html';
import CSS from './JBSelect.scss';
import { JBSelectCallbacks, JBSelectElements, JBSelectOptionElement } from './Types';
export class JBSelectWebComponent extends HTMLElement {
    #value: any;
    #textValue = "";
    // if user set value and current option list is not contain the option. 
    // we hold it in _notFindedValue and select value when option value get updated
    #notFindedValue: any = null;
    required = false;
    callbacks: JBSelectCallbacks = {
        getOptionTitle: (option) => { return option; },
        getOptionValue: (option) => { return option; },
        getOptionDOM: null,
        getSelectedValueDOM: null,
    };
    elements!: JBSelectElements;
    get value() {
        if (this.#value) {
            return this.callbacks.getOptionValue(this.#value);
        } else {
            return null;
        }
    }
    set value(value) {
        this.#setValueFromOutside(value);
    }
    get textValue() {
        return this.#textValue;

    }
    set textValue(value) {
        this.#textValue = value;
        this.elements.input.value = value;
        this.updateOptionList(value);
    }
    get selectedOptionTitle() {
        if (this.value) {
            return this.callbacks.getOptionTitle(this.#value);
        } else {
            return "";
        }
    }
    #optionList:any[] = [];
    #displayOptionList:any[] = [];
    get optionList() {
        return this.#optionList || [];
    }
    set optionList(value) {
        if (!Array.isArray(value)) {
            console.error('your provided option list to jb-select is not a array. you must provide array value', { value });
            return;
        }
        this.#optionList = value;
        //every time optionList get updated we set our value base on current option list we use _notFindedValue in case of value provided to component before optionList
        this.displayOptionList = this.filterOptionList(this.textValue);
        this._setValueOnOptionListChanged();
    }
    #placeholder = "";
    get placeholder() {
        return this.#placeholder;
    }
    set placeholder(value:string) {
        this.#placeholder = value;
        this.elements.input.placeholder = value;
    }
    get displayOptionList() {
        return this.#displayOptionList;
    }
    set displayOptionList(value:any[]){
        if(Array.isArray(value) && value.length == 0){
            this.elements.emptyListPlaceholder.classList.add('--show');
        }else if(Array.isArray(value)){
            this.elements.emptyListPlaceholder.classList.remove('--show');
        }
        this.#displayOptionList = value;
        this.updateOptionListDOM();
    }
    get isMobileDevice() { return /Mobi/i.test(window.navigator.userAgent); }


    constructor() {
        super();
        this.initWebComponent();
        this.initProp();

    }
    connectedCallback() {
        // standard web component event that called when all of dom is binded
        this.callOnLoadEvent();
        this.callOnInitEvent();
    }
    callOnInitEvent() {
        const event = new CustomEvent('init', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    callOnLoadEvent() {
        const event = new CustomEvent('load', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    initWebComponent() {
        const shadowRoot = this.attachShadow({
            mode: 'open'
        });
        const html = `<style>${CSS}</style>` + '\n' + HTML;
        const element = document.createElement('template');
        element.innerHTML = html;
        shadowRoot.appendChild(element.content.cloneNode(true));
        this.elements = {
            input: shadowRoot.querySelector('.select-box input')!,
            componentWrapper: shadowRoot.querySelector('.jb-select-web-component')!,
            selectedValueWrapper: shadowRoot.querySelector('.selected-value-wrapper')!,
            messageBox: shadowRoot.querySelector('.message-box')!,
            optionList: shadowRoot.querySelector('.select-list')!,
            optionListWrapper: shadowRoot.querySelector('.select-list-wrapper')!,
            arrowIcon: shadowRoot.querySelector('.arrow-icon')!,
            label:{
                wrapper: shadowRoot.querySelector('label')!,
                text: shadowRoot.querySelector('label .label-value')!,
            },
            emptyListPlaceholder: shadowRoot.querySelector('.empty-list-placeholder')!,
        };
        this.registerEventListener();

    }
    registerEventListener() {
        this.elements.input.addEventListener('change', (e)=>{this.onInputChange(e);});
        this.elements.input.addEventListener('keypress', this.onInputKeyPress.bind(this));
        this.elements.input.addEventListener('keyup', this.onInputKeyup.bind(this));
        this.elements.input.addEventListener('beforeinput', this.onInputBeforeInput.bind(this));
        this.elements.input.addEventListener('input', (e)=>{this.onInputInput(e as unknown as InputEvent);});
        this.elements.input.addEventListener('focus', this.onInputFocus.bind(this));
        this.elements.input.addEventListener('blur', this.onInputBlur.bind(this));
        this.elements.arrowIcon.addEventListener('click', this.onArrowKeyClick.bind(this));
    }
    initProp() {
        this.textValue = '';
        this.value = this.getAttribute('value') || null;
    }
    static get observedAttributes() {
        return ['label', 'message', 'value', 'required', 'placeholder'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        // do something when an attribute has changed
        this.onAttributeChange(name, newValue);
    }
    onAttributeChange(name, value) {
        switch (name) {
            case 'label':
                this.elements.label.text.innerHTML = value;
                if (value == null || value == undefined || value == "") {
                    this.elements.label.wrapper.classList.add('--hide');
                } else {
                    this.elements.label.wrapper.classList.remove('--hide');
                }
                break;
            case 'message':
                this.elements.messageBox.innerHTML = value;
                break;
            case 'value':
                this.#setValueFromOutside(value);
                break;
            case 'required':
                if (value === "" || value == "true" || value == true) {
                    this.required = true;
                } else {
                    this.required = false;
                }
                break;
            case 'placeholder':
                this.placeholder = value;
                break;
        }

    }
    _setValueOnOptionListChanged() {
        //when option list changed we see if current value is valid for new optionlist we set it if not we reset value to null.
        //in some scenario value is setted before otionList attached so we store it on this._notFindedValue and after option list setted we set value from this._notFindedValue
        if (this.value || this.#notFindedValue) {
            //if select has no prev value or pending not finded value we dont set it becuase user may input some search terms in input box and developer-user update list base on that value
            //if we set it to null the search term and this.textvalue will become null and empty too and it make impossible for user to search in dynamic back-end provided searchable list so we put this condition to prevent it
            this.#setValueFromOutside(this.value || this.#notFindedValue);
        }
    }
    #setValueFromOutside(value:any) {
        //when user set value by attribute or value prop directly we call this function
        const matchedOption = this.optionList.find((option) => { // if we have value mapper we set selected value by object that match mapper
            if (this.callbacks.getOptionValue(option) == value) {
                return option;
            }
        });
        if (matchedOption || value == null) {
            this._setValue(matchedOption);
        } else {
            this.#notFindedValue = value;
        }

    }
    _setValue(value:any) {
        this.#notFindedValue = null;
        this.#value = value;
        if ((value == null || value == undefined)) {
            this.textValue = '';
            this.setSelectedOptionDom(null);
            this.elements.componentWrapper.classList.remove('--has-value');
            this.elements.input.setAttribute('placeholder', this.placeholder);
        } else {
            this.textValue = '';
            this.setSelectedOptionDom(value);
            this.elements.componentWrapper.classList.add('--has-value');
            this.elements.input.setAttribute('placeholder', '');
        }
        //if user select an option we rest filter so user see all option again when open a select
        this.updateOptionList('');
    }
    onArrowKeyClick() {
        if (this.elements.optionListWrapper.classList.contains('--show')) {
            this.blur();
        } else {
            this.focus();
        }
    }
    onInputKeyPress() {
        //TODO: raise keypress event
    }
    onInputBeforeInput(e:InputEvent) {
        const inputedText = e.data || '';
        this.handleSelectedValueDisplay(inputedText);
    }
    onInputInput(e:InputEvent) {
        this.textValue = (e.target as HTMLInputElement).value;
    }
    onInputKeyup(e:KeyboardEvent) {
        const inputText = (e.target as HTMLInputElement).value;
        //here is the rare  time we update #value directly becuase we want trigger event that may read value directly from dom
        if (e.key === "Backspace" || e.key === "Delete") {
            //becuase on keyprees dont recieve backspace key press
            this.handleSelectedValueDisplay(inputText);
        }

        this.triggerOnInputKeyup(e);

    }
    handleSelectedValueDisplay(inputValue:string) {
        if (inputValue !== "") {
            this.elements.selectedValueWrapper.classList.add('--search-typed');
        } else {
            this.elements.selectedValueWrapper.classList.remove('--search-typed');
        }
    }
    triggerOnInputKeyup(e:KeyboardEvent) {
        const event = new KeyboardEvent('keyup', {
            altKey: e.altKey,
            bubbles: e.bubbles,
            cancelable: e.cancelable,
            code: e.code,
            ctrlKey: e.ctrlKey,
            detail: e.detail,
            key: e.key,
            shiftKey: e.shiftKey,
            charCode: e.charCode,
            location: e.location,
            composed: e.composed,
            isComposing: e.isComposing,
            metaKey: e.metaKey,
            repeat: e.repeat,
            keyCode: e.keyCode,
            view: e.view
        });
        this.dispatchEvent(event);
    }
    onInputChange(e: Event) {
        const inputText = (e.target as HTMLInputElement).value;
        //here is the rare  time we update _text_value directly becuase we want trigger event that may read value directly from dom
        this.#textValue = inputText;
    }
    onInputFocus() {
        this.focus();
    }
    onInputBlur(e: FocusEvent) {
        const focusedElement = e.relatedTarget;
        if (focusedElement === this.elements.optionListWrapper) {
            //user click on a menu item
        } else {
            this.blur();
        }
    }
    focus() {
        this.elements.input.focus();
        this.showOptionList();
        this.elements.componentWrapper.classList.add('--focused');

    }
    blur() {
        this.elements.componentWrapper.classList.remove('--focused');
        this.textValue = "";
        this.handleSelectedValueDisplay('');
        this.hideOptionList();
        this.triggerInputValidation();
    }
    showOptionList() {
        this.elements.optionListWrapper.classList.add('--show');
    }
    hideOptionList() {
        this.elements.optionListWrapper.classList.remove('--show');
    }
    updateOptionList(filterText:string) {
        this.displayOptionList = this.filterOptionList(filterText);
    }
    updateOptionListDOM() {
        const optionDomList: HTMLElement[] = [];
        this.displayOptionList.forEach((item) => {
            const optionDOM = this.createOptionDOM(item);
            optionDomList.push(optionDOM);
        });
        this.elements.optionList.innerHTML = '';
        optionDomList.forEach(optionElement => { this.elements.optionList.appendChild(optionElement); });


    }
    createOptionDOM(item:any):JBSelectOptionElement{
        let optionDOM: JBSelectOptionElement | null = null;
        if (typeof this.callbacks.getOptionDOM == 'function') {
            optionDOM = this.callbacks.getOptionDOM(item, this.onOptionClicked.bind(this));
        } else {
            optionDOM = this._createOptionDom(item);
        }
        optionDOM.value = item;
        return optionDOM;
    }

    _createOptionDom(item:any):JBSelectOptionElement{
        const optionElement = document.createElement('div');
        optionElement.classList.add('select-option');
        //it has defualt function who return wxact same input
        optionElement.innerHTML = this.callbacks.getOptionTitle(item);
        optionElement.addEventListener('click', this.onOptionClicked.bind(this));
        return optionElement;
    }
    onOptionClicked(e:MouseEvent) {
        const value = (e.currentTarget as JBSelectOptionElement).value;
        this.selectOption(value);
        this.blur();
        this._triggerOnChangeEvent();
    }
    selectOption(value:any) {
        this._setValue(value);
        this.triggerInputValidation();
    }
    filterOptionList(filterString:string):any[] {
        const displayOptionList: any[] = [];
        this.optionList.filter((option) => {
            const optionTitle = this.callbacks.getOptionTitle(option);
            const isString = typeof optionTitle == 'string';
            if (isString && optionTitle.includes(filterString)) {
                displayOptionList.push(option);
            }
            if (!isString) {
                console.warn("the provided values for optionsList is not of type string.", { option, title: optionTitle });
            }
        });
        return displayOptionList;
    }
    triggerInputValidation(showError = true) {
        // this method is public and used outside of component to check if field validity param are met
        let errorType = '';
        let requiredValid = true;
        if (this.required) {

            requiredValid = this.value != null;
            if (!requiredValid) {
                errorType = 'REQUIRED';
            }
        }
        const isAllValid = requiredValid; //& other validation if they added
        if (isAllValid) {
            this.clearValidationError();
        } else if (showError) {
            this.showValidationError(errorType);
        }
        return {
            isAllValid
        };
    }
    showValidationError(errorType) {
        if (errorType == 'REQUIRED') {
            const label = this.getAttribute('label');
            this.elements.messageBox.innerHTML = `${label} حتما باید انتخاب شود`;
            this.elements.messageBox.classList.add('--error');
        }
    }
    clearValidationError() {
        this.elements.messageBox.innerHTML = this.getAttribute('message') || '';
        this.elements.messageBox.classList.remove('--error');

    }
    _triggerOnChangeEvent() {
        const event = new Event("change");
        this.dispatchEvent(event);
    }
    setSelectedOptionDom(value:any) {
        //when user select option or value changed in any condition we set selected option DOM
        this.elements.selectedValueWrapper.innerHTML = '';
        //if value was null or undifined it remain empty
        if (value !== null && value !== undefined) {
            const selectedOptionDom = this.createSelectedValueDom(value);
            this.elements.selectedValueWrapper.appendChild(selectedOptionDom);
        }
    }
    private createSelectedValueDom(value:any) {
        if (typeof this.callbacks.getSelectedValueDOM == 'function') {
            return this.callbacks.getSelectedValueDOM(value);
        } else {
            return this.#createSelectedValueDom(value);
        }
    }
    #createSelectedValueDom(value:any) {
        const valueText = this.callbacks.getOptionTitle(value);
        const selectedOptionDom = document.createElement('div');
        selectedOptionDom.classList.add('selected-value');
        selectedOptionDom.innerHTML = valueText;
        return selectedOptionDom;
    }
}
const myElementNotExists = !customElements.get('jb-select');
if (myElementNotExists) {
    //prevent duplicate registering
    window.customElements.define('jb-select', JBSelectWebComponent);
}