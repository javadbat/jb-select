# jb-listbox

[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/element/jb-select)
[![GitHub license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://raw.githubusercontent.com/javadbat/jb-select/main/LICENSE)
[![NPM Version](https://img.shields.io/npm/v/jb-select)](https://www.npmjs.com/package/jb-select)

`jb-listbox` is an always-visible, form-associated listbox. It reuses [`jb-option`](../../option/README.md) and supports single or multiple selection without the dropdown behavior of `jb-select`.

## Demo

- [Normal listbox](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jblistbox--normal)
- [Multiple selection](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jblistbox--multiple-selection)
- [Required validation](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jblistbox--required-validation)
- [Filtering with a search input](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jblistbox--filtered-options)
- [Searchable listbox guide](https://javadbat.github.io/design-system/?path=/docs/components-form-elements-jblistbox-filtering--docs)

## Installation

```sh
npm i jb-select
```

```js
import "jb-select/listbox";
import "jb-select/option";
```

## Usage

```html
<form>
  <jb-listbox name="environment" label="Environment">
    <jb-option value="development">Development</jb-option>
    <jb-option value="staging">Staging</jb-option>
    <jb-option value="production">Production</jb-option>
  </jb-listbox>
</form>
```

Use `multiple` when the field should submit repeated values:

```html
<jb-listbox name="features" label="Features" multiple>
  <jb-option value="analytics">Analytics</jb-option>
  <jb-option value="billing">Billing</jb-option>
</jb-listbox>
```

## When to use

Use `jb-listbox` when options should remain visible on the page. Use [`jb-select`](../../README.md) when options should open in a dropdown with built-in mobile search behavior.

## Attributes and properties

| name | type | description |
| --- | --- | --- |
| `value` | `TValue \| TValue[] \| null` | Current selected value. Multiple listboxes expose an array. |
| `initial-value` / `initialValue` | `TValue \| TValue[] \| null` | Value used by form reset. |
| `name` | `string` | Form field name. |
| `label` | `string` | Accessible and visible label. |
| `message` | `string` | Helper or validation message. |
| `multiple` | `boolean` | Enables multiple selection and array values. |
| `required` | `boolean` | Requires at least one selected option. |
| `disabled` | `boolean` | Disables interaction and form submission. |
| `error` | `string` | External validation error. |
| `isDirty` | `boolean` | Indicates whether the current value differs from the initial value. |

## Forms and validation

The element implements form association and `JBFormInputStandards`. It participates in `FormData`, supports `form.reset()`, and exposes `checkValidity()`, `reportValidity()`, `setCustomValidity()`, and `validation` through `WithValidation`.

```js
const listbox = document.querySelector("jb-listbox");
listbox.checkValidity();
listbox.reportValidity();
```

## Filtering

Search is intentionally not built into the native listbox. Add any input you prefer and dispatch `filter-change` on the listbox:

```js
listbox.dispatchEvent(
  new CustomEvent("filter-change", {
    detail: { filterText: searchInput.value },
  }),
);
```

Each registered `jb-option` receives the event through `setSelectElement()` and updates its own visibility. See the [searchable listbox guide](https://javadbat.github.io/design-system/?path=/docs/components-form-elements-jblistbox-filtering--docs).

## Related components

- [`jb-option`](../../option/README.md) — reusable option element.
- [`jb-option-list`](../../option-list/README.md) — array-driven option rendering.
- [`jb-select`](../../README.md) — dropdown select with built-in search behavior.

## AI agent notes

- Import `jb-select/listbox` and `jb-select/option` independently.
- Keep `jb-option` elements as direct children of `jb-listbox`.
- Use `multiple` for array values and repeated form entries.
- Add search in the consuming application and dispatch `filter-change`.
