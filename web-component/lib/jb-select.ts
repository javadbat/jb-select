import { defineWebComponent, JBBaseComponent, createInputEvent, createKeyboardEvent, isMobile, parseBooleanAttribute } from "jb-core";
import "jb-button";
import "jb-popover";
import CSS from "./jb-select.css";
import VariablesCSS from "./variables.css";
import type { JBSelectCallbacks,JBSelectElements,PopoverPosition,ValidationValue,} from "./types";
import { type ShowValidationErrorParameters, ValidationHelper, type ValidationItem, type ValidationResult, type WithValidation } from "jb-validation";
import type { JBFormInputStandards } from 'jb-form';
import type { JBOptionWebComponent } from "jb-select/option";
import { registerDefaultVariables } from 'jb-core/theme';
import { renderHTML } from "./render";
import { dictionary } from "./i18n";
import { i18n } from "jb-core/i18n";
import type { JBButtonWebComponent } from "jb-button";
import { JBPopoverWebComponent } from "jb-popover";
import type { JBOptionListWebComponent } from "jb-select/option-list";

//TODO: add IncludeInputInList or freeSolo so user can select item that he wrote without even it exist in select list
//TODO: handleHomeEndKeys to move focus inside the popup with the Home and End keys.
/**
 *  TValue is the type of value we extract from option
 */

