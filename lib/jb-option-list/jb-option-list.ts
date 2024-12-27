import { JBOptionWebComponent } from "../jb-option/jb-option";
import { type JBSelectWebComponent } from "../jb-select";
import { type OptionListCallbacks } from "./types";

//TOption is the type of option, TValue is the type of value we extract from option
export class JBOptionListWebComponent<TOption,TValue> extends HTMLElement {
  callbacks:OptionListCallbacks<TOption,TValue> = {};
  // it may be empty
  #parentSelectElement?: JBSelectWebComponent
  #optionList: TOption[] = [];
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
    setTimeout(()=>{
      this.#initOptionList(value);
    },1000);
  }
  constructor() {
    super();
    this.#initWebComponent();
  }
  connectedCallback() {
    // standard web component event that called when all of dom is bounded
    this.#findParentSelect();
  }
  #initWebComponent() {
    const shadowRoot = this.attachShadow({
      mode: "open",
    });
    const element = document.createElement("template");

    shadowRoot.appendChild(element.content.cloneNode(true));
  }
  #findParentSelect() {
    const checkParent = (element: HTMLElement) => {
      if (!element) {
        return;
      }
      if (element.tagName == "jb-select") {
        this.#parentSelectElement = element as JBSelectWebComponent;
      } else {
        checkParent(element.parentElement);
      }
    };
    checkParent(this.parentElement);
  }
  //
  #initOptionList(optionList:TOption[]){
    this.shadowRoot.innerHTML = "";
    optionList.forEach((option)=>{
      const dom = this.#createOptionDOM(option);
      this.shadowRoot.appendChild(dom);
    });
  }
  #getOptionValue(option: TOption): TValue {
    if (this.callbacks.getValue && typeof this.callbacks.getValue !== "function") {
      console.error("getOptionValue callback is not a function");
    }
    try {
      if (typeof this.callbacks.getValue == "function") {
        return this.callbacks.getValue(option);
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
    if(typeof this.callbacks.getTitle == "function"){
      try {
        return this.callbacks.getTitle(option);
      } catch (e) {
        console.error(
          `Invalid getOptionTitle callback Result, must be a function that returns the value of an option`,
          option
        );
      }
    }else{
      return String(option);
    }
    return "";
  }

  #createOptionDOM(item: TOption): JBOptionWebComponent<TValue> {
    // const optionElement = document.createElement("jb-option") as JBOptionWebComponent<TValue>;
    const optionElement = new JBOptionWebComponent<TValue>();
    //it has default function who return exact same input
    optionElement.innerHTML = this.#getOptionTitle(item);
    optionElement.value = this.#getOptionValue(item);
    return optionElement;
  }

}
const myElementNotExists = !customElements.get("jb-option-list");
if (myElementNotExists) {
  //prevent duplicate registering
  window.customElements.define("jb-option-list", JBOptionListWebComponent);
}
