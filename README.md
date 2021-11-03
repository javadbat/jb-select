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

### callbacks

you can add callbacks to manage the way component works
for example if you have array of object as a option list and want to show custome title for option you can use:

```js
    dropDownElement.callbacks.getOptionTitle = (option)=>{return`${option.province}-${option.state}-${option.city}`}
    dropDownElement.callbacks.getOptionValue = (option)=>{return`${option.value}`}
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
| --jb-select-list-max-height               | max height of option list                                                                     |
| --jb-select-border-bottom-width           | width of border bottom                                                                        |
| --jb-select-border-width                  | width of border                                                                               |
| --jb-select-label-color                   | color of label defualt is `#1f1735`                                                           |
| --jb-select-option-color                  | change option text color                                                                      |
| --jb-select-option-color-hover            | change option text color on hover                                                             |
| --jb-select-option-background-color       | background of options default is `#fff`                                                       |
| --jb-select-option-background-color-hover | background of options on mouse hover default is `#1073db`                                     |
| --jb-select-input-color                   | color of input value                                                                          |

