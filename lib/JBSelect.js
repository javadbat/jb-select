import HTML from './JBSelect.html';
import CSS from './JBSelect.scss';
class JBSelectWebComponent extends HTMLElement {
    get value() {
        if(this._value){
            return this.callbacks.getOptionValue(this._value);
        }else{
            return null;
        }
    }
    set value(value) {
        this._setValueFromOutside(value);
    }
    get textValue() {
        return this._textValue;
    }
    set textValue(value) {
        this._textValue = value;
        this._inputElement.value = value;
    }
    get optionList() {
        return this._optionList || [];
    }
    set optionList(value) {
        //TODO: add validation and check if its array
        this._optionList = value;
        //every time optionList get updated we set our value base on current option list we use _notFindedValue in case of value provided to component before optionList
        this._displayOptionList = this.filterOptionList(this.textValue);
        this._setValueFromOutside(this.value || this._notFindedValue);
        this.updateOptionListDOM();
    }
    get displayOptionList() {
        return this._displayOptionList;
    }
    get isMobileDevice (){ return /Mobi/i.test(window.navigator.userAgent);}


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
        var event = new CustomEvent('init', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    callOnLoadEvent() {
        var event = new CustomEvent('load', { bubbles: true, composed: true });
        this.dispatchEvent(event);
    }
    initWebComponent() {
        this._shadowRoot = this.attachShadow({
            mode: 'open'
        });
        const html = `<style>${CSS}</style>` + '\n' + HTML;
        const element = document.createElement('template');
        element.innerHTML = html;
        this._shadowRoot.appendChild(element.content.cloneNode(true));
        this._webComponentWrapper = this._shadowRoot.querySelector('.jb-select-web-component');
        this._inputElement = this._shadowRoot.querySelector('.select-box input');
        this._optionListElement = this._shadowRoot.querySelector('.select-list');
        this._optionListElementWrapper = this._shadowRoot.querySelector('.select-list-wrapper');
        this.registerEventListener();
       
    }
    registerEventListener() {
        this._inputElement.addEventListener('change', this.onInputChange.bind(this));
        this._inputElement.addEventListener('keypress', this.onInputKeyPress.bind(this));
        this._inputElement.addEventListener('keyup', this.onInputKeyup.bind(this));
        this._inputElement.addEventListener('focus', this.onInputFocus.bind(this));
        this._inputElement.addEventListener('blur', this.onInputBlur.bind(this));
        this.shadowRoot.querySelector('.arrow-icon').addEventListener('click', this.onArrowKeyClick.bind(this));
    }
    initProp() {
        this.textValue = '';
        this.callbacks = {
            getOptionTitle: (option) => { return option; },
            getOptionValue: (option) => { return option; }
        };
        this.value = this.getAttribute('value') || null;
        // if user set value and current option list is not contain the option. 
        // we hold it in _notFindedValue and select value when option value get updated
        this._notFindedValue = null;
        this.required = false;
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
                this._shadowRoot.querySelector('label .label-value').innerHTML = value;
                if(value == null || value == undefined || value == ""){
                    this._shadowRoot.querySelector('label').classList.add('--hide');
                }else{
                    this._shadowRoot.querySelector('label').classList.remove('--hide');
                }
                break;
            case 'message':
                this._shadowRoot.querySelector('.message-box').innerHTML = value;
                break;
            case 'value':
                this._setValueFromOutside(value);
                break;
            case 'required':
                if (value === "" || value == "true" || value == true) {
                    this.required = true;
                } else {
                    this.required = false;
                }
                break;
            case 'placeholder':
                this._inputElement.placeholder = value;
                break;
        }

    }
    _setValueFromOutside(value) {
        //when user set value by attribute or value prop directly we call this function
        const matchedOption = this.optionList.find((option) => { // if we have value mapper we set selected value by object that match mapper
            if (this.callbacks.getOptionValue(option) == value) {
                return option;
            }
        });
        if (matchedOption || value == null) {
            this._setValue(matchedOption);
        } else {
            this._notFindedValue = value;
        }

    }
    _setValue(value) {
        this._notFindedValue = null;
        this._value = value;
        if (value == null || value == undefined) {
            this.textValue = '';
            this._shadowRoot.querySelector('.jb-select-web-component').classList.remove('--has-value');
        } else {
            this.textValue = this.callbacks.getOptionTitle(value);
            this._shadowRoot.querySelector('.jb-select-web-component').classList.add('--has-value');
        }
        //if user select an option we rest filter so user see all option again when open a select
        this.updateOptionList('');
    }
    onArrowKeyClick(){
        if(this._optionListElementWrapper.classList.contains('--show')){
            this.blur();
        }else{
            this.focus();
        }
    }
    onInputKeyPress() {
        //TODO: raise keypress event
        //hint: keypres dont called on backspace key
        this.onUserTypeResetValue();
    }
    onInputKeyup(e) {
        const inputText = e.target.value;
        //here is the rare  time we update _value directly becuase we want trigger event that may read value directly from dom
        if (e.key === "Backspace") {
            //becuase on keyprees dont recieve backspace key press
            //we use keypress and dont do it all here becuase we dont want arrow key or any other function key to reset value 
            this.onUserTypeResetValue();
        }
        this._textValue = inputText;
        this.updateOptionList(inputText);
    }
    onUserTypeResetValue() {
        //when use type but dont select we want to reset value becuase typed value is not a valid value
        //TODO: check if typed value is the same as current selected value title dont null it
        this._value = null;
        this._shadowRoot.querySelector('.jb-select-web-component').classList.remove('--has-value');
    }
    onInputChange(e) {
        const inputText = e.target.value;
        //here is the rare  time we update _text_value directly becuase we want trigger event that may read value directly from dom
        this._textValue = inputText;
    }
    onInputFocus() {
        this.focus();
    }
    onInputBlur(e) {
        let focusedElement = e.relatedTarget;
        if (focusedElement === this._optionListElement) {
            //user click on a menu item
            setTimeout(this.blur.bind(this), 300);
        } else {
            this.blur();
        }
    }
    focus(){
        this._inputElement.focus();
        this.showOptionList();
        this._webComponentWrapper.classList.add('--focused');
        
    }
    blur(){
        this._webComponentWrapper.classList.remove('--focused');
        this.hideOptionList();
        this.triggerInputValidation();
    }
    showOptionList(){
        this._optionListElementWrapper.classList.add('--show');
    }
    hideOptionList() {
        this._optionListElementWrapper.classList.remove('--show');
    }
    updateOptionList(filterText) {
        this._displayOptionList = this.filterOptionList(filterText);
        this.updateOptionListDOM();
    }
    updateOptionListDOM() {
        const optionDomList = [];
        this.displayOptionList.forEach((item) => {
            const optionDOM = this.createOptionDOM(item);
            optionDomList.push(optionDOM);
        });
        this._optionListElement.innerHTML = '';
        optionDomList.forEach(optionElement => { this._optionListElement.appendChild(optionElement);});


    }
    createOptionDOM(item){
        const optionElement = document.createElement('div');
        optionElement.classList.add('select-option');
        //it has defualt function who return wxact same input
        optionElement.innerHTML = this.callbacks.getOptionTitle(item);
        optionElement.value = item;
        optionElement.addEventListener('click', this.onOptionClicked.bind(this));
        return optionElement;
    }
    onOptionClicked(e) {
        const value = e.target.value;
        this.selectOption(value);
        this._triggerOnChangeEvent();
    }
    selectOption(value) {
        this._setValue(value);
        this.triggerInputValidation();
    }
    filterOptionList(filterString) {
        const displayOptionList = [];
        this.optionList.filter((option) => {
            if (typeof this.callbacks.getOptionTitle(option) == 'string' && this.callbacks.getOptionTitle(option).includes(filterString)) {
                displayOptionList.push(option);
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
        let isAllValid = requiredValid; //& other validation if they added
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
            this._shadowRoot.querySelector('.message-box').innerHTML = `${label} حتما باید انتخاب شود`;
            this._shadowRoot.querySelector('.message-box').classList.add('--error');
        }
    }
    clearValidationError() {
        this._shadowRoot.querySelector('.message-box').innerHTML = this.getAttribute('message') || '';
        this._shadowRoot.querySelector('.message-box').classList.remove('--error');

    }
    _triggerOnChangeEvent() {
        const event = new Event("change");
        this.dispatchEvent(event);
    }
}
const myElementNotExists = !customElements.get('jb-select');
if(myElementNotExists){
    //prevent duplicate registering
    window.customElements.define('jb-select', JBSelectWebComponent);
}
