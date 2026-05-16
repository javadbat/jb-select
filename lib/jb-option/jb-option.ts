import type { JBSelectWebComponent } from '../jb-select';
import CSS from './jb-option.css';
import { renderHTML } from "./render";
import type { JBOptionElements } from "./types";
import { removeCheckboxNodes } from './utils';

//TODO: check for filter text to set visibility on mount
//TODO: add disable option (will be displayed but can not be select)
//TODO: add highlight to highlight the searched value
export class JBOptionWebComponent<TValue> extends HTMLElement {

  #elements!: JBOptionElements;
  // it may be empty
  #SelectElement?: JBSelectWebComponent
  #value: TValue | null = null;
  #internals?: ElementInternals;
  get value(): TValue | null {
    return this.#value;
  }
  set value(value: TValue | null) {
    this.#value = value;
  }
  #selected = false;
  set selected(value: boolean) {
    this.#selected = value;
    if (value) {
      this.#elements.componentWrapper.classList.add("--selected");
    } else {
      this.#elements.componentWrapper.classList.remove("--selected");
    }
  }
  get selected() {
    return this.#selected;
  }
  get optionContent(): Node[] {
    const optionNodes = this.#elements.contentWrapper.querySelector("slot")!.assignedNodes().map(x => x.cloneNode(true));
    if (this.#SelectElement?.multiple) {
      removeCheckboxNodes(optionNodes);
    }
    return optionNodes;
  }
  //TODO: add search hidden property for more accurate hidden and more personalized logic
  #hidden = false;
  get hidden() {
    return this.#hidden;
  }
  set hidden(value: boolean) {
    this.#hidden = value;
    if (value) {
      this.#elements.componentWrapper.classList.add('--hidden');
      this.setAttribute("inert", "");
    } else {
      this.#elements.componentWrapper.classList.remove('--hidden');
      this.removeAttribute("inert");
    }
  }
  /**
   * return text content of option (it used in search by default to filter option)
   */
  get optionContentText() {
    const optionTextContent = this.optionContent.reduce((acc, item) => {
      acc += item.textContent;
      return acc;
    }, "");
    return optionTextContent;
  }
  constructor() {
    super();
    if (typeof this.attachInternals == "function") {
      //some browser don't support attachInternals
      this.#internals = this.attachInternals();
      this.#internals.role = "option";
    }
    this.#initWebComponent();
    this.#initProp();
  }
  connectedCallback() {
    // standard web component event that called when all of dom is bounded
    this.#dispatchPlaceEvent();

  }
  setSelectElement(element: JBSelectWebComponent) {
    if (element) {
      this.#SelectElement = element;
      this.#SelectElement.addEventListener("filter-change", this.#onFilterChange.bind(this));
    }
  }
  #onFilterChange(e: CustomEvent) {
    const { filterText } = e.detail;
    const optionTextContent = this.optionContentText.toLowerCase();
    if (optionTextContent.includes(filterText.toLowerCase())) {
      this.hidden = false;
    } else {
      this.hidden = true;
    }
  }
  disconnectedCallback() {
    this.#SelectElement?.removeEventListener("filter-change", this.#onFilterChange.bind(this));
    const event = new CustomEvent("jb-option-disconnected", { bubbles: true, composed: true, cancelable: false });
    this.dispatchEvent(event);
  }
  #initWebComponent() {
    const shadowRoot = this.attachShadow({
      mode: "open",
      serializable: true
    });
    const html = `<style>${CSS}</style>\n${renderHTML()}`;
    const element = document.createElement("template");
    element.innerHTML = html;
    shadowRoot.appendChild(element.content.cloneNode(true));
    this.#elements = {
      componentWrapper: shadowRoot.querySelector(".jb-options-web-component")!,
      contentWrapper: shadowRoot.querySelector(".option-content-wrapper")!,
    };
    this.#registerEventListener();
  }
  #registerEventListener() {
    this.#elements.componentWrapper.addEventListener("click", this.#onOptionClick.bind(this));
    this.addEventListener("change", this.#onInnerElementChange.bind(this), { passive: true });
  }
  //this event called on each connectedCallback so select could find it's option
  #dispatchPlaceEvent() {
    const event = new CustomEvent("jb-option-connected", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  #initProp() {
    this.value = (this.getAttribute("value") as TValue) ?? null;
  }
  static get observedAttributes() {
    return ["value"];
  }
  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    // do something when an attribute has changed
    this.#onAttributeChange(name, newValue);
  }
  #onAttributeChange(name: string, value: string) {
    switch (name) {
      case 'value':
        this.#value = value as TValue;
    }
  }
  #onOptionClick() {
    if (this.#isChangeCalled) {
      this.#isChangeCalled = false;
      return;
    }
    if (!this.#selected) {
      this.#dispatchSelectEvent();
      const checkbox = this.#getInsideCheckbox();
      if (checkbox && checkbox?.value !== true) {
        checkbox.value = true;
      }
    } else if (this.#SelectElement?.multiple) {
      this.#dispatchDeSelectEvent();
      const checkbox = this.#getInsideCheckbox();
      if (checkbox && checkbox?.value !== false) {
        checkbox.value = false;
      }
    }
  }
  #dispatchSelectEvent() {
    const event = new Event("select", { bubbles: true, cancelable: false, composed: true });
    this.dispatchEvent(event);
  }
  #dispatchDeSelectEvent() {
    const event = new Event("deselect", { bubbles: true, cancelable: false, composed: true });
    this.dispatchEvent(event);
  }
  #getInsideCheckbox() {
    return this.querySelector("jb-checkbox") as (Element & { value: boolean }) | null
  }
  #isChangeCalled = false;
  #onInnerElementChange(e: Event) {
    // biome-ignore lint/suspicious/noExplicitAny: <it happen after change so it must have a value>
    if (typeof (e.target as any)?.value == "boolean") {
      const value: boolean = (e.target as any)?.value;
      if (value) {
        this.#dispatchSelectEvent();
        this.#isChangeCalled = true;
      } else if (this.#SelectElement?.multiple) {
        this.#dispatchDeSelectEvent();
        this.#isChangeCalled = true;
      }
    }
  }

}
const myElementNotExists = !customElements.get("jb-option");
if (myElementNotExists) {
  //prevent duplicate registering
  window.customElements.define("jb-option", JBOptionWebComponent);
}
