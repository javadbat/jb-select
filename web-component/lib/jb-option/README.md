# jb-option

`jb-option` is the option item web component used inside `jb-select` and `jb-option-list`.

## Usage
```html
<jb-select label="City">
  <jb-option value="tehran">Tehran</jb-option>
  <jb-option value="shiraz">Shiraz</jb-option>
</jb-select>
```

You can place custom HTML inside the option when the visible label needs richer UI.

```html
<jb-option value="red">
  <span class="color-circle" style="background-color: #f00"></span>
  Red
</jb-option>
```

## CSS Variables
| CSS variable name | description |
| --- | --- |
| --jb-option-border-radius | Option border radius. |
| --jb-option-padding | Option padding. |
| --jb-option-font-size | Option font size. |
| --jb-option-min-height | Option minimum height. |
| --jb-option-color | Option text color. |
| --jb-option-color-active | Option text color on hover or keyboard navigation. |
| --jb-option-bg-color | Option background color. |
| --jb-option-bg-color-active | Option background color on hover or keyboard navigation. |
