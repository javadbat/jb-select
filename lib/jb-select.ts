import HTML from "./jb-select.html";
import CSS from "./jb-select.scss";
import {
  JBSelectCallbacks,
  JBSelectElements,
  JBSelectOptionElement,
  ValidationValue,
} from "./types";
import {ValidationHelper} from "jb-validation";
import { ValidationItem, ValidationResult, WithValidation } from "jb-validation/types";
import { isMobile } from "../../../common/scripts/device-detection";
import {JBFormInputStandards} from 'jb-form/types';
//TOption is the type of option, TValue is the type of value we extract from option
export class JBSelectWebComponent<TOption = any, TValue = TOption> extends HTMLElement implements WithValidation<ValidationValue<TOption,TValue>>, JBFormInputStandards<TValue> {
  static get formAssociated() {
    return true;
  }
  // we keep selected option here by option but we return TValue when user demand
  #value: TOption;
  #textValue = "";
  // if user set value and current option list is not contain the option.
  // we hold it in _notFoundedValue and select value when option value get updated
  #notFoundedValue: TValue = null;
  callbacks: JBSelectCallbacks<TOption,TValue> = {
    getOptionTitle: (option) => {
      if(typeof option == "string" || typeof option == "number"){
        return option.toString();
      }else{
        console.error("title must be string please provide a valid getOptionTitle","provided title:",option);
        return "NOT SUPPORTED TITLE TYPE";
      }
    },
    getOptionValue: null,
    getOptionDOM: null,
    getSelectedValueDOM: null,
  };
  elements!: JBSelectElements;
  get value():TValue{
    if (this.#value) {
      return this.#getOptionValue(this.#value);
    } else {
      return null;
    }
  }
  set value(value:TValue) {
    this.#setValueFromOutside(value);
  }
  get textValue() {
    return this.#textValue;
  }
  set textValue(value) {
    this.#textValue = value;
    this.elements.input.value = value;
    this.#updateOptionList(value);
  }
  get selectedOptionTitle() {
    if (this.value) {
      return this.#getOptionTitle(this.#value);
    } else {
      return "";
    }
  }
  #optionList: TOption[] = [];
  #displayOptionList: TOption[] = [];
  get optionList() {
    return this.#optionList || [];
  }
  set optionList(value) {
    if (!Array.isArray(value)) {
      console.error(
        "your provided option list to jb-select is not a array. you must provide array value",
        { value }
      );
      return;
    }
    this.#optionList = value;
    //every time optionList get updated we set our value base on current option list we use _notFoundedValue in case of value provided to component before optionList
    this.displayOptionList = this.#filterOptionList(this.textValue);
    this.#setValueOnOptionListChanged();
  }
  #placeholder = "";
  get placeholder() {
    return this.#placeholder;
  }
  set placeholder(value: string) {
    this.#placeholder = value;
    if (this.value !== null && this.value !== undefined) {
      this.elements.input.placeholder = "";
    } else {
      this.elements.input.placeholder = value;
    }
  }
  //on mobile device when search modal open this will appear on search box
  #searchPlaceholder = "search";
  get searchPlaceholder() {
    return this.#searchPlaceholder;
  }
  set searchPlaceholder(value) {
    this.#searchPlaceholder = value;
  }
  get displayOptionList() {
    return this.#displayOptionList;
  }
  set displayOptionList(value: TOption[]) {
    if (Array.isArray(value) && value.length == 0) {
      this.elements.emptyListPlaceholder.classList.add("--show");
    } else if (Array.isArray(value)) {
      this.elements.emptyListPlaceholder.classList.remove("--show");
    }
    this.#displayOptionList = value;
    this.#updateOptionListDOM();
  }
  get isMobileDevice() {
    return isMobile();
  }
  get isOpen() {
    return this.elements.componentWrapper.classList.contains("--focused");
  }
  // this value used by validation module to send to validation callbacks
  get #ValidationValue():ValidationValue<TOption,TValue>{
    return {
      inputtedText:this.#textValue,
      selectedOption:this.#value,
      value:this.value
    };
  }
  #validation = new ValidationHelper<ValidationValue<TOption,TValue>>(this.showValidationError.bind(this),this.clearValidationError.bind(this),()=>this.#ValidationValue,()=>this.textValue,this.#getInsideValidation.bind(this),this.#setValidationResult.bind(this));
  get validation(){
    return this.#validation;
  }
  #disabled = false;
  get disabled(){
    return this.#disabled;
  }
  set disabled(value:boolean){
    this.#disabled = value;
    this.elements.input.disabled = value;
    if(value){
      //TODO: remove as any when typescript support
      (this.#internals as any).states?.add("disabled");
    }else{
      (this.#internals as any).states?.delete("disabled");
    }
  }
  #required = false;
  set required(value:boolean){
    this.#required = value;
    this.#validation.checkValidity(false);
  }
  get required() {
    return this.#required;
  }
  #internals?: ElementInternals;
  /**
 * @description will determine if component trigger jb-validation mechanism automatically on user event or it just let user-developer handle validation mechanism by himself
 */
  get isAutoValidationDisabled(): boolean {
    //currently we only support disable-validation in attribute and only in initiate time but later we can add support for change of this 
    return this.getAttribute('disable-auto-validation') === '' || this.getAttribute('disable-auto-validation') === 'true' ? true : false;
  }
  get name(){
    return this.getAttribute('name') || '';
  }
  initialValue: TValue | null = null;
  get isDirty(): boolean{
    return this.value !== this.initialValue;
  }
  constructor() {
    super();
    if (typeof this.attachInternals == "function") {
      //some browser dont support attachInternals
      this.#internals = this.attachInternals();
    }
    this.#initWebComponent();
    this.#initProp();
  }
  connectedCallback() {
    // standard web component event that called when all of dom is binded
    this.#callOnLoadEvent();
    this.#callOnInitEvent();
  }
  #callOnInitEvent() {
    const event = new CustomEvent("init", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  #callOnLoadEvent() {
    const event = new CustomEvent("load", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  #initWebComponent() {
    const shadowRoot = this.attachShadow({
      mode: "open",
      delegatesFocus:true,
    });
    const html = `<style>${CSS}</style>` + "\n" + HTML;
    const element = document.createElement("template");
    element.innerHTML = html;
    shadowRoot.appendChild(element.content.cloneNode(true));
    this.elements = {
      input: shadowRoot.querySelector(".select-box input")!,
      componentWrapper: shadowRoot.querySelector(".jb-select-web-component")!,
      selectedValueWrapper: shadowRoot.querySelector(
        ".selected-value-wrapper"
      )!,
      messageBox: shadowRoot.querySelector(".message-box")!,
      optionList: shadowRoot.querySelector(".select-list")!,
      optionListWrapper: shadowRoot.querySelector(".select-list-wrapper")!,
      arrowIcon: shadowRoot.querySelector(".arrow-icon")!,
      label: {
        wrapper: shadowRoot.querySelector("label")!,
        text: shadowRoot.querySelector("label .label-value")!,
      },
      emptyListPlaceholder: shadowRoot.querySelector(
        ".empty-list-placeholder"
      )!,
    };
    this.#registerEventListener();
  }
  #registerEventListener() {
    this.elements.input.addEventListener("change", (e:Event) => {
      this.#onInputChange(e);
    });
    this.elements.input.addEventListener(
      "keypress",
      this.#onInputKeyPress.bind(this)
    );
    this.elements.input.addEventListener("keyup", this.#onInputKeyup.bind(this));
    this.elements.input.addEventListener(
      "beforeinput",
      this.#onInputBeforeInput.bind(this)
    );
    this.elements.input.addEventListener("input", (e) => {
      this.#onInputInput(e as unknown as InputEvent);
    });
    this.elements.input.addEventListener("focus", this.#onInputFocus.bind(this));
    this.elements.input.addEventListener("blur", this.#onInputBlur.bind(this));
    this.elements.arrowIcon.addEventListener(
      "click",
      this.#onArrowKeyClick.bind(this)
    );
  }
  #initProp() {
    this.textValue = "";
    this.value = this.getAttribute("value") as TValue || null ;
  }
  static get observedAttributes() {
    return [
      "label",
      "message",
      "value",
      "required",
      "placeholder",
      "search-placeholder",
    ];
  }
  attributeChangedCallback(name:string, oldValue:string, newValue:string) {
    // do something when an attribute has changed
    this.#onAttributeChange(name, newValue);
  }
  #onAttributeChange(name: string, value: string) {
    switch (name) {
      case "label":
        this.elements.label.text.innerHTML = value;
        if (value == null || value == undefined || value == "") {
          this.elements.label.wrapper.classList.add("--hide");
        } else {
          this.elements.label.wrapper.classList.remove("--hide");
        }
        break;
      case "message":
        this.elements.messageBox.innerHTML = value;
        break;
      case "value":
        this.#setValueFromOutside(value as TValue);
        break;
      case "required":
        if (value === "" || value == "true" || value == "True") {
          this.required = true;
        } else {
          this.required = false;
        }
        break;
      case "placeholder":
        this.placeholder = value;
        break;
      case "search-placeholder":
        this.searchPlaceholder = value;
        break;
    }
  }
  #setValueOnOptionListChanged() {
    //when option list changed we see if current value is valid for new optionlist we set it if not we reset value to null.
    //in some scenario value is setted before optionList attached so we store it on this.#notFoundedValue and after option list setted we set value from this.#notFoundedValue
    if (this.#notFoundedValue) {
      //if select has no prev value or pending not found value we don't set it because user may input some search terms in input box and developer-user update list base on that value
      //if we set it to null the search term and this.textValue will become null and empty too and it make impossible for user to search in dynamic back-end provided searchable list so we put this condition to prevent it
      const isSetted = this.#setValueFromOutside(this.#notFoundedValue);
      if (isSetted) {
        //after list update and when not founded value is found in new option list we clear old not founded value
        this.#notFoundedValue = null;
      }
    } else if (this.value) {
      this.#setValueFromOutside(this.value);
    }
  }
  #setValueFromOutside(value: TValue): boolean {
    //when user set value by attribute or value prop directly we call this function
    const matchedOption = this.optionList.find((option) => {
      // if we have value mapper we set selected value by object that match mapper
      if (this.#getOptionValue(option) == value) {
        return option;
      }
    });
    if (matchedOption || value === null || value === undefined) {
      this.#setValue(matchedOption);
      return true;
    } else {
      this.#notFoundedValue = value;
      return false;
    }
  }
  #setValue(value: TOption) {
    this.#notFoundedValue = null;
    this.#value = value;
    if (value === null || value === undefined) {
      this.textValue = "";
      this.#setSelectedOptionDom(null);
      this.elements.componentWrapper.classList.remove("--has-value");
      //show placeholder when user empty data
      if (!(this.isMobileDevice && this.isOpen)) {
        this.elements.input.placeholder = this.placeholder;
      }
    } else {
      this.textValue = "";
      this.#setSelectedOptionDom(value);
      this.elements.componentWrapper.classList.add("--has-value");
      //hide placeholder when user select data
      if (!(this.isMobileDevice && this.isOpen)) {
        this.elements.input.placeholder = "";
      }
    }
    //if user select an option we rest filter so user see all option again when open a select
    this.#updateOptionList("");
  }
  #onArrowKeyClick() {
    if (this.isOpen) {
      this.blur();
    } else {
      this.focus();
    }
  }
  #onInputKeyPress(e:KeyboardEvent) {
    const eventOptions:KeyboardEventInit = {
      altKey:e.altKey,
      bubbles:e.bubbles,
      cancelable:e.cancelable,
      code:e.code,
      composed:e.composed,
      ctrlKey:e.ctrlKey,
      detail:e.detail,
      isComposing:e.isComposing,
      key:e.key,
      location:e.location,
      metaKey:e.metaKey,
      view:e.view,
      repeat:e.repeat,
      shiftKey:e.shiftKey 
    };
    const event = new KeyboardEvent("keypress",eventOptions);
    this.dispatchEvent(event);
  }
  #onInputBeforeInput(e: InputEvent) {
    // const inputtedText = e.data || "";
    //TODO: add cancelable event dispatch here
  }
  #onInputInput(e: InputEvent) {
    const inputtedText = (e.target as HTMLInputElement).value;
    this.textValue = inputtedText;
    this.#handleSelectedValueDisplay(inputtedText);
    this.#validation.checkValidity(false);
    this.#dispatchInputEvent(e);
  }
  #dispatchInputEvent(e: InputEvent) {
    const event = new InputEvent("input", {
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      composed: e.composed,
      data: e.data,
      dataTransfer: e.dataTransfer,
      detail: e.detail,
      inputType: e.inputType,
      isComposing: e.isComposing,
      targetRanges: e.getTargetRanges(),
      view: e.view,
    });
    this.dispatchEvent(event);
  }
  #onInputKeyup(e: KeyboardEvent) {
    const inputText = (e.target as HTMLInputElement).value;
    //here is the rare  time we update #value directly because we want trigger event that may read value directly from dom
    if (e.key === "Backspace" || e.key === "Delete") {
      //because on keypress dont receive backspace key press
      this.#handleSelectedValueDisplay(inputText);
    }

    this.#triggerOnInputKeyup(e);
  }
  #handleSelectedValueDisplay(inputValue: string) {
    if (inputValue !== "") {
      this.elements.selectedValueWrapper.classList.add("--search-typed");
    } else {
      this.elements.selectedValueWrapper.classList.remove("--search-typed");
    }
  }
  #triggerOnInputKeyup(e: KeyboardEvent) {
    const event = new KeyboardEvent("keyup", {
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
      view: e.view,
    });
    this.dispatchEvent(event);
  }
  #onInputChange(e: Event) {
    const inputText = (e.target as HTMLInputElement).value;
    //here is the rare  time we update _text_value directly because we want trigger event that may read value directly from dom
    this.#textValue = inputText;
  }
  #onInputFocus() {
    this.focus();
  }
  #onInputBlur(e: FocusEvent) {
    const focusedElement = <Node>e.relatedTarget;
    if (
      this.elements.optionListWrapper.contains(focusedElement) ||
      this.elements.arrowIcon.contains(focusedElement)
    ) {
      //user click on a menu item
    } else {
      this.blur();
    }
  }
  focus() {
    this.elements.input.focus();
    this.#showOptionList();
    this.elements.componentWrapper.classList.add("--focused");
    if (this.isMobileDevice) {
      this.elements.input.placeholder = this.#searchPlaceholder;
    }
  }
  blur() {
    this.elements.componentWrapper.classList.remove("--focused");
    this.textValue = "";
    this.#handleSelectedValueDisplay("");
    this.#hideOptionList();
    this.#validation.checkValidity(true);
    if (this.isMobileDevice) {
      if (this.value) {
        this.elements.input.placeholder = "";
      } else {
        this.elements.input.placeholder = this.placeholder;
      }
    }
    this.elements.input.blur();
  }
  #showOptionList() {
    this.elements.optionListWrapper.classList.add("--show");
  }
  #hideOptionList() {
    this.elements.optionListWrapper.classList.remove("--show");
  }
  #updateOptionList(filterText: string) {
    this.displayOptionList = this.#filterOptionList(filterText);
  }
  #updateOptionListDOM() {
    const optionDomList: HTMLElement[] = [];
    this.displayOptionList.forEach((item) => {
      const optionDOM = this.#createOptionDOM(item);
      optionDomList.push(optionDOM);
    });
    this.elements.optionList.innerHTML = "";
    optionDomList.forEach((optionElement) => {
      this.elements.optionList.appendChild(optionElement);
    });
  }
  #createOptionDOM(item: TOption): JBSelectOptionElement<TOption> {
    let optionDOM: JBSelectOptionElement<TOption> | null = null;
    const isSelected =
      this.#getOptionValue(this.#value) == this.#getOptionValue(item);
    if (typeof this.callbacks.getOptionDOM == "function") {
      optionDOM = this.callbacks.getOptionDOM(
        item,
        this.#onOptionClicked.bind(this),
        isSelected
      );
    } else {
      optionDOM = this.#createDefaultOptionDom(item, isSelected);
    }
    optionDOM.value = item;
    return optionDOM;
  }

  #createDefaultOptionDom(item: TOption, isSelected: boolean): JBSelectOptionElement<TOption> {
    const optionElement = document.createElement("div");
    optionElement.classList.add("select-option");
    if (isSelected) {
      optionElement.classList.add("--selected-option");
    }
    //it has default function who return exact same input
    optionElement.innerHTML = this.#getOptionTitle(item);
    optionElement.addEventListener("click", this.#onOptionClicked.bind(this));
    return optionElement;
  }
  #onOptionClicked(e: MouseEvent) {
    const value = (e.currentTarget as JBSelectOptionElement<TOption>).value;
    this.#selectOption(value);
    this.blur();
    this.#triggerOnChangeEvent();
  }
  #selectOption(value: TOption) {
    this.#setValue(value);
    this.#checkValidity(true);
  }
  #filterOptionList(filterString: string): TOption[] {
    const displayOptionList: TOption[] = [];
    this.optionList.filter((option) => {
      const optionTitle = this.#getOptionTitle(option);
      const isString = typeof optionTitle == "string";
      if (isString && optionTitle.includes(filterString)) {
        displayOptionList.push(option);
      }
      if (!isString) {
        console.warn(
          "the provided values for optionsList is not of type string.",
          { option, title: optionTitle }
        );
      }
    });
    return displayOptionList;
  }
  /**
   * @description show given string as a error in message place
   * @public
   */
  showValidationError(message:string) {
    // if (errorType == "REQUIRED") {
    //   const label = this.getAttribute("label") || "";
    //   this.elements.messageBox.innerHTML = `${label} حتما باید انتخاب شود`;
    // }
    this.elements.messageBox.innerHTML = message;
    this.elements.messageBox.classList.add("--error");
  }
  clearValidationError() {
    this.elements.messageBox.innerHTML = this.getAttribute("message") || "";
    this.elements.messageBox.classList.remove("--error");
  }
  #triggerOnChangeEvent() {
    const event = new Event("change");
    this.dispatchEvent(event);
  }
  #setSelectedOptionDom(value: TOption) {
    //when user select option or value changed in any condition we set selected option DOM
    this.elements.selectedValueWrapper.innerHTML = "";
    //if value was null or undefined it remain empty
    if (value !== null && value !== undefined) {
      const selectedOptionDom = this.#createSelectedValueDom(value);
      this.elements.selectedValueWrapper.appendChild(selectedOptionDom);
    }
  }
  #createSelectedValueDom(value: TOption) {
    if (typeof this.callbacks.getSelectedValueDOM == "function") {
      return this.callbacks.getSelectedValueDOM(value);
    } else {
      return this.#createDefaultSelectedValueDom(value);
    }
  }
  #createDefaultSelectedValueDom(value: TOption) {
    const valueText = this.#getOptionTitle(value);
    const selectedOptionDom = document.createElement("div");
    selectedOptionDom.classList.add("selected-value");
    selectedOptionDom.innerHTML = valueText;
    return selectedOptionDom;
  }
  #getOptionValue(option: TOption):TValue{
    if (this.callbacks.getOptionValue && typeof this.callbacks.getOptionValue !== "function") {
      console.error("getOptionValue callback is not a function");
    }
    try {
      if(typeof this.callbacks.getOptionValue == "function"){
        return this.callbacks.getOptionValue(option);
      }else{
        return option as unknown as TValue;
      }
    } catch (e) {
      console.error(
        `Invalid getOptionValue callback Result, must be a function that returns the value of an option`,
        option
      );
    }
  }
  #getOptionTitle(option: TOption): string {
    if (typeof this.callbacks.getOptionTitle !== "function") {
      console.error("getOptionTitle callback is not a function");
    }
    try {
      return this.callbacks.getOptionTitle(option);
    } catch (e) {
      console.error(
        `Invalid getOptionTitle callback Result, must be a function that returns the value of an option`,
        option
      );
    }
    return "";
  }
  #getInsideValidation(){
    const ValidationList:ValidationItem<ValidationValue<TOption,TValue>>[] = [];
    if(this.required){
      const label = this.getAttribute("label") || "";
      const message = `${label} حتما باید انتخاب شود`;
      ValidationList.push({
        validator:({selectedOption})=>{
          return selectedOption !== null && selectedOption !== undefined;
        },
        message:message,
        stateType:"valueMissing"
      });
    }
    return ValidationList;
  }
  //
  #checkValidity(showError: boolean) {
    if (!this.isAutoValidationDisabled) {
      return this.#validation.checkValidity(showError);
    }
  }
  /**
 * @public
 * @description this method used to check for validity but doesn't show error to user and just return the result
 * this method used by #internal of component
 */
  checkValidity(): boolean {
    const validationResult = this.#validation.checkValidity(false);
    if (!validationResult.isAllValid) {
      const event = new CustomEvent('invalid');
      this.dispatchEvent(event);
    }
    return validationResult.isAllValid;
  }
  /**
  * @public
 * @description this method used to check for validity and show error to user
 */
  reportValidity(): boolean {
    const validationResult = this.#validation.checkValidity(true);
    if (!validationResult.isAllValid) {
      const event = new CustomEvent('invalid');
      this.dispatchEvent(event);
    }
    return validationResult.isAllValid;
  }
  /**
   * @description this method called on every checkValidity calls and update validation result of #internal
   */
  #setValidationResult(result: ValidationResult<ValidationValue<TOption,TValue>>) {
    if (result.isAllValid) {
      this.#internals?.setValidity({}, '');
    } else {
      const states: ValidityStateFlags = {};
      let message = "";
      result.validationList.forEach((res) => {
        if (!res.isValid) {
          if (res.validation.stateType) {
            states[res.validation.stateType] = true;
          }else{
            states["customError"] = true;
          }
          if (message == '') { message = res.message; }

        }
      });
      this.#internals?.setValidity(states, message);
    }
  }
  get validationMessage(){
    return this.#internals?.validationMessage || this.#validation.resultSummary.message;
  }
}
const myElementNotExists = !customElements.get("jb-select");
if (myElementNotExists) {
  //prevent duplicate registering
  window.customElements.define("jb-select", JBSelectWebComponent);
}
