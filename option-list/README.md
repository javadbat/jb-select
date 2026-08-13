# jb-option-list

`jb-option-list` renders `jb-option` elements from an array and callback functions for extracting each option's title, value, or custom DOM content.

## Web component

```js
import 'jb-select';
import 'jb-select/option-list';
```

The option-list entry imports its `jb-select/option` dependency automatically.

```html
<jb-select label="City">
  <jb-option-list></jb-option-list>
</jb-select>
```

```js
const optionList = document.querySelector('jb-option-list');
optionList.optionList = cities;
optionList.setCallback('getTitle', (city) => city.name);
optionList.setCallback('getValue', (city) => city.id);
```

## React

```tsx
import { JBSelect } from 'jb-select/react';
import { JBOptionList } from 'jb-select/option-list/react';

<JBSelect label="City">
  <JBOptionList
    optionList={cities}
    getTitle={(city) => city.name}
    getValue={(city) => city.id}
  />
</JBSelect>
```
