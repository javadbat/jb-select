export function renderHTML(): string {
  return /* html */ `
    <div class="jb-options-web-component">
      <div class="option-content">
        <slot></slot>
      </div>
    </div>
  `;
}
