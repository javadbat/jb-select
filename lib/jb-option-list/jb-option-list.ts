import { JBOptionWebComponent } from "../jb-option/jb-option";
import { type OptionListCallbacks } from "./types";

//TOption is the type of option, TValue is the type of value we extract from option
export class JBOptionListWebComponent<TOption, TValue> extends HTMLElement {
  #callbacks: OptionListCallbacks<TOption, TValue> = {};
  get callbacks() {
    return this.#callbacks;
  }
  #optionList: TOption[] = [];
  #optionPairMap: Map<TOption, JBOptionWebComponent<TValue>> = new Map();
  get optionList() {
    return this.#optionList || [];
  }
  set optionList(value) {
    if (!Array.isArray(value)) {
      console.error(
        "your provided option list to jb-option-list is not a array. you must provide array value",
        { value }
      );
      return;
    }
    this.#optionList = value;
    this.#initOptionList(value);
  }
  constructor() {
    super();
    this.#initWebComponent();
  }
  connectedCallback() {
    // standard web component event that called when all of dom is bounded
  }
  setCallback<T extends keyof OptionListCallbacks<TOption, TValue>>(key: T, callbackFn: OptionListCallbacks<TOption, TValue>[T]) {
    this.#callbacks[key] = callbackFn;
    switch (key) {
      case 'getContentDOM':
      case 'getTitle':
        this.#updateOptionsContent();
        break;
      case 'getValue':
        this.#updateOptionsValue();
    }
  }
  #updateOptionsContent() {
    this.#optionPairMap.forEach((dom, option) => {
      this.#fillOptionContent(option, dom);
    });
  }
  #updateOptionsValue() {
    this.#optionPairMap.forEach((dom, option) => {
      dom.value = this.#getOptionValue(option);
    });
  }
  #initWebComponent() {
    const shadowRoot = this.attachShadow({
      mode: "open",
    });
    const element = document.createElement("template");

    shadowRoot.appendChild(element.content.cloneNode(true));
  }
  //
  #initOptionList(optionList: TOption[]) {
    this.shadowRoot.innerHTML = "";
    optionList.forEach((option) => {
      const dom = this.#createOptionDOM(option);
      this.shadowRoot.appendChild(dom);
      this.#optionPairMap.set(option, dom);
    });
  }
  #getOptionValue(option: TOption): TValue {
    if (this.callbacks.getValue && typeof this.callbacks.getValue !== "function") {
      console.error("getOptionValue callback is not a function");
    }
    try {
      if (typeof this.#callbacks.getValue == "function") {
        return this.#callbacks.getValue(option);
      } else {
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
    if (typeof this.#callbacks.getTitle == "function") {
      try {
        return this.#callbacks.getTitle(option);
      } catch (e) {
        console.error(
          `Invalid getOptionTitle callback Result, must be a function that returns the value of an option`,
          option
        );
      }
    } else {
      return String(option);
    }
    return "";
  }
  #fillOptionContent(option: TOption, element: JBOptionWebComponent<TValue>) {
    element.innerHTML = "";
    if (typeof this.#callbacks.getContentDOM == "function") {
      element.appendChild(this.#callbacks.getContentDOM(option));
    } else {
      element.innerHTML = this.#getOptionTitle(option);
    }
  }
  #createOptionDOM(item: TOption): JBOptionWebComponent<TValue> {
    // const optionElement = document.createElement("jb-option") as JBOptionWebComponent<TValue>;
    const optionElement = new JBOptionWebComponent<TValue>();
    //it has default function who return exact same input
    this.#fillOptionContent(item, optionElement);
    optionElement.value = this.#getOptionValue(item);
    return optionElement;
  }

}
const myElementNotExists = !customElements.get("jb-option-list");
if (myElementNotExists) {
  //prevent duplicate registering
  window.customElements.define("jb-option-list", JBOptionListWebComponent);
}
