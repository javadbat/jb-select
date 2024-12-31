# jb-select-react

select component for react 

> this component is a react wrapper for [jb-select](https://github.com/javadbat/jb-select)

Demo :  Demo: [codeSandbox preview](https://3f63dj.csb.app/samples/jb-select) for just see the demo and [codeSandbox editor](https://codesandbox.io/p/sandbox/jb-design-system-3f63dj?file=%2Fsrc%2Fsamples%2FJBSelect.tsx) if you want to see and play with code

## installation

run `npm install jb-select` to install package with npm

## usage

use below syntax in your render function.
```jsx
import {JBSelect} from 'jb-select/react';

<JBSelect></JBSelect>
```

### label
use label property to describe your select component.

```jsx
<JBSelect label='your label name' ></JBSelect>
```

## option list
if you want to add option to jb-select, you have 2 way:

- use `<JBOption>`
- use `<jbOptionList>`

### using `JBOption`:

using `JBOption` is quite an easy job:

```jsx
import {JBSelect,JBOption} from 'jb-select/react';

  <JBSelect label="gender">
      <JBOption value="male">Male</JBOption>
      <JBOption value="female">Female</JBOption>
      <JBOption value="0">Other</JBOption>
  </JBSelect>
  //or
  const optionList = ["1","2","3"]
  <JBSelect { ...args}>
    {
      optionList.map((option)=>(<JBOption key={option} value={option}>{option}</JBOption>))
    }
  </JBSelect>
```
you can also set object or any other data type as an value
```jsx
const [colorList] = useState([
    {
      id: 1,
      name: "Red",
      value: "#f00",
    },
    {
      id: 2,
      name: "Green",
      value: "#0f0",
    },
    {
      id: 3,
      name: "Blue",
      value: "#00f",
    },
    {
      id: 4,
      name: "Yellow",
      value: "#ff0",
    },
  ]);
  //this function is used to create selected value dom and can be styled using jb-select::part.
function getSelectedValueDOM(option) {
    const optionElement = document.createElement("div");
    optionElement.classList.add("selected-value");
    optionElement.innerHTML =
      '<span part="color-box" style="background-color:' + option.value +
      ';width:16px;height:16px;display:inline-block;"></span>' + "&nbsp;" +
      option.name;
    return optionElement;
}
return(
    <JBSelect label="normal" getSelectedValueDOM={getSelectedValueDOM}>
        {
          colorList.map((color)=>{
            return (<JBOption key={color.value} value={color}><span className="color-circle" style={{backgroundColor:color.value}}></span>{color.name}</JBOption>);
          })
        }
    </JBSelect>
)
```
### using `jbOptionList`:
`JBOptionList` will create options for you and it's good for when you want some easy to use options without complexity of update & manage JSX and it's a little faster for high performance app

example:

```jsx
import {JBSelect,JBOptionList} from 'jb-select/react';

render(){
    const list = [{name:'reza',family:'asadi',userId:1},{name:'peter',family:'peterson',userId:2}];
    getOptionTitle:(option)=>{
        return `${option.name} ${option.family}`;
    },
    getOptionValue:(option)=>{
        return option.userId;
    }
    return(
        <JBSelect label='your label name' >
            <JBOptionList optionList={list} getTitle={getOptionTitle} getValue={getOptionValue}/>
        </JBSelect>;
    );
}
```

### Add Icon or Any Element into box

sometimes you want to add icon into the select box before value box.
you can customize this entire section by adding a div or any other Tag with the `slot="start-section"`

like the example the below:

```jsx
<JBSelect>
    <div slot="start-section">
        <img class="your-custom-icon" src="./path/to/file.svg">
    </div>
</JBSelect>
```

### set custom style

in some cases in your project you need to change defualt style of the component for example you need zero margin or different border-radius and etc.    
if you want to set a custom style to this component all you need is to set css variable.
| css variable name                         | description                                                                                   |
| -------------                             | -------------                                                                                 |
| --jb-select-margin                        | web-component margin default is `0 0`                                                      |
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
| --jb-select-option-background-color       | background of options default is `transparent`                                                |
| --jb-select-option-background-color-hover | background of options on mouse hover default is `#1073db`                                     |
| --jb-select-input-color                   | color of input value                                                                          |
| --jb-select-bgcolor-selected              | set background color for selected status                                                      |
| --jb-select-selected-value-color          | selected value text color default is `#1f1735`                                                |
| --jb-select-selected-value-font-size      | font-size of selected value default is `1.1rem`                                               |
| --jb-select-message-color                 | message text color default is `#929292`                                                       |
| --jb-select-message-font-size             | font size of message default is `0.7em`                                                       |
| --jb-select-message-font-weight           | font weight of message box default is `normal`                                                |
| --jb-select-placeholder-color             | placeholder color default is `initial`                                                        |
| --jb-select-placeholder-font-size         | placeholder font-size default is `1.1em`                                                      |
| --jb-select-height                        | jb-select box height                                                                          |
| --jb-select-mobile-search-input-height    | when user open select on mobile there is a search box input this var will set its height      |
| --jb-select-mobile-item-list-margin       | when user open select on mobile there is gap between search box & list that can be customized |
| --jb-select-list-padding                  | padding of opened list box default is `16px 0`                                                |
| --jb-select-close-bg-color                | close button bg-color default is `#1f1735`                                                    |
| --jb-select-close-x-color                 | close button x color default is `#fff`                                                        |
| --jb-select-close-bg-opacity              | close button bg opacity default is `0.4`                                                      |
| --jb-select-mobile-input-bgcolor          | background color search input when open in mobile                                             |
| --jb-select-mobile-search-border-width    | when user open select on mobile, search box can have its own border width config              |
| --jb-select-mobile-search-border-color    | when user open select on mobile, search box can have its own border color config              |
| --jb-select-mobile-search-border-bottom-width | when user open select on mobile, search box can have its own border bottom width config   |
| --jb-select-mobile-search-border-bottom-color | when user open select on mobile, search box can have its own border bottom color config   |
| --jb-select-mobile-search-border-radius    | when user open select on mobile, search box can have its own border radius                   |
| --jb-select-middle-div-height              | separator line between input and list default is `0px` and hidden but you can cahange it     | 
| --jb-select-middle-div-color               | change separator line color                                                                  |
| --jb-select-middle-div-margin              | change seprator line margin                                                                  |
| --jb-select-middle-div-mobile-margin       | change separator line margin in mobile modal                                                  |
| --jb-select-middle-div-radius              | change separator line border-radius                                                          |
| --jb-select-list-scroll-color              | list item scroll color  default is `#c3c3c3`                                                 |
| --jb-select-list-scroll-border-radius      | list item scroll border-radius default is `4px`                                              |
| --jb-select-select-box-margin              | margin of internal element called select box that wrapper display element of form in one box |