declare global {
  interface HTMLElementEventMap {
    "jb-option-disconnected": CustomEvent;
    "jb-option-connected": CustomEvent;
    "filter-change": CustomEvent;
  }
}

export type JBOptionElements = {
  componentWrapper:HTMLDivElement,
  contentWrapper:HTMLDivElement,
}