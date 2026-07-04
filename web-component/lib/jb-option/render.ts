export function renderHTML(): string {
  return /* html */ `
    <div class="jb-options-web-component">
      <div class="option-content-wrapper">
        <slot></slot>
      </div>
    </div>
  `;
}