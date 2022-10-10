# jb-select

pure js standalone select box web-component

- with search ability
- mobile freindly
- cusomizable style with css variable

sample:<https://codepen.io/javadbat/pen/abpjKVP>

## doc

use `<jb-select></jb-select>`

### set option list

if ypu want to add option to jb-select set option list to DOM
`const dropDownElement = document.querySelector('jb-select').optionList = [your option array]`

### get value

its simple like any other form element use `.value` of dom

```javascript
//get value
document.querySelector('jb-select').value;
// if you use a object in option list you can get selected option title beside value
document.querySelector('jb-select').selectedOptionTitle;
```
### set value

to select value in your code you have 2 option:
1- set it via dom assign `dropDownElement.value = yourValue`
2- set through dom attribute `<jb-select value="yourValueSting"></jb-select>`
remember set value as attribute if your option is a plain string but in direct assign like first option you can attach both string or object value assignation

### placeholder

 you can set placeholder when data is empty

 ```html
 <jb-select placeholder="please select"></jb-select>
 ```

### change empty state shape
when the searched value in select is not found, there is an open dropdown with the not found message.
you can customize this entire section by adding a div with the `slot="empty-list"`

like the example the below:

```html
<jb-select>
    <div slot="empty-list-message">
        put your customize html here
    </div>
</jb-select>
```

### callbacks

you can add callbacks to manage the way component works
for example if you have array of object as a option list and want to show custome title for option you can use:

```js
    dropDownElement.callbacks.getOptionTitle = (option)=>{return`${option.province}-${option.state}-${option.city}`}
    dropDownElement.callbacks.getOptionValue = (option)=>{return`${option.value}`}
    //to customizing options
    dropDownElement.callbacks.getOptionDOM = (option,onOptionSelected)=>{
        // option is the object or any other formatted data yoy=u privide to optionList array
         const optionElement = document.createElement('div');
         //defualt class of each option in jb-select. you can change or customize it if you wish
        optionElement.classList.add('select-option');
        // here in this example we want to show a color list with color sample next to it
        optionElement.innerHTML = '<span part="color-box" style="background-color:'+option.colorCode+';width:16px;height:16px"></span>'+'&nbsp;'+option.name;
        //onOptionSelected is a function you have to call when option selected it mostly bind on on option dom clicked'
        // if you want to set onClick on dom other than returned wrapper DOM for example on a color-box you must set value property on it: colorBoxDOM.value = option; colorBoxDOM.addEventListener('click', onOptionSelected);
        optionElement.addEventListener('click', onOptionSelected);
        //return HTMLElement in the end
        return optionElement;
    }
    //to customizing selected value
    dropDownElement.callbacks.getSelectedValueDOM = (option)=>{
        const optionElement = document.createElement('div');
        optionElement.classList.add('selected-value');
        optionElement.innerHTML = '<span part="color-box" style="background-color:'+option.value+';width:16px;height:16px"></span>'+'&nbsp;'+option.name;
        return optionElement;
    }
```

remember you must set this callback before set your optionList

### events

```js

    dropDownElement.addEventListener('change',(e)=>{/*your function*/});
    dropDownElement.addEventListener('keyup',(e)=>{/*your function*/});

```

### set custome style

in some cases in your project you need to change defualt style of web-component for example you need zero margin or different border-radius and etc.  
if you want to set a custom style to this web-component all you need is to set css variable in parent scope of web-component
| css variable name                         | description                                                                                   |
| -------------                             | -------------                                                                                 |
| --jb-select-margin                        | web-component margin default is `0 12px`                                                      |
| --jb-select-width                         | change the select component width default is `100%`                                           |
| --jb-select-border-radius                 | web-component border-radius defualt is `16px`                                                 |
| --jb-select-border-color                  | border color of select in normal mode                                                         |
| --jb-select-border-color-selected         | border color when user select a value from list                                               |
| --jb-select-bgcolor                       | background color of input                                                                     |
| --jb-select-overlay-bgcolor               | background of select overlay when open in mobile and tablet screen                            |
| --jb-select-list-max-height               | max height of option list                                                                     |
| --jb-select-border-bottom-width           | width of border bottom                                                                        |
| --jb-select-border-width                  | width of border                                                                               |
| --jb-select-label-color                   | color of label default is `#1f1735`                                                           |
| --jb-input-label-font-size                | label font size default is `0.8em`                                                            |
| --jb-input-label-font-weight              | color of label defualt is `#1f1735`                                                           |
| --jb-select-option-color                  | change option text color                                                                      |
| --jb-select-option-color-hover            | change option text color on hover                                                             |
| --jb-select-option-background-color       | background of options default is `#fff`                                                       |
| --jb-select-option-background-color-hover | background of options on mouse hover default is `#1073db`                                     |
| --jb-select-input-color                   | color of input value                                                                          |
| --jb-select-bgcolor-selected              | set background color for selected status                                                      |
| --jb-select-selected-value-color          | selected value text color default is `#1f1735`                                                |
| --jb-select-message-color                 | message text color default is `#929292`                                                       |
| --jb-select-message-font-size             | font size of message default is `0.7em`                                                       |
| --jb-select-message-font-weight           | font weight of message box default is `normal`                                                |
| --jb-select-placeholder-color             | placeholder color default is `initial`                                                        |
| --jb-select-placeholder-font-size         | placeholder font-size default is `1.1em`                                                      |
| --jb-select-height                        | jb-select box height                                                                          |
| --jb-select-mobile-search-input-height    | when user open select on mobile there is a search box input this var will set its height      |
| --jb-select-mobile-item-list-margin       | when user open select on mobile there is gap between search box & list that can be customized | 

