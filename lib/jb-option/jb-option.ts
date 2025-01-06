import { type JBSelectWebComponent } from '../jb-select';
import CSS from './jb-option.scss';
import { renderHTML } from "./render";
import { JBOptionElements } from "./types";

//TODO: check for filter text to set visibility on mount
export class JBOptionWebComponent<TValue> extends HTMLElement {

  #elements: JBOptionElements;
  // it may be empty
  #SelectElement?: JBSelectWebComponent
  #value: TValue;
  get value(): TValue {
    return this.#value;
  }
  set value(value: TValue) {
    this.#value = value;
  }
  #selected = false;
  set selected(value: boolean) {
    this.#selected = value;
    if(value){
      this.#elements.componentWrapper.classList.add("--selected");
    }else{
      this.#elements.componentWrapper.classList.remove("--selected");
    }
  }
  get selected() {
    return this.#selected;
  }
  get optionContent():Node[]{
    const optionNodes = this.#elements.contentWrapper.querySelector("slot").assignedNodes();
    return optionNodes;
  }
  //TODO: add search hidden property for more accurate hidden and more personalized logic
  #hidden = false;
  get hidden(){
    return this.#hidden;
  }
  set hidden(value:boolean){
    this.#hidden = value;
    if(value){
      this.#elements.componentWrapper.classList.add('--hidden');
      this.setAttribute("inert","");
    }else{
      this.#elements.componentWrapper.classList.remove('--hidden');
      this.removeAttribute("inert");
    }
  }
  /**
   * return text content of option (it used in search by default to filter option)
   */
  get optionContentText(){
    const optionTextContent = this.optionContent.reduce((acc,item)=>{
      acc += item.textContent;
      return acc;
    },"");
    return optionTextContent;
  }
  constructor() {
    super();
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
  #onFilterChange(e: CustomEvent){
    const {filterText} = e.detail;
    const optionTextContent = this.optionContentText.toLowerCase();
    if(optionTextContent.includes(filterText.toLowerCase())){
      this.hidden = false;
    }else{
      this.hidden = true;
    }
  }
  disconnectedCallback() {
    this.#SelectElement?.removeEventListener("filter-change", this.#onFilterChange.bind(this));
    const event = new CustomEvent("jb-option-disconnected",{bubbles:true,composed:true,cancelable:false});
    this.dispatchEvent(event);
  }
  #initWebComponent() {
    const shadowRoot = this.attachShadow({
      mode: "open",
    });
    const html = `<style>${CSS}</style>` + "\n" + renderHTML();
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
  }
  //this event called on each connectedCallback so select could find it's option
  #dispatchPlaceEvent() {
    const event = new CustomEvent("jb-option-connected", { bubbles: true, composed: true });
    this.dispatchEvent(event);
  }
  #initProp() {
    this.value = this.getAttribute("value") as TValue || null;
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
    if (!this.#selected) {
      this.#dispatchSelectEvent();
    }
  }
  #dispatchSelectEvent() {
    const event = new CustomEvent("select", { bubbles: true, cancelable: false, composed: true });
    this.dispatchEvent(event);
  }
}
const myElementNotExists = !customElements.get("jb-option");
if (myElementNotExists) {
  //prevent duplicate registering
  window.customElements.define("jb-option", JBOptionWebComponent);
}
