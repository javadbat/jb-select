import type { JBSelectWebComponent } from 'jb-select';
import { expect, userEvent, waitFor } from 'storybook/test';

export type SelectOption<TValue = unknown> = HTMLElement & {
  value: TValue;
  selected: boolean;
  active: boolean;
  hidden: boolean;
  optionContentText: string;
  toggleOption: () => void;
};

export function getSelect<TValue = unknown>(canvasElement: HTMLElement, index = 0) {
  const select = canvasElement.querySelectorAll<JBSelectWebComponent<TValue>>('jb-select')[index];
  expect(select).toBeTruthy();
  expect(select!.shadowRoot).toBeTruthy();
  return select!;
}

export function getNativeInput(select: JBSelectWebComponent) {
  const input = select.shadowRoot?.querySelector<HTMLInputElement>('.search-input');
  expect(input).toBeTruthy();
  return input!;
}

export function getSelectedValueText(select: JBSelectWebComponent) {
  return select.shadowRoot?.querySelector<HTMLElement>('.selected-value-wrapper')?.textContent?.trim() ?? '';
}

export function getMessageText(select: JBSelectWebComponent) {
  return select.shadowRoot?.querySelector<HTMLElement>('.message-box')?.textContent ?? '';
}

export function getClearButton(select: JBSelectWebComponent) {
  const clearButton = select.shadowRoot?.querySelector<HTMLElement>('.clear-button');
  expect(clearButton).toBeTruthy();
  return clearButton!;
}

export function getOptionPopover(select: JBSelectWebComponent) {
  const popover = select.shadowRoot?.querySelector<HTMLElement & { isOpen: boolean }>('.select-list-wrapper');
  expect(popover).toBeTruthy();
  return popover!;
}

export function getOptionPopoverWrapper(select: JBSelectWebComponent) {
  const popover = getOptionPopover(select);
  const wrapper = popover.shadowRoot?.querySelector<HTMLElement>('.jb-popover-web-component');
  expect(wrapper).toBeTruthy();
  return wrapper!;
}

export async function waitForOptions<TValue = unknown>(select: JBSelectWebComponent<TValue>, count = 1) {
  await waitFor(() => {
    expect(select.optionListWithOrder.length).toBeGreaterThanOrEqual(count);
  });

  return select.optionListWithOrder as SelectOption<TValue>[];
}

export async function selectOptionByIndex<TValue = unknown>(select: JBSelectWebComponent<TValue>, index: number) {
  const options = await waitForOptions(select, index + 1);
  options[index].toggleOption();
  return options[index];
}

export async function typeInSelect(select: JBSelectWebComponent, value: string) {
  const input = getNativeInput(select);

  select.focus();
  await userEvent.type(input, value);

  await waitFor(() => {
    expect(select.textValue).toBe(value);
  });
}

export function getNativeButton(button: HTMLElement) {
  const nativeButton = button.shadowRoot?.querySelector<HTMLButtonElement>('button');
  expect(nativeButton).toBeTruthy();
  return nativeButton!;
}

export async function appendEventTestSelect(canvasElement: HTMLElement) {
  const eventNames = ['load', 'init', 'keypress', 'input', 'keyup', 'filter-change', 'change', 'invalid'] as const;
  const events: string[] = [];
  const select = document.createElement('jb-select') as JBSelectWebComponent<string>;

  select.setAttribute('required', '');
  for (const eventName of eventNames) {
    select.addEventListener(eventName, () => events.push(eventName));
  }

  for (const value of ['alpha', 'beta']) {
    const option = document.createElement('jb-option') as SelectOption<string>;
    option.value = value;
    option.textContent = value;
    select.appendChild(option);
  }

  canvasElement.appendChild(select);

  await waitFor(() => {
    expect(events).toEqual(expect.arrayContaining(['load', 'init']));
  });
  await waitForOptions(select, 2);

  return { select, events };
}
