import HTML from "./jb-select.html";
import CSS from "./jb-select.scss";
import {
  JBSelectCallbacks,
  JBSelectElements,
  ValidationValue,
} from "./types";
import { ShowValidationErrorInput, ValidationHelper, type ValidationItem, type ValidationResult, type WithValidation } from "jb-validation";
import { isMobile } from "jb-core";
import { JBFormInputStandards } from 'jb-form';
// eslint-disable-next-line no-duplicate-imports
import { JBOptionWebComponent } from "./jb-option/jb-option";

//TODO: add IncludeInputInList or freeSolo so user can select item that he wrote without even it exist in select list
//TODO: handleHomeEndKeys to move focus inside the popup with the Home and End keys.
/**
 *  TValue is the type of value we extract from option
 */
export class JBSelectWebComponent<TValue = any> extends HTMLElement implements WithValidation<ValidationValue<TValue>>, JBFormInputStandards<TValue> {
  static get formAssociated() {
    return true;
  }
  // we keep selected option here by option but we return TValue when user demand
  #value: TValue;
  #textValue = "";
  // if user set value and current option list is not contain the option.
  // we hold it in _notFoundedValue and select value when option value get updated
  #notFoundedValue: TValue = null;
  #optionList = new Set<JBOptionWebComponent<TValue>>()
  //keep selected option dom
  #selectedOption: JBOptionWebComponent<TValue> | null = null;
  callbacks: JBSelectCallbacks<TValue> = {}
  elements!: JBSelectElements;
  get value(): TValue {
    if (this.#value) {
      return this.#value;
    } else {
      return null;
    }
  }
  set value(value: TValue) {
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
      return this.#selectedOption.optionContentText;
    } else {
      return "";
    }
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
  get isMobileDevice() {
    return isMobile();
  }
  get isOpen() {
    return this.elements.componentWrapper.classList.contains("--focused");
  }
  // this value used by validation module to send to validation callbacks
  get #ValidationValue(): ValidationValue<TValue> {
    return {
      inputtedText: this.#textValue,
      selectedOption: this.#selectedOption,
      value: this.value
    };
  }
  #validation = new ValidationHelper<ValidationValue<TValue>>({
    clearValidationError: this.clearValidationError.bind(this),
    showValidationError: this.showValidationError.bind(this),
    getValue: () => this.#ValidationValue,
    getValidations: this.#getInsideValidation.bind(this),
    getValueString: () => this.#textValue,
    setValidationResult: this.#setValidationResult.bind(this)
  });
  get validation() {
    return this.#validation;
  }
  #disabled = false;
  get disabled() {
    return this.#disabled;
  }
  set disabled(value: boolean) {
    this.#disabled = value;
    this.elements.input.disabled = value;
    if (value) {
      (this.#internals as any).states?.add("disabled");
    } else {
      (this.#internals as any).states?.delete("disabled");
    }
  }
  #required = false;
  set required(value: boolean) {
    this.#required = value;
    this.#validation.checkValiditySync({ showError: false });
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
  get name() {
    return this.getAttribute('name') || '';
  }
  initialValue: TValue | null = null;
  get isDirty(): boolean {
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
      delegatesFocus: true,
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
      optionListSlot: shadowRoot.querySelector(".select-list-wrapper .select-list slot")!,
      arrowIcon: shadowRoot.querySelector(".arrow-icon")!,
      label: {
        wrapper: shadowRoot.querySelector("label")!,
        text: shadowRoot.querySelector("label .label-value")!,
      },
      emptyListPlaceholder: shadowRoot.querySelector(".empty-list-placeholder")!,
    };
    this.#registerEventListener();
    this.#updateListEmptyPlaceholder();
  }
  #registerEventListener() {
    this.elements.input.addEventListener("change", (e: Event) => {
      this.#onInputChange(e);
    });
    this.elements.input.addEventListener("keypress", this.#onInputKeyPress.bind(this));
    this.elements.input.addEventListener("keyup", this.#onInputKeyup.bind(this));
    this.elements.input.addEventListener("beforeinput", this.#onInputBeforeInput.bind(this));
    this.elements.input.addEventListener("input", (e) => { this.#onInputInput(e as unknown as InputEvent); });
    this.elements.input.addEventListener("focus", this.#onInputFocus.bind(this));
    this.elements.input.addEventListener("blur", this.#onInputBlur.bind(this));
    this.elements.arrowIcon.addEventListener("click", this.#onArrowKeyClick.bind(this));
    //events to work with options
    this.addEventListener("select", this.#onOptionSelect.bind(this));
    this.addEventListener("jb-option-connected", this.#onOptionConnected.bind(this));
    this.elements.optionListSlot.addEventListener("slotchange",this.#onOptionSlotChange.bind(this));

  }

  #initProp() {
    this.textValue = "";
    this.value = this.getAttribute("value") as TValue || null;
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
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
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
  /**
   * will check option list and if select has no option it will show empty list placeholder
   */
  #updateListEmptyPlaceholder(){
    const isAnyOptionVisible = Array.from(this.#optionList).some(x=>x.hidden==false);
    if(isAnyOptionVisible){
      this.elements.emptyListPlaceholder.classList.remove("--show");
    }else{
      this.elements.emptyListPlaceholder.classList.add("--show");
    }
  }
  #onOptionSlotChange(e:Event){
    this.#setValueOnOptionListChanged();
    this.#updateListEmptyPlaceholder();
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
  //when user set value by attribute or value prop directly we call this function
  #setValueFromOutside(value: TValue): boolean {
    if(value === null || value === undefined){
      this.#setValue(null,null);
      return true;
    }
    let matchedOption:JBOptionWebComponent<TValue>| null = null; 
    this.#optionList.forEach((option) => {
      // if we have value mapper we set selected value by object that match mapper
      if (option.value == value) {
        matchedOption = option;
      }
    });
    if (matchedOption) {
      this.#setValue(matchedOption.value,matchedOption);
      return true;
    } else {
      this.#notFoundedValue = value;
      return false;
    }
  }
  //null option mean deselect all
  #changeSelectedOption(option:JBOptionWebComponent<TValue>|null){
    this.#optionList.forEach((x)=>x.selected = false);
    if(option){
      option.selected = true;
      this.#selectedOption = option;
    }
  }
  #setValue(value: TValue,option:JBOptionWebComponent<TValue>|null) {
    this.#notFoundedValue = null;
    this.#value = value;
    if (value === null || value === undefined) {
      this.textValue = "";
      this.#setSelectedOptionDom(null);
      //will deselect all option
      this.#changeSelectedOption(null);
      this.elements.componentWrapper.classList.remove("--has-value");
      //show placeholder when user empty data
      if (!(this.isMobileDevice && this.isOpen)) {
        this.elements.input.placeholder = this.placeholder;
      }
    } else {
      this.textValue = "";
      this.#changeSelectedOption(option);
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
  #onInputKeyPress(e: KeyboardEvent) {
    const eventOptions: KeyboardEventInit = {
      altKey: e.altKey,
      bubbles: e.bubbles,
      cancelable: e.cancelable,
      code: e.code,
      composed: e.composed,
      ctrlKey: e.ctrlKey,
      detail: e.detail,
      isComposing: e.isComposing,
      key: e.key,
      location: e.location,
      metaKey: e.metaKey,
      view: e.view,
      repeat: e.repeat,
      shiftKey: e.shiftKey
    };
    const event = new KeyboardEvent("keypress", eventOptions);
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
    this.#validation.checkValidity({ showError: false });
    this.#dispatchInputEvent(e);
    this.#updateListEmptyPlaceholder();
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
    this.#validation.checkValidity({ showError: true });
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
    const event = new CustomEvent("filter-change", { detail: { filterText }, bubbles: false, cancelable: false, composed: false });
    this.dispatchEvent(event);
  }
  #onOptionSelect(e: CustomEvent) {
    const prevValue = this.#value;
    const prevOption = this.#selectedOption;
    //because jb-option may be in another shadow dom like jb-option-list we have to get first composed element as a target
    const target = (e.composedPath()[0] as JBOptionWebComponent<TValue>);
    if (target instanceof JBOptionWebComponent) {
      const value = target.value;
      this.#selectOption(value,target);
      this.blur();
      const dispatchedEvent = this.#dispatchOnChangeEvent();
      if (dispatchedEvent.defaultPrevented) {
        e.preventDefault();
        this.#selectOption(prevValue,prevOption);
      }
    }

  }
  //called when an jb-Option connected to the dom
  #onOptionConnected(e: CustomEvent) {
    e.stopPropagation();
    const target = (e.composedPath()[0] as JBOptionWebComponent<TValue>);
    target.addEventListener("jb-option-disconnected",this.#onOptionDisconnected.bind(this),{once:true,passive:true});
    target.setSelectElement(this);
    this.#optionList.add(target);
    if(this.#notFoundedValue){
      this.#setValueOnOptionListChanged();
    }
    this.#updateListEmptyPlaceholder();
  }
  #onOptionDisconnected(e:CustomEvent){
    e.stopPropagation();
    const target = e.target as JBOptionWebComponent<TValue>;
    this.#optionList.delete(target);
    this.#updateListEmptyPlaceholder();
    if(target.value == this.#value){
      this.#setValueOnOptionListChanged();
    }
  }

  #selectOption(value: TValue, optionDom:JBOptionWebComponent<TValue>) {
    this.#setValue(value,optionDom);
    this.#checkValidity(true);
  }
  /**
   * @description show given string as a error in message place
   * @public
   */
  showValidationError(error: ShowValidationErrorInput | string) {
    const message = typeof error == "string" ? error : error.message;
    this.elements.messageBox.innerHTML = message;
    this.elements.messageBox.classList.add("--error");
  }
  clearValidationError() {
    this.elements.messageBox.innerHTML = this.getAttribute("message") || "";
    this.elements.messageBox.classList.remove("--error");
  }
  #dispatchOnChangeEvent() {
    const event = new Event("change", { bubbles: true, cancelable: true });
    this.dispatchEvent(event);
    return event;
  }
  #setSelectedOptionDom(value: TValue) {
    //when user select option or value changed in any condition we set selected option DOM
    this.elements.selectedValueWrapper.innerHTML = "";
    //if value was null or undefined it remain empty
    if (value !== null && value !== undefined) {
      const selectedOptionDom = this.#createSelectedValueDom(value);
      this.elements.selectedValueWrapper.appendChild(selectedOptionDom);
    }
  }
  #createSelectedValueDom(value: TValue) {
    if (typeof this.callbacks.getSelectedValueDOM == "function") {
      return this.callbacks.getSelectedValueDOM(value,this.#selectedOption);
    } else {
      return this.#createDefaultSelectedValueDom();
    }
  }
  #createDefaultSelectedValueDom() {
    //TODO: put some backup way for when we have value but no option provided
    let contentNodes:Node[] = [];
    if(this.#selectedOption){
      contentNodes = this.#selectedOption.optionContent;
    }
    const selectedOptionDom = document.createElement("div");
    selectedOptionDom.classList.add("selected-value");
    selectedOptionDom.append(...contentNodes.map(n=>n.cloneNode()));
    return selectedOptionDom;
  }
  #getInsideValidation() {
    const ValidationList: ValidationItem<ValidationValue<TValue>>[] = [];
    if (this.required) {
      const label = this.getAttribute("label") || "";
      const message = `${label} حتما باید انتخاب شود`;
      ValidationList.push({
        validator: ({ value }) => {
          return value !== null && value !== undefined;
        },
        message: message,
        stateType: "valueMissing"
      });
    }
    return ValidationList;
  }
  //
  #checkValidity(showError: boolean) {
    if (!this.isAutoValidationDisabled) {
      return this.#validation.checkValidity({ showError });
    }
  }
  /**
 * @public
 * @description this method used to check for validity but doesn't show error to user and just return the result
 * this method used by #internal of component
 */
  checkValidity(): boolean {
    const validationResult = this.#validation.checkValiditySync({ showError: false });
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
    const validationResult = this.#validation.checkValiditySync({ showError: true });
    if (!validationResult.isAllValid) {
      const event = new CustomEvent('invalid');
      this.dispatchEvent(event);
    }
    return validationResult.isAllValid;
  }
  /**
   * @description this method called on every checkValidity calls and update validation result of #internal
   */
  #setValidationResult(result: ValidationResult<ValidationValue<TValue>>) {
    if (result.isAllValid) {
      this.#internals?.setValidity({}, '');
    } else {
      const states: ValidityStateFlags = {};
      let message = "";
      result.validationList.forEach((res) => {
        if (!res.isValid) {
          if (res.validation.stateType) {
            states[res.validation.stateType] = true;
          } else {
            states["customError"] = true;
          }
          if (message == '') { message = res.message; }

        }
      });
      this.#internals?.setValidity(states, message);
    }
  }
  get validationMessage() {
    return this.#internals?.validationMessage || this.#validation.resultSummary.message;
  }

}
const myElementNotExists = !customElements.get("jb-select");
if (myElementNotExists) {
  //prevent duplicate registering
  window.customElements.define("jb-select", JBSelectWebComponent);
}
