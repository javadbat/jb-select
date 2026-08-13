export function renderHTML(): string {
  return /* html */ `
    <div class="jb-listbox-web-component" part="wrapper">
      <label class="label" part="label">
        <span class="label-text"></span>
      </label>
      <div class="list" part="list" role="presentation">
        <slot></slot>
      </div>
      <div class="message" part="message" aria-live="polite"></div>
    </div>
  `;
}
