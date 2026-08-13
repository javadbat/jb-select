import "jb-select/option";
import { parseBooleanAttribute } from "jb-core";
import { i18n } from "jb-core/i18n";
import { registerDefaultVariables } from "jb-core/theme";
import type { JBFormInputStandards, JBFormWebComponent } from "jb-form";
import type { JBOptionWebComponent } from "jb-select/option";
import { type ShowValidationErrorParameters, ValidationHelper, type ValidationItem, type ValidationResult, type WithValidation } from "jb-validation";
import CSS from "./jb-listbox.css";
import { dictionary } from "./i18n.js";
import { renderHTML } from "./render.js";
import type { JBListboxElements, JBListboxValue } from "./types.js";
import VariablesCSS from "./variables.css";

export class JBListboxWebComponent<TValue = unknown> extends HTMLElement implements WithValidation<JBListboxValue<TValue>>, JBFormInputStandards<JBListboxValue<TValue>> {
  static get formAssociated() {
    return true;
  }

  elements!: JBListboxElements;
  #internals?: ElementInternals;
  #options = new Set<JBOptionWebComponent<TValue>>();
  #selectedOption: JBOptionWebComponent<TValue> | null = null;
  #selectedOptions = new Set<JBOptionWebComponent<TValue>>();
  #value: JBListboxValue<TValue> = null;
  #initialValue: JBListboxValue<TValue> = null;
  #hasLiveValue = false;
  #disabled = false;
  #required = false;
  #multiple = false;
  #connected = false;

  #validation = new ValidationHelper<JBListboxValue<TValue>>({
    clearValidationError: this.clearValidationError.bind(this),
    getValidations: this.#getValidationList.bind(this),
    getValue: () => this.value,
    getValueString: value => this.#valueToString(value),
    setValidationResult: this.#setValidationResult.bind(this),
    showValidationError: this.showValidationError.bind(this),
  });

  get validation() {
    return this.#validation;
  }

  get value(): JBListboxValue<TValue> {
    return Array.isArray(this.#value) ? [...this.#value] : this.#value;
  }

  set value(value: JBListboxValue<TValue>) {
    this.#hasLiveValue = true;
    this.#setValue(value);
  }

  get initialValue(): JBListboxValue<TValue> {
    return Array.isArray(this.#initialValue) ? [...this.#initialValue] : this.#initialValue;
  }

  set initialValue(value: JBListboxValue<TValue>) {
    this.#initialValue = this.#cloneValue(this.#normalizeValue(value));
    if (!this.#hasLiveValue) {
      this.#setValue(this.#cloneValue(this.#initialValue));
    }
  }

  get isDirty(): boolean {
    return !this.#valuesEqual(this.#value, this.#initialValue);
  }

  get multiple() {
    return this.#multiple;
  }

  set multiple(value: boolean) {
    const nextValue = Boolean(value);
    if (this.#multiple === nextValue) return;
    this.#multiple = nextValue;
    if (this.#internals) this.#internals.ariaMultiSelectable = nextValue ? "true" : "false";
    this.#initialValue = this.#cloneValue(this.#normalizeValue(this.#initialValue));
    const normalizedValue = nextValue
      ? this.#value === null
        ? []
        : Array.isArray(this.#value)
          ? this.#value
          : [this.#value]
      : Array.isArray(this.#value)
        ? (this.#value[0] ?? null)
        : this.#value;
    this.#setValue(normalizedValue);
  }

  get disabled() {
    return this.#disabled;
  }

  set disabled(value: boolean) {
    this.#disabled = Boolean(value);
    if (this.#disabled) {
      this.#internals?.states?.add("disabled");
      if (this.#internals) this.#internals.ariaDisabled = "true";
      this.setAttribute("inert", "");
    } else {
      this.#internals?.states?.delete("disabled");
      if (this.#internals) this.#internals.ariaDisabled = "false";
      this.removeAttribute("inert");
    }
    this.#syncFocusableState();
  }

  get required() {
    return this.#required;
  }

  set required(value: boolean) {
    this.#required = Boolean(value);
    if (this.#internals) this.#internals.ariaRequired = this.#required ? "true" : "false";
    this.#validation.checkValiditySync({ showError: false });
  }

  get name() {
    return this.getAttribute("name") || "";
  }

  set name(value: string) {
    if (value) this.setAttribute("name", value);
    else this.removeAttribute("name");
  }

  get form(): HTMLFormElement | JBFormWebComponent | null {
    return this.#internals?.form ?? null;
  }

  get isAutoValidationDisabled() {
    return parseBooleanAttribute(this.getAttribute("disable-auto-validation"));
  }

  get validationMessage() {
    return this.#internals?.validationMessage || this.#validation.resultSummary?.message || null;
  }

  get validity() {
    return this.#internals?.validity;
  }

  get willValidate() {
    return this.#internals?.willValidate ?? false;
  }

  constructor() {
    super();
    if (typeof this.attachInternals === "function") {
      this.#internals = this.attachInternals();
      this.#internals.role = "listbox";
    }
    this.#initWebComponent();
    this.#registerEventListeners();
  }

  connectedCallback() {
    this.#syncFocusableState();
    this.#refreshDirectOptions();
    if (!this.#connected) {
      this.#connected = true;
      this.dispatchEvent(new CustomEvent("load"));
      queueMicrotask(() => this.dispatchEvent(new CustomEvent("init")));
    }
  }

  static get observedAttributes() {
    return ["disabled", "error", "label", "message", "multiple", "name", "required", "value"];
  }

  attributeChangedCallback(name: string, _oldValue: string | null, newValue: string | null) {
    switch (name) {
      case "disabled":
        this.disabled = parseBooleanAttribute(newValue);
        break;
      case "error":
        this.reportValidity();
        break;
      case "label":
        this.elements.label.textContent = newValue || "";
        if (this.#internals) this.#internals.ariaLabel = newValue || "";
        break;
      case "message":
        if (!this.#internals?.states?.has("invalid")) this.elements.message.textContent = newValue || "";
        if (this.#internals) this.#internals.ariaDescription = newValue || "";
        break;
      case "multiple":
        this.multiple = parseBooleanAttribute(newValue);
        break;
      case "name":
        this.#syncFormValue();
        break;
      case "required":
        this.required = parseBooleanAttribute(newValue);
        break;
      case "value":
        if (!this.#connected && !this.#hasLiveValue) {
          this.initialValue = newValue === null ? (this.multiple ? [] : null) : (newValue as TValue);
        } else if (newValue !== null) {
          this.value = newValue as TValue;
        } else if (this.#hasLiveValue) {
          this.value = this.multiple ? [] : null;
        }
        break;
    }
  }

  formResetCallback() {
    this.#hasLiveValue = false;
    this.#setValue(this.#cloneValue(this.#initialValue));
    this.#validation.reset();
    this.#internals?.setValidity({});
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled;
  }

  formStateRestoreCallback(state: string | File | FormData | null, _mode: "autocomplete" | "restore") {
    if (typeof state !== "string") return;
    try {
      const restored = JSON.parse(state) as { value: JBListboxValue<TValue> };
      this.#hasLiveValue = true;
      this.#setValue(restored.value);
    } catch {
      this.#hasLiveValue = true;
      this.#setValue(state as TValue);
    }
  }

  focus(options?: FocusOptions) {
    if (this.disabled) return;
    super.focus(options);
    const option = this.#selectedOption || this.#selectedOptions.values().next().value || this.#visibleOptions[0];
    if (option) this.#setActiveOption(option);
  }

  checkValidity(): boolean {
    const result = this.#validation.checkValiditySync({ showError: false });
    if (!result.isAllValid) this.dispatchEvent(new Event("invalid", { cancelable: true }));
    return result.isAllValid;
  }

  reportValidity(): boolean {
    const result = this.#validation.checkValiditySync({ showError: true });
    if (!result.isAllValid) this.dispatchEvent(new Event("invalid", { cancelable: true }));
    return result.isAllValid;
  }

  setCustomValidity(message: string) {
    if (message) this.setAttribute("error", message);
    else this.removeAttribute("error");
    this.#validation.checkValiditySync({ showError: Boolean(message) });
  }

  showValidationError(error: ShowValidationErrorParameters | string) {
    this.elements.message.textContent = typeof error === "string" ? error : error.message;
    this.#internals?.states?.add("invalid");
    if (this.#internals) this.#internals.ariaInvalid = "true";
  }

  clearValidationError() {
    this.elements.message.textContent = this.getAttribute("message") || "";
    this.#internals?.states?.delete("invalid");
    if (this.#internals) this.#internals.ariaInvalid = "false";
  }

  #initWebComponent() {
    const shadowRoot = this.attachShadow({ mode: "open", serializable: true });
    registerDefaultVariables();
    const template = document.createElement("template");
    template.innerHTML = `<style>${VariablesCSS}\n${CSS}</style>\n${renderHTML()}`;
    shadowRoot.appendChild(template.content.cloneNode(true));
    this.elements = {
      componentWrapper: shadowRoot.querySelector(".jb-listbox-web-component")!,
      label: shadowRoot.querySelector(".label-text")!,
      list: shadowRoot.querySelector(".list")!,
      optionSlot: shadowRoot.querySelector("slot")!,
      message: shadowRoot.querySelector(".message")!,
    };
  }

  #registerEventListeners() {
    this.addEventListener("select", this.#onOptionSelect);
    this.addEventListener("deselect", this.#onOptionDeselect);
    this.addEventListener("jb-option-connected", this.#onOptionConnected as EventListener);
    this.addEventListener("keydown", this.#onKeyDown);
    this.elements.optionSlot.addEventListener("slotchange", this.#refreshDirectOptions);
  }

  #refreshDirectOptions = () => {
    for (const element of this.elements.optionSlot.assignedElements({ flatten: true })) {
      if (element.localName === "jb-option") this.#registerOption(element as JBOptionWebComponent<TValue>);
    }
    this.#syncOptionSelection();
  };

  #onOptionConnected = (event: CustomEvent) => {
    const option = event.composedPath()[0];
    if (option instanceof HTMLElement && option.localName === "jb-option") {
      this.#registerOption(option as JBOptionWebComponent<TValue>);
    }
  };

  #registerOption(option: JBOptionWebComponent<TValue>) {
    if (this.#options.has(option)) return;
    option.setSelectElement(this);
    option.addEventListener("jb-option-disconnected", this.#onOptionDisconnected as EventListener, { once: true });
    option.addEventListener("mouseenter", this.#onOptionHover);
    if (!option.id) option.id = `jb-listbox-option-${crypto.randomUUID?.() ?? Math.random().toString(36).slice(2)}`;
    this.#options.add(option);
    option.selected = this.#isValueSelected(option.value);
  }

  #onOptionDisconnected = (event: CustomEvent) => {
    const option = event.target as JBOptionWebComponent<TValue>;
    this.#options.delete(option);
    this.#selectedOptions.delete(option);
    if (this.#selectedOption === option) this.#selectedOption = null;
    option.removeEventListener("mouseenter", this.#onOptionHover);
  };

  #onOptionHover = (event: MouseEvent) => {
    if (!this.disabled) this.#setActiveOption(event.currentTarget as JBOptionWebComponent<TValue>);
  };

  #onOptionSelect = (event: Event) => {
    if (this.disabled) return;
    const option = event.composedPath()[0] as JBOptionWebComponent<TValue>;
    if (option.localName !== "jb-option") return;
    const nextValue = this.multiple ? [...(Array.isArray(this.#value) ? this.#value : []), option.value as TValue] : option.value;
    this.#hasLiveValue = true;
    this.#setValue(nextValue as JBListboxValue<TValue>);
    this.#setActiveOption(option);
    this.#afterUserChange();
  };

  #onOptionDeselect = (event: Event) => {
    if (this.disabled || !this.multiple) return;
    const option = event.composedPath()[0] as JBOptionWebComponent<TValue>;
    if (option.localName !== "jb-option") return;
    const nextValue = (Array.isArray(this.#value) ? this.#value : []).filter(value => !Object.is(value, option.value));
    this.#hasLiveValue = true;
    this.#setValue(nextValue);
    this.#setActiveOption(option);
    this.#afterUserChange();
  };

  #afterUserChange() {
    if (!this.isAutoValidationDisabled) {
      void this.#validation.checkValidity({ showError: this.#internals?.states?.has("invalid") ?? false });
    }
    this.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
    this.dispatchEvent(new Event("change", { bubbles: true }));
  }

  #setValue(value: JBListboxValue<TValue>) {
    this.#value = this.#normalizeValue(value);
    this.#syncOptionSelection();
    this.#syncFormValue();
  }

  #normalizeValue(value: JBListboxValue<TValue>): JBListboxValue<TValue> {
    if (this.multiple) {
      if (value === null || value === undefined) return [];
      return Array.isArray(value) ? [...value] : [value];
    }
    if (Array.isArray(value)) return value[0] ?? null;
    return value ?? null;
  }

  #syncOptionSelection() {
    this.#selectedOption = null;
    this.#selectedOptions.clear();
    for (const option of this.#options) {
      const selected = this.#isValueSelected(option.value);
      option.selected = selected;
      if (selected) {
        if (this.multiple) this.#selectedOptions.add(option);
        else this.#selectedOption = option;
      }
    }
  }

  #isValueSelected(optionValue: TValue | null) {
    return Array.isArray(this.#value) ? this.#value.some(value => Object.is(value, optionValue)) : Object.is(this.#value, optionValue);
  }

  #syncFormValue() {
    if (!this.#internals || typeof this.#internals.setFormValue !== "function") return;
    const state = this.#serializeState();
    if (Array.isArray(this.#value)) {
      if (this.#value.length === 0 || !this.name) {
        this.#internals.setFormValue(null, state);
        return;
      }
      const formData = new FormData();
      for (const value of this.#value) formData.append(this.name, this.#serializeValue(value));
      this.#internals.setFormValue(formData, state);
      return;
    }
    this.#internals.setFormValue(this.#value === null ? null : this.#serializeValue(this.#value), state);
  }

  #serializeValue(value: TValue) {
    if (typeof value === "string") return value;
    if (value instanceof Date) return value.toISOString();
    if (typeof value === "object" && value !== null) {
      try {
        return JSON.stringify(value);
      } catch {
        return String(value);
      }
    }
    return String(value);
  }

  #serializeState() {
    try {
      return JSON.stringify({ value: this.#value });
    } catch {
      return this.#valueToString(this.#value);
    }
  }

  #valueToString(value: JBListboxValue<TValue>) {
    if (value === null) return "";
    return Array.isArray(value) ? value.map(item => this.#serializeValue(item)).join(",") : this.#serializeValue(value);
  }

  #cloneValue(value: JBListboxValue<TValue>): JBListboxValue<TValue> {
    return Array.isArray(value) ? [...value] : value;
  }

  #valuesEqual(first: JBListboxValue<TValue>, second: JBListboxValue<TValue>) {
    if (Array.isArray(first) && Array.isArray(second)) {
      return first.length === second.length && first.every((value, index) => Object.is(value, second[index]));
    }
    return Object.is(first, second);
  }

  get #visibleOptions() {
    return [...this.#options].filter(option => !option.hidden);
  }

  #setActiveOption(option: JBOptionWebComponent<TValue>) {
    for (const item of this.#options) item.active = item === option;
    if (this.#internals) this.#internals.ariaActiveDescendantElement = option;
  }

  #onKeyDown = (event: KeyboardEvent) => {
    if (this.disabled || this.#isInteractiveChild(event.composedPath()[0])) return;
    const options = this.#visibleOptions;
    if (options.length === 0) return;
    const activeIndex = options.findIndex(option => option.active);
    let nextOption: JBOptionWebComponent<TValue> | undefined;
    switch (event.key) {
      case "ArrowDown":
        nextOption = options[Math.min(activeIndex + 1, options.length - 1)] || options[0];
        break;
      case "ArrowUp":
        nextOption = options[activeIndex <= 0 ? 0 : activeIndex - 1];
        break;
      case "Home":
        nextOption = options[0];
        break;
      case "End":
        nextOption = options[options.length - 1];
        break;
      case "Enter":
      case " ": {
        const activeOption = activeIndex >= 0 ? options[activeIndex] : options[0];
        activeOption.toggleOption();
        event.preventDefault();
        return;
      }
      default:
        return;
    }
    event.preventDefault();
    if (nextOption) {
      this.#setActiveOption(nextOption);
      nextOption.scrollIntoView({ block: "nearest" });
    }
  };

  #isInteractiveChild(target: EventTarget | undefined) {
    return target instanceof HTMLElement && target !== this && target.matches("button, input, select, textarea, a[href]");
  }

  #syncFocusableState() {
    this.tabIndex = this.disabled ? -1 : 0;
  }

  #getValidationList(): ValidationItem<JBListboxValue<TValue>>[] {
    const validations: ValidationItem<JBListboxValue<TValue>>[] = [];
    const customError = this.getAttribute("error")?.trim();
    if (customError) {
      validations.push({ message: customError, stateType: "customError" });
    }
    if (this.required) {
      validations.push({
        message: dictionary.get(i18n, "requiredMessage")(this.getAttribute("label")),
        stateType: "valueMissing",
        validator: value => (Array.isArray(value) ? value.length > 0 : value !== null && value !== undefined),
      });
    }
    return validations;
  }

  #setValidationResult(result: ValidationResult<JBListboxValue<TValue>>) {
    if (result.isAllValid) {
      this.#internals?.setValidity({});
      return;
    }
    const states: ValidityStateFlags = {};
    let message = "";
    for (const item of result.validationList) {
      if (item.isValid) continue;
      states[item.validation.stateType || "customError"] = true;
      if (!message) message = item.message || "";
    }
    this.#internals?.setValidity(states, message);
  }
}

if (!customElements.get("jb-listbox")) {
  customElements.define("jb-listbox", JBListboxWebComponent);
}