// biome-ignore lint/suspicious/noExplicitAny: <we support any type of value and there is no limitation on value type>
export class JBSelectWebComponent<TValue = any> extends JBBaseComponent implements WithValidation<ValidationValue<TValue>>, JBFormInputStandards<TValue | null> {
  static get formAssociated() {
    return true;
  }
  // we keep selected option here by option but we return TValue when user demand
  #value: TValue | null = null;
  #textValue = "";
  // if user set value and current option list is not contain the option.
  // we hold it in #notFoundedValue and select value when option value get updated
  #notFoundedValue: TValue | null = null;
  #optionList = new Set<JBOptionWebComponent<TValue>>()
  //keep selected option dom
  #selectedOption: JBOptionWebComponent<TValue> | null = null;
  /**
   * selected option when multiple mode
   */
  #selectedOptions = new Set<JBOptionWebComponent<TValue>>([]);
  callbacks: JBSelectCallbacks<TValue> = {}
  elements!: JBSelectElements;
  #popoverPosition: PopoverPosition = "absolute"
  /**
   * how we set popover position
   */
  get popoverPosition() {
    return this.#popoverPosition
  }
  set popoverPosition(value: PopoverPosition | undefined) {
    if (value === undefined) return;
    this.#popoverPosition = value;
  }
  /**
  * this is a expensive option list please use it when you really need optionList with order
  */
  get optionListWithOrder(): JBOptionWebComponent<TValue>[] {
    const elements = this.elements.optionListSlot.assignedElements();
    const optionList = elements.flatMap(x => {
      // extract option list from JBOptionList to make option list flat by index
      if (x.localName === "jb-option-list") {
        return (x as JBOptionListWebComponent<unknown, TValue>).optionListDom;
      } else {
        return x
      }
    }).filter(x => (x.localName === "jb-option" && !(x as JBOptionWebComponent<TValue>).hidden));
    return optionList as JBOptionWebComponent<TValue>[];
  }
  get multiple() {
    return parseBooleanAttribute(this.getAttribute('multiple'))
  }
  set multiple(value: boolean) {
    if (value) {
      this.setAttribute('multiple', '');
    } else {
      this.removeAttribute('multiple')
    }
  }
  get value() {
    if (this.#value !== null && this.#value !== undefined) {
      return this.#value;
    } else {
      return null;
    }
  }
  set value(value: TValue | null) {
    this.#isDirty = true;
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
  get selectedOptionTitle(): string {
    if (this.value) {
      if (this.multiple) {
        return Array.from(this.#selectedOptions).reduce((acc, x) => acc.concat(", ", x.optionContentText), "")
      }
      return this.#selectedOption?.optionContentText ?? "";
    } else {
      return "";
    }
  }
  get form() {
    return this.#internals.form;
  }
  #placeholder = "";
  get placeholder() {
    return this.#placeholder;
  }
  set placeholder(value: string) {
    this.#placeholder = value;
    this.#internals.ariaPlaceholder = value;
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
    this.elements.arrowIcon.disabled = value;
    if (value) {
      this.#internals.states?.add("disabled");
      this.#internals.ariaDisabled = "true";
      this.#hideOptionList();
    } else {
      this.#internals.states?.delete("disabled");
      this.#internals.ariaDisabled = "false";
    }
  }
  #required = false;
  set required(value: boolean) {
    this.#required = value;
    this.#internals.ariaRequired = value ? "true" : "false";
    this.#validation.checkValiditySync({ showError: false });
  }
  get required() {
    return this.#required;
  }
  #internals!: ElementInternals;
  /**
 * @description will determine if component trigger jb-validation mechanism automatically on user event or it just let user-developer handle validation mechanism by himself
 */
  get isAutoValidationDisabled(): boolean {
    //currently we only support disable-validation in attribute and only in initiate time but later we can add support for change of this 
    return parseBooleanAttribute(this.getAttribute('disable-auto-validation'));
  }
  get name() {
    return this.getAttribute('name') || '';
  }
  set name(value: string) {
    if (value) {
      this.setAttribute('name', value);
    } else {
      this.removeAttribute('name');
    }
  }

  #initialValue: TValue | null = null;
  // Tracks whether the live value has been explicitly set. This is separate
  // from the public isDirty comparison against initialValue.
  #isDirty = false;

  get initialValue() {
    return this.#initialValue;
  }
  set initialValue(value: TValue | null) {
    // Multiple-select values are mutable arrays. Keep a dedicated baseline so
    // deselecting a live option cannot also mutate the form-reset value.
    this.#initialValue = this.#cloneArrayValue(value);
    if (!this.#isDirty) {
      this.#setValueFromOutside(this.#cloneArrayValue(this.#initialValue));
    }
  }
  formResetCallback() {
    this.#isDirty = false;
    // Reset receives a fresh array because the live selection is mutated when
    // an option is deselected.
    this.#setValueFromOutside(this.#cloneArrayValue(this.initialValue));
    this.#validation.reset();
    this.#internals?.setValidity({}, '');
  }
  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }
  get isDirty(): boolean {
    if (Array.isArray(this.#value) && Array.isArray(this.#initialValue)) {
      // Array identity is intentionally different; compare selected values.
      return this.#value.length !== this.#initialValue.length
        || this.#value.some((value) => value !== (this.#initialValue as any[]).includes(value));
    }
    return this.#value !== this.#initialValue;
  }
  #cloneArrayValue(value: TValue | null): TValue | null {
    return Array.isArray(value) ? [...value] as TValue : value;
  }
  constructor() {
    super();
    if (typeof this.attachInternals == "function") {
      //some browser dont support attachInternals
      this.#internals = this.attachInternals();
      this.#internals.role = "combobox"
    }
    this.#initWebComponent();
    this.#initProp();
  }
  connectedCallback() {
    // standard web component event that called when all of dom is bound
    this.#callOnLoadEvent();
    this.#callOnInitEvent();
    if (this.elements.optionListWrapper instanceof JBPopoverWebComponent) {
      this.#setupPopover();
    } else {
      customElements.whenDefined("jb-popover").then(() => this.#setupPopover())
    }
  }
  #setupPopover() {
    if (this.popoverPosition == "fixed") {
      this.elements.optionListWrapper.bindTarget(this.elements.selectBox);
    } else {
      this.elements.optionListWrapper.unBindTarget();
    }
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
      serializable: true
    });
    registerDefaultVariables();
    const html = `<style>${CSS} ${VariablesCSS}</style>\n${renderHTML()}`;
    const element = document.createElement("template");
    element.innerHTML = html;
    shadowRoot.appendChild(element.content.cloneNode(true));
    this.elements = {
      input: shadowRoot.querySelector(".search-input")!,
      componentWrapper: shadowRoot.querySelector(".jb-select-web-component")!,
      selectedValueWrapper: shadowRoot.querySelector(".selected-value-wrapper")!,
      messageBox: shadowRoot.querySelector(".message-box")!,
      optionList: shadowRoot.querySelector(".select-list")!,
      optionListWrapper: shadowRoot.querySelector(".select-list-wrapper")!,
      optionListSlot: shadowRoot.querySelector(".select-list-wrapper .select-list slot")!,
      arrowIcon: shadowRoot.querySelector(".arrow-icon")!,
      clearButton: shadowRoot.querySelector(".clear-button") as JBButtonWebComponent,
      label: shadowRoot.querySelector("label")!,
      emptyListPlaceholder: shadowRoot.querySelector(".empty-list-placeholder")!,
      mobileSearchInputWrapper: shadowRoot.querySelector(".mobile-search-input-wrapper")!,
      frontBox: shadowRoot.querySelector(".front-box")!,
      selectBox: shadowRoot.querySelector(".select-box")!
    };
    this.#registerEventListener();
    this.#updateListEmptyPlaceholder();
    this.#setupDeviceRelates();
  }
  /**
   * place code that change on select resize between mobile & desktop
   */
  #setupDeviceRelates() {
    const onResize = () => {
      if (isMobile()) {
        this.elements.mobileSearchInputWrapper.appendChild(this.elements.input)
      } else {
        this.elements.frontBox.appendChild(this.elements.input);
      }
    }
    addEventListener("resize", onResize);
    onResize();
  }
  #registerEventListener() {
    this.elements.input.addEventListener("change", (e: Event) => {
      this.#onInputChange(e);
    });
    this.elements.input.addEventListener("keypress", this.#onInputKeyPress.bind(this));
    this.elements.input.addEventListener("keyup", this.#onInputKeyup.bind(this));
    this.elements.input.addEventListener("beforeinput", this.#onInputBeforeInput.bind(this));
    this.elements.input.addEventListener("input", (e) => { this.#onInputInput(e as unknown as InputEvent); });
    this.addEventListener("focus", this.#onSelectFocus.bind(this), { passive: true });
    this.elements.input.addEventListener("focusout", this.#onInputBlur.bind(this), { passive: true });
    this.elements.arrowIcon.addEventListener("click", this.#onArrowKeyClick.bind(this), { passive: true });
    this.elements.clearButton.addEventListener("click", this.#onClearButtonClick.bind(this), { passive: false });
    //events to work with options
    this.addEventListener("select", this.#onOptionSelect.bind(this));
    this.addEventListener("deselect", this.#onOptionDeselect.bind(this));
    this.addEventListener("jb-option-connected", this.#onOptionConnected.bind(this), { passive: true });
    this.elements.optionListSlot.addEventListener("slotchange", this.#onOptionSlotChange.bind(this));

  }

  #initProp() {
    this.textValue = "";
    const valueAttribute = this.getAttribute("value");
    if (valueAttribute === null) {
      this.#setValueFromOutside(null);
    } else {
      this.value = valueAttribute as TValue;
    }
  }
  static get observedAttributes() {
    return [
      "label",
      "message",
      "hide-clear",
      "value",
      "required",
      "placeholder",
      "search-placeholder",
      "error",
    ];
  }
  attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
    // do something when an attribute has changed
    this.#onAttributeChange(name, newValue);
  }
  #onAttributeChange(name: string, value: string) {
    switch (name) {
      case "label":
        this.elements.label.innerHTML = value;
        this.#internals.ariaLabel = value;
        break;
      case "message":
        this.#internals.ariaDescription = value;
        this.elements.messageBox.innerHTML = value;
        break;
      case "value":
        this.value = value as TValue;
        break;
      case "required":
        this.required = parseBooleanAttribute(value);
        break;
      case "placeholder":
        this.placeholder = value;
        this.#internals.ariaPlaceholder = value;
        break;
      case "search-placeholder":
        this.searchPlaceholder = value;
        break;
      case "error":
        this.reportValidity();
        break;
      case 'hide-clear':
        if (parseBooleanAttribute(value)) {
          this.elements.clearButton.style.display = 'none'
        } else {
          this.elements.clearButton.style.display = 'block'
        }
        break;
    }
  }
  /**
   * will check option list and if select has no option it will show empty list placeholder
   */
  #updateListEmptyPlaceholder() {
    const isAnyOptionVisible = Array.from(this.#optionList).some(x => x.hidden == false);
    if (isAnyOptionVisible) {
      this.elements.emptyListPlaceholder.classList.remove("--show");
    } else {
      this.elements.emptyListPlaceholder.classList.add("--show");
    }
  }
  #onOptionSlotChange(_e: Event) {
    this.#setValueOnOptionListChanged();
    this.#updateListEmptyPlaceholder();
  }
  #setValueOnOptionListChanged() {
    //when option list changed we see if current value is valid for new optionlist we set it if not we reset value to null.
    //in some scenario value is set before optionList attached so we store it on this.#notFoundedValue and after option list set we set value from this.#notFoundedValue
    if (this.#notFoundedValue !== null) {
      //if select has no prev value or pending not found value we don't set it because user may input some search terms in input box and developer-user update list base on that value
      //if we set it to null the search term and this.textValue will become null and empty too and it make impossible for user to search in dynamic back-end provided searchable list so we put this condition to prevent it
      const isSet = this.#setValueFromOutside(this.#notFoundedValue);
      if (isSet) {
        //after list update and when not founded value is found in new option list we clear old not founded value
        this.#notFoundedValue = null;
      }
    } else if (this.value) {
      this.#setValueFromOutside(this.value);
    }
    if (this.multiple && Array.isArray(this.#value) && this.#selectedOptions.values.length < this.#value.length) {
      //in this particular edge case our value is already set but some option maybe missing in first place and added later
      const missing: JBOptionWebComponent<TValue>[] = [];
      this.#optionList.forEach((op) => {
        if (op.selected == false && (this.#value as unknown[]).includes(op.value)) {
          missing.push(op);
        }
      });
      if (missing.length > 0) {
        this.#setSelectedOption(missing);
      }
    }
  }
  //when user set value by attribute or value prop directly we call this function
  #setValueFromOutside(value: TValue | null | undefined): boolean {
    if (value === null || value === undefined) {
      this.#setValue(null, null);
      return true;
    }
    if (!this.multiple) {
      // single value mode
      let matchedOption: JBOptionWebComponent<TValue> | null = null;
      for (const option of this.#optionList) {
        // if we have value mapper we set selected value by object that match mapper
        if (option.value == value) {
          matchedOption = option;
        }
      }
      if (matchedOption !== null) {
        this.#setValue(matchedOption.value!, matchedOption);
        return true;
      } else {
        this.#notFoundedValue = value;
        return false;
      }
    } else {
      // in multiple values mode
      if (!Array.isArray(value)) {
        return false;
      }
      const selectedOptions: JBOptionWebComponent<TValue>[] = [];
      this.#optionList.forEach((op) => {
        if (value.includes(op.value)) {
          selectedOptions.push(op)
        } else {
          // because in multi select `setValue` only append select and do not deselect options if they are not in list (it used internally when new item selected) so we de-select here.
          op.selected = false;
          this.#selectedOptions.delete(op)
        }
      });
      if (selectedOptions.length == 0 && value.length > 0) {
        this.#notFoundedValue = value;
      } else {
        // Do not retain the caller's mutable array as the live selection.
        this.#setValue([...value] as TValue, selectedOptions);
      }
    }
    return false;
  }
  //null option mean deselect all
  #setSelectedOption(options: JBOptionWebComponent<TValue>[]): void
  #setSelectedOption(option: JBOptionWebComponent<TValue> | null): void
  #setSelectedOption(option: JBOptionWebComponent<TValue>[] | JBOptionWebComponent<TValue> | null): void {
    if (option) {
      if (this.multiple) {
        const selectOption = (op: JBOptionWebComponent<TValue>) => {
          op.selected = true;
          this.#selectedOptions.add(op);
        }
        Array.isArray(option) ? option.forEach(op => { selectOption(op) }) : selectOption(option)
      } else {
        // single select
        if (Array.isArray(option)) return;
        this.#deSelectAllOptions();
        option.selected = true;
        this.#selectedOption = option;
      }
    } else if (option === null) {
      // we only call with null when value set null and all option must deselect.
      this.#deSelectAllOptions();
    }
  }
  #deSelectAllOptions() {
    this.#optionList.forEach((x) => { x.selected = false });
  }
  #setValue(value: null, option: null): void
  #setValue(value: TValue, option: JBOptionWebComponent<TValue>): void
  #setValue(value: TValue, option: JBOptionWebComponent<TValue>[]): void
  #setValue(value: TValue | null, option: JBOptionWebComponent<TValue> | JBOptionWebComponent<TValue>[] | null): void {
    this.#notFoundedValue = null;
    this.#value = value;
    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
      // handle null value
      if (!this.multiple) {
        this.textValue = "";
      } else {
        // on multiple we clear old selected options
        this.#selectedOptions.clear()
      }
      this.#updateSelectedOptionDom();
      //will deselect all option
      this.#setSelectedOption(null);
      this.elements.componentWrapper.classList.remove("--has-value");
      //show placeholder when user empty data
      if (!(this.isMobileDevice && this.isOpen)) {
        this.elements.input.placeholder = this.placeholder;
      }
    } else {

      if (!this.multiple) { this.textValue = ""; }
      //for typescript error
      Array.isArray(option) ? this.#setSelectedOption(option) : this.#setSelectedOption(option);
      this.#updateSelectedOptionDom();
      this.elements.componentWrapper.classList.add("--has-value");
      //hide placeholder when user select data
      if (!(this.isMobileDevice && this.isOpen)) {
        this.elements.input.placeholder = "";
      }
    }
    //if user select an option we rest filter so user see all option again when open a select
    if (!this.multiple) {
      this.#updateOptionList("");
    }
  }
  #onArrowKeyClick() {
    if (this.isOpen) {
      this.blur();
    } else {
      this.focus();
    }
  }
  #onClearButtonClick(e: MouseEvent) {
    e.stopPropagation();
    e.preventDefault();
    this.#isDirty = true;
    this.#setValue(null, null);
    this.#checkValidity(true);
    this.#dispatchOnChangeEvent();
  }
  #onInputKeyPress(e: KeyboardEvent) {
    const event = createKeyboardEvent("keypress", e, {})
    this.dispatchEvent(event);
  }


  #onInputBeforeInput(_e: InputEvent) {
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
    const event = createInputEvent("input", e, {});
    this.dispatchEvent(event);
  }
  #onInputKeyup(e: KeyboardEvent) {
    const inputText = (e.target as HTMLInputElement).value;
    //here is the rare  time we update #value directly because we want trigger event that may read value directly from dom
    if (e.key === "Backspace" || e.key === "Delete") {
      //because on keypress dont receive backspace key press
      this.#handleSelectedValueDisplay(inputText);
    }
    switch (e.key) {
      case "ArrowUp":
        this.#activePrevOption();
        break;
      case "ArrowDown":
        this.#activeNextOption();
        break;
      case "Enter":
        this.#optionList.forEach(x => {
          if (x.active) { x.toggleOption(); }
        })
        break;
    }
    this.#triggerOnInputKeyup(e);
  }
  /**
* used when change activeItem with arrow keys 
*/
  #activePrevOption() {
    const optionList = this.optionListWithOrder;
    const activeOption = optionList.find((option, index) => {
      if (option.active) {
        const prevOption = optionList[index - 1];
        if (prevOption) {
          option.active = false;
          prevOption.active = true;
          prevOption.scrollIntoView({ block: "nearest" });
        }
        return true;
      }
      return false
    });
    const lastOption = optionList[optionList.length - 1];
    if (!activeOption && lastOption) {
      lastOption.active = true;
      lastOption.scrollIntoView({ block: "nearest" });
    }
  }
  /**
  * used when change activeItem with arrow keys 
  */
  #activeNextOption() {
    const optionList = this.optionListWithOrder;
    const activeOption = optionList.find((option, index) => {
      if (option.active) {
        const nextOption = optionList[index + 1];
        if (nextOption) {
          option.active = false;
          nextOption.active = true;
          nextOption.scrollIntoView({ block: "nearest" });
        }
        return true;
      }
      return false
    });
    const firstOption = optionList[0];
    if (!activeOption && firstOption) { firstOption.active = true; firstOption.scrollIntoView({ block: "nearest" }) }
  }
  #handleSelectedValueDisplay(inputValue: string) {
    if (inputValue !== "") {
      this.elements.selectedValueWrapper.classList.add("--search-typed");
    } else {
      this.elements.selectedValueWrapper.classList.remove("--search-typed");
    }
  }
  #triggerOnInputKeyup(e: KeyboardEvent) {

    const event = createKeyboardEvent('keyup', e, {})
    this.dispatchEvent(event);
  }
  #onInputChange(e: Event) {
    const inputText = (e.target as HTMLInputElement).value;
    //here is the rare  time we update _text_value directly because we want trigger event that may read value directly from dom
    this.#textValue = inputText;
  }
  #onSelectFocus(e: FocusEvent) {
    if (e.composedPath().find(x => x == this.elements.clearButton)) {
      // we don't want focus when user click on clear button 
      return;
    }
    this.focus();
  }
  #onInputBlur(e: FocusEvent) {
    const focusedElement = <Node>e.relatedTarget;
    if (this.elements.arrowIcon.contains(focusedElement)) {
      if (this.isOpen) {
        this.blur();
        return
      } else {
        return;
      }
    }
    if (
      this.elements.optionListWrapper.contains(focusedElement) ||
      //focused element is children of slots of us like option content
      this.contains(focusedElement)
    ) {
      focusedElement.addEventListener("blur", (e) => { this.#onInputBlur(e as FocusEvent) }, { once: true, passive: true })
    } else {
      this.blur();
    }
  }
  focus() {
    if (this.#disabled) {
      return;
    }
    this.elements.input.focus();
    this.#showOptionList();
    this.elements.optionListWrapper.open();
    if(this.#selectedOption && !this.multiple){
      this.#selectedOption.scrollIntoView({behavior:"instant",block:"nearest"})
    }else if(this.multiple && this.#selectedOptions.size>0){
      this.#selectedOptions.values()?.next()?.value?.scrollIntoView({behavior:"instant",block:"nearest"})
    }
    if (this.isMobileDevice) {
      this.elements.input.placeholder = this.#searchPlaceholder;
    }
  }
  blur() {
    // this.elements.componentWrapper.classList.remove("--focused");
    this.elements.optionListWrapper.close();
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
    this.#optionList.forEach(x => { x.active = false })
  }
  #showOptionList() {
    this.#internals.states.add("open")
    this.#internals.ariaExpanded = "true";
    this.elements.input.setAttribute("aria-expanded", "true");
    this.elements.arrowIcon.setAttribute("aria-expanded", "true");
    this.elements.optionListWrapper.classList.add("--show");
  }
  #hideOptionList() {
    this.#internals.states.delete("open")
    this.#internals.ariaExpanded = "false";
    this.elements.input.setAttribute("aria-expanded", "false");
    this.elements.arrowIcon.setAttribute("aria-expanded", "false");
    this.elements.optionListWrapper.classList.remove("--show");
  }
  #updateOptionList(filterText: string) {
    const event = new CustomEvent("filter-change", { detail: { filterText }, bubbles: false, cancelable: false, composed: false });
    this.dispatchEvent(event);
  }
  #onOptionSelect(e: Event) {
    const prevValue = this.#value;
    const prevOption = this.#selectedOption;
    const wasDirty = this.#isDirty;
    //because jb-option may be in another shadow dom like jb-option-list we have to get first composed element as a target
    const target = (e.composedPath()[0] as JBOptionWebComponent<TValue>);
    if (target.localName === "jb-option") {
      const value = target.value!;
      this.#selectOption(value, target);
      if (!this.multiple) {
        this.blur();
      }
      const dispatchedEvent = this.#dispatchOnChangeEvent();
      if (dispatchedEvent.defaultPrevented) {
        e.preventDefault();
        this.#selectOption(prevValue!, prevOption!);
        this.#isDirty = wasDirty;
      }
    }

  }
  #onOptionDeselect(e: Event) {
    const target = e.composedPath()[0] as JBOptionWebComponent<unknown>;
    this.#isDirty = true;
    //this only works on multi mode
    target.selected = false;
    this.#selectedOptions.delete(target as JBOptionWebComponent<TValue>)
    this.#updateSelectedOptionDom();
    if (Array.isArray(this.#value)) {
      const index = this.#value.indexOf(target.value);
      if (index !== -1) this.#value.splice(index, 1);
    } else if (this.value === target.value) {
      this.#value = null;
    }
    this.#value = this.#value
    this.#checkValidity(true);
  }
  //called when an jb-Option connected to the dom
  #onOptionConnected(e: CustomEvent) {
    e.stopPropagation();
    const target = (e.composedPath()[0] as JBOptionWebComponent<TValue>);
    target.addEventListener("jb-option-disconnected", this.#onOptionDisconnected.bind(this), { once: true, passive: true });
    target.setSelectElement(this);
    this.#optionList.add(target);
    if (this.#notFoundedValue !== null) {
      this.#setValueOnOptionListChanged();
    }
    this.#updateListEmptyPlaceholder();
    target.addEventListener("mouseenter", this.#onOptionHover)
  }
  #onOptionDisconnected(e: CustomEvent) {
    e.stopPropagation();
    const target = e.target as JBOptionWebComponent<TValue>;
    this.#optionList.delete(target);
    this.#updateListEmptyPlaceholder();
    if (target.value == this.#value) {
      this.#setValueOnOptionListChanged();
    }
    target.removeEventListener("mouseenter", this.#onOptionHover)
  }
  #onOptionHover = (e: MouseEvent) => {
    const target = e.target as JBOptionWebComponent<TValue>;
    if (!target.active) {
      this.#optionList.forEach(x => { x.active = false });
    }
    target.active = true;
  }
  #selectOption(value: TValue, optionDom: JBOptionWebComponent<TValue>) {
    this.#isDirty = true;
    if (this.multiple) {
      if (Array.isArray(this.#value)) {
        value = [...this.#value, value] as TValue
      } else if (this.#value !== null && this.#value !== undefined) {
        value = [this.#value, value] as TValue
      } else {
        value = [value] as TValue
      }
    }
    this.#setValue(value, optionDom);
    this.#checkValidity(true);
  }
  /**
   * @description show given string as a error in message place
   * @public
   */
  showValidationError(error: ShowValidationErrorParameters | string) {
    const message = typeof error == "string" ? error : error.message;
    this.elements.messageBox.innerHTML = message;
    //invalid state is used for ui purpose
    this.#internals.states?.add("invalid");
    this.#internals.ariaInvalid = "true"
  }
  clearValidationError() {
    this.elements.messageBox.innerHTML = this.getAttribute("message") || "";
    this.#internals.states?.delete("invalid");
    this.#internals.ariaInvalid = "false"
  }
  #dispatchOnChangeEvent() {
    const event = new Event("change", { bubbles: true, cancelable: true });
    this.dispatchEvent(event);
    return event;
  }
  #updateSelectedOptionDom() {
    //when user select option or value changed in any condition we set selected option DOM
    this.elements.selectedValueWrapper.innerHTML = "";
    //if value was null or undefined it remain empty
    if (this.#value !== null && this.#value !== undefined) {
      const selectedOptionDom = this.#createSelectedValueDom(this.#value);
      this.elements.selectedValueWrapper.appendChild(selectedOptionDom);
    }
  }
  #createSelectedValueDom(value: TValue) {
    if (typeof this.callbacks.getSelectedValueDOM == "function") {
      //TODO: make it work with multiple select too
      return this.callbacks.getSelectedValueDOM(value, this.#selectedOption);
    } else {
      return this.#createDefaultSelectedValueDom();
    }
  }
  #createDefaultSelectedValueDom() {
    let contentNodes: Node[] = [];
    if (this.multiple) {
      const wrapperDiv = document.createElement('div');
      wrapperDiv.style.display = "flex";
      const divider = document.createElement("div");
      divider.innerHTML = ",";
      divider.classList.add("multiple-divider");
      Array.from(this.#selectedOptions).forEach((x, i) => {
        wrapperDiv.append(...(i !== 0 ? [divider.cloneNode(true)] : []), ...x.optionContent)
      });
      contentNodes = [wrapperDiv];
    } else {
      // on single select mode
      if (this.#selectedOption) {
        contentNodes = this.#selectedOption.optionContent;
      }
    }

    const selectedOptionDom = document.createElement("div");
    selectedOptionDom.classList.add("selected-value");
    selectedOptionDom.part.add("selected-value")
    selectedOptionDom.append(...contentNodes);
    return selectedOptionDom;
  }
  #getInsideValidation() {
    const validationList: ValidationItem<ValidationValue<TValue>>[] = [];
    if (this.getAttribute("error") !== null && (this.getAttribute("error") ?? "").trim().length > 0) {
      validationList.push({
        validator: undefined,
        message: this.getAttribute("error")!,
        stateType: "customError"
      });
    }
    if (this.required) {
      const label = this.getAttribute("label") || "";
      const message = dictionary.get(i18n, "requireMessage")(label || null);
      validationList.push({
        validator: ({ value }) => {
          return value !== null && value !== undefined;
        },
        message: message,
        stateType: "valueMissing"
      });
    }
    return validationList;
  }
  //
  #checkValidity(showError: boolean) {
    if (!this.isAutoValidationDisabled) {
      if (this.#internals.states.has("invalid")) {
        // if we currently showing error to user it make sure error get updated (when failed validation changed of function return different string as an error) 
        showError = true;
      }
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
          if (message == '') { message = res.message ?? ""; }

        }
      });
      this.#internals?.setValidity(states, message);
    }
  }
  get validationMessage() {
    return this.#internals?.validationMessage || this.#validation.resultSummary?.message || null;
  }

}
defineWebComponent("jb-select", JBSelectWebComponent);
