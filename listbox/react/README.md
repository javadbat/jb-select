# jb-listbox React component

React wrapper for [`jb-listbox`](../web-component/README.md). It registers the underlying web component, forwards React props and events, and keeps the same form and validation behavior.

## Demo

- [Normal listbox](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jblistbox--normal)
- [Multiple selection](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jblistbox--multiple-selection)
- [Checkbox options](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jblistbox--multiple-with-checkbox)
- [Required validation](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jblistbox--required-validation)
- [Filtering with `JBInput`](https://javadbat.github.io/design-system/?path=/story/components-form-elements-jblistbox--filtered-options)
- [Searchable listbox guide](https://javadbat.github.io/design-system/?path=/docs/components-form-elements-jblistbox-filtering--docs)

## Installation

```sh
npm i jb-select
```

## Usage

```tsx
import { JBListbox } from "jb-select/listbox/react";
import { JBOption } from "jb-select/option/react";

const StringListbox = JBListbox<string>;

<StringListbox name="environment" label="Environment">
  <JBOption value="development">Development</JBOption>
  <JBOption value="production">Production</JBOption>
</StringListbox>;
```

For multiple selection, pass `multiple` and an array value:

```tsx
<StringListbox multiple name="features" value={["analytics"]}>
  <JBOption value="analytics">Analytics</JBOption>
  <JBOption value="billing">Billing</JBOption>
</StringListbox>
```

## Props

`JBListbox<TValue>` accepts standard React element props plus the listbox properties:

| prop | type | description |
| --- | --- | --- |
| `value` | `TValue \| TValue[] \| null` | Controlled selected value. Multiple mode uses an array. |
| `initialValue` | `TValue \| TValue[] \| null` | Initial value used by form reset. |
| `label` | `string` | Visible and accessible label. |
| `message` | `string` | Helper or validation message. |
| `name` | `string` | Form field name. |
| `multiple` | `boolean` | Enables multiple selection. |
| `required` | `boolean` | Enables required validation. |
| `disabled` | `boolean` | Disables interaction. |
| `error` | `string` | External validation error. |
| `validationList` | `ValidationItem[]` | Custom `jb-validation` rules. |

## Search and filtering

Search is composed by the consumer. Put `JBInput` inside the listbox, keep its value in React state, and dispatch `filter-change` through a ref:

```tsx
import { useEffect, useRef, useState } from "react";
import type { JBListboxWebComponent } from "jb-select/listbox";
import { JBInput } from "jb-input/react";
import { JBListbox } from "jb-select/listbox/react";
import { JBOption } from "jb-select/option/react";
import "jb-icons/search";

const StringListbox = JBListbox<string>;

function SearchableListbox() {
  const [filter, setFilter] = useState("");
  const listboxRef = useRef<JBListboxWebComponent<string>>(null);

  useEffect(() => {
    listboxRef.current?.dispatchEvent(
      new CustomEvent("filter-change", { detail: { filterText: filter } }),
    );
  }, [filter]);

  return (
    <StringListbox ref={listboxRef} label="Environment">
      <JBInput value={filter} onInput={event => setFilter(event.target.value)}>
        <jb-icon-search slot="end-section" size="sm" />
      </JBInput>
      <JBOption value="development">Development</JBOption>
      <JBOption value="production">Production</JBOption>
    </StringListbox>
  );
}
```

`JBListbox` registers each option with `setSelectElement()`, so options handle the `filter-change` event themselves. See the [full searchable listbox guide](https://javadbat.github.io/design-system/?path=/docs/components-form-elements-jblistbox-filtering--docs).

## Forms, events, and validation

The wrapper exposes the underlying form-associated element. Use `onInput` and `onChange` for selection changes, and use a ref for imperative validation:

```tsx
<StringListbox required onChange={event => console.log(event.target.value)} ref={listboxRef} />;

listboxRef.current?.reportValidity();
```

The component supports `FormData`, `form.reset()`, `checkValidity()`, `reportValidity()`, `setCustomValidity()`, `isDirty`, and custom `validationList` rules.

## Related components

- [`jb-listbox` web component](../web-component/README.md)
- [`JBOption`](../../option/README.md)
- [`JBOptionList`](../../option-list/README.md)
- [`JBSelect`](../../react/README.md)

## AI agent notes

- Import `JBListbox` from `jb-select/listbox/react` and `JBOption` from `jb-select/option/react`.
- Use `JBListbox<TValue>` to preserve the value type in TypeScript.
- Keep options as children and use `multiple` for array values.
- Search is consumer-owned; dispatch `filter-change` from the listbox ref.
