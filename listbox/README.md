# Listbox

`jb-select/listbox` is an always-visible, form-associated listbox. It reuses `jb-option` from `jb-select/option` and supports both single and multiple selection.

## Installation

```sh
npm install jb-select
```

## Web component

Importing `jb-select/listbox` also registers the shared `jb-option` element.

```js
import 'jb-select/listbox';
```

```html
<jb-listbox name="environment" label="Environment" required>
  <jb-option value="development">Development</jb-option>
  <jb-option value="staging">Staging</jb-option>
  <jb-option value="production">Production</jb-option>
</jb-listbox>
```

Use the `multiple` attribute for array values:

```html
<jb-listbox name="teams" label="Teams" multiple>
  <jb-option value="design">Design</jb-option>
  <jb-option value="engineering">Engineering</jb-option>
</jb-listbox>
```

The public API includes `value`, `initialValue`, `multiple`, `name`, `required`, `disabled`, `isDirty`, `form`, `validation`, `checkValidity()`, `reportValidity()`, and `setCustomValidity()`.

## React

```tsx
import { JBListbox } from 'jb-select/listbox/react';
import { JBOption } from 'jb-select/option/react';

<JBListbox<string> name="environment" label="Environment" value={environment}>
  <JBOption value="development">Development</JBOption>
  <JBOption value="production">Production</JBOption>
</JBListbox>
```

For multiple selection, pass `multiple` and use an array value.

## Events

- `input` fires immediately after a user selection changes.
- `change` fires after the value has changed.
- `invalid` fires when `checkValidity()` or `reportValidity()` fails.
- `load` and `init` fire during the first connection.

## CSS custom properties

- `--jb-listbox-border-color`
- `--jb-listbox-border-color-focus`
- `--jb-listbox-border-color-invalid`
- `--jb-listbox-background`
- `--jb-listbox-border-radius`
- `--jb-listbox-border-width`
- `--jb-listbox-border-bottom-width`
- `--jb-listbox-border-width-focus`
- `--jb-listbox-border-bottom-width-focus`
- `--jb-listbox-box-shadow`
- `--jb-listbox-box-shadow-focus`
- `--jb-listbox-padding`
- `--jb-listbox-gap`
- `--jb-listbox-max-height`
- `--jb-listbox-label-color`
- `--jb-listbox-label-font-size`
- `--jb-listbox-message-color`
- `--jb-listbox-message-color-invalid`
- `--jb-listbox-message-font-size`
