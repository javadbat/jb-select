# jb-select

pure js standalone select box for javascript

## doc

use `<jb-select></jb-select>`

### inject option list

if ypu want to add option to jb-select set option list to DOM
`const dropDownElement = document.querySelector('jb-select').optionList = [your option array]`

### set value

to select value in your code you have 2 option:
1- set it via dom assign `dropDownElement.value = yourValue`
2- set through dom attribute `<jb-select value="yourValueSting"></jb-select>`
remember set value as attribute if your option is a plain string but in direct assign like first option you can attach both string or object value assignation

### callbacks

you can add callbacks to manage the way component works
for example if you have array of object as a option list and want to show custome title for option you can use:
`dropDownElement.callbacks.getOptionTitle = (option)=>{return`${option.province}-${option.state}-${option.city}`}`
remember you must set this callback before set your optionList
