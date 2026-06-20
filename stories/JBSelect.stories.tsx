
// biome-ignore lint/style/useImportType: <react must be import>
import React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { JBSelect, JBOptionList, JBOption, type Props, type JBSelectEventType } from 'jb-select/react';
import { JBButton } from 'jb-button/react';
//@ts-ignore
import './styles/style.css'
import type { Meta, StoryObj } from '@storybook/react';
import { colorList, nameList, numberOptionList, persons } from './constants';
import { JBCheckbox } from 'jb-checkbox/react';
const meta: Meta<Props<unknown>> = {
  title: "Components/form elements/JBSelect",
  component: JBSelect,
  args: {
    children: <JBOptionList optionList={nameList} />
  }
};

export default meta;
type Story = StoryObj<typeof JBSelect>;

export const Normal: Story = {
  args: {
    label: 'select from menu',
    message: "please select a value",
    placeholder: "placeholder",
  }
};
export const Multiple: Story = {
  render: () => {
    return (
      <JBSelect multiple>
        {
          persons.map(p => {
            return (
              <JBOption key={p.userId} value={p.userId}>{`${p.name} ${p.family}`}</JBOption>
            )
          })
        }
      </JBSelect>
    )
  }
};
export const MultipleWithOptionList: Story = {
  render: () => {
    return (
      <JBSelect multiple label="Assignees" placeholder="Choose one or more people">
        <JBOptionList
          optionList={persons}
          getTitle={(person) => `${person.name} ${person.family}`}
          getValue={(person) => person.userId}
        />
      </JBSelect>
    )
  }
};
export const MultipleWithCheckbox: Story = {
  render: () => {
    return (
      <JBSelect multiple>
        {
          persons.map(p => {
            return (
              <JBOption key={p.userId} value={p.userId}><JBCheckbox size='sm' /><span>{`${p.name} ${p.family}`}</span></JBOption>
            )
          })
        }
      </JBSelect>
    )
  }
};
export const MultipleWithCheckboxAndLabel: Story = {
  render: () => {
    return (
      <JBSelect multiple>
        {
          persons.map(p => {
            return (
              <JBOption key={p.userId} value={p.userId}><JBCheckbox size='sm'><div slot="label">{`${p.name} ${p.family}`}</div></JBCheckbox></JBOption>
            )
          })
        }
      </JBSelect>
    )
  }
};
export const MultipleWithValue: Story = {
  render: (args) => {
    const [value, setValue] = useState(args.value);
    useEffect(() => {
      setValue(args.value);
    }, [args.value])
    return (
      <div style={{display:'flex',flexDirection:'column', gap:'0.5rem'}}>
        <JBSelect multiple value={value} onChange={(e) => setValue(e.target.value)} >
          {
            persons.map(p => {
              return (
                <JBOption key={p.userId} value={p.userId}>{`${p.name} ${p.family}`}</JBOption>
              )
            })
          }
        </JBSelect>
        <JBButton size='sm' onClick={()=>console.log(value)}>Log Value (see console)</JBButton>
      </div>
    )
  },
  args: {
    value: [...persons.filter((_, i) => i % 2 == 0).map(x => x.userId)]
  }
};
export const WithValue: Story = {
  args: {
    label: 'select from menu',
    message: "please select a value",
    placeholder: "placeholder",
    value: nameList[3],
    children: <JBOptionList optionList={nameList} />
  }
};
export const Disabled: Story = {
  args: {
    label: 'select from menu',
    message: "please select a value",
    value: nameList[3],
    disabled: true
  }
};
export const FixedPopoverPosition: Story = {
  args: {
    label: 'fixed',
    message: "open select and see popover(only works in a desktop)",
    popoverPosition: "fixed"
  }
};
export const OptionObject: Story = {
  args: {
    label: 'select from menu',
    children: <JBOptionList optionList={[{ name: 'peter', family: 'hanan', userId: 1 }, { name: 'reza', family: 'asadi', userId: 2 }]} getTitle={(option) => `${option.name} ${option.family}`} getValue={(option) => option.userId} />,
    onChange: (e) => { console.log('onChange', e.target.value); }
  }
};
export const HideCleanButton: Story = {
  args: {
    label: 'select from menu',
    message: "please select a value",
    placeholder: "placeholder",
    hideClear: true,
  }
};
export const OptionAsChildren: Story = {
  args: {
    label: 'select from menu',
    message: "please select a value",
    placeholder: "placeholder",
    children: (
      <>
        <JBOption value="1">one</JBOption>
        <JBOption value="2">two</JBOption>
        <JBOption value="3">three</JBOption>
        <JBOption value="4">four</JBOption>
        <JBOption value="5">five</JBOption>
        <JBOption value="6">six</JBOption>
        <JBOption value="7">seven</JBOption>
        <JBOption value="8">eight</JBOption>
        <JBOption value="9">nine</JBOption>
        <JBOption value="10">ten</JBOption>
      </>
    )
  }
}

export const OptionObjectAsChildren: Story = {
  args: {
    label: 'select from menu',
    message: "please select a value",
    placeholder: "select number here",
    children: (
      <>
        <JBOption value={{ name: "ali", age: 10 }}>Ali</JBOption>
        <JBOption value={{ name: "reza", age: 12 }}>Reza</JBOption>
        <JBOption value={{ name: "joe", age: 14 }}>Joe</JBOption>
      </>
    )
  }
}

export const Required: Story = {
  args: {
    label: 'required select',
    message: "focus and un focus without selecting a value to see validation error",
    required: true,
  }
};

export const SizeVariants: Story = {
  render: () => {
    const options = <Fragment>
      {
        persons.map((p) => <JBOption key={p.userId} value={p}>{p.name}</JBOption>)
      }
    </Fragment>
    return (<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
      <JBSelect size='xl' label='xl size' message="message underneath" ></JBSelect>
      <JBSelect size='xl' label='xl size' placeholder="placeholder" >{options}</JBSelect>
      <JBSelect size='xl' label='xl size' value={persons[0]} >{options}</JBSelect>

      <JBSelect size='lg' label='lg size' message="message underneath" ></JBSelect>
      <JBSelect size='lg' label='lg size' placeholder="placeholder" >{options}</JBSelect>
      <JBSelect size='lg' label='lg size' value={persons[0]} >{options}</JBSelect>

      <JBSelect size='md' label='md size' message="message underneath"></JBSelect>
      <JBSelect size='md' label='md size' placeholder="placeholder">{options}</JBSelect>
      <JBSelect size='md' label='md size' value={persons[0]} >{options}</JBSelect>

      <JBSelect size='sm' label='sm size' message="message underneath"></JBSelect>
      <JBSelect size='sm' label='sm size' placeholder="placeholder">{options}</JBSelect>
      <JBSelect size='sm' label='sm size' value={persons[0]} >{options}</JBSelect>

      <JBSelect size='xs' label='xs size' message="message underneath"></JBSelect>
      <JBSelect size='xs' label='xs size' placeholder="placeholder">{options}</JBSelect>
      <JBSelect size='xs' label='xs size' value={persons[0]}>{options}</JBSelect>
    </div>)
  }
}
export const OverflowTest: Story = {
  render: () => {
    return <div style={{ height: '10rem', overflowY: "auto" }}>
      <JBSelect label='overflow test' style={{ width: "10rem" }} popoverPosition='fixed'>
        {
          persons.map((p) => <JBOption key={p.userId} value={p}>{p.name}</JBOption>)
        }
      </JBSelect>
      <div style={{ height: '20rem', background: 'red' }}></div>
    </div>
  }
}
export const EventTest: Story = {
  args: {
    ...Normal.args,
    onChange: () => alert('Changed')
  }
};

export const RTL: Story = {
  globals: {
    locale: "fa",
    dir: "rtl"
  },
  args: {
    label: 'از منو انتخاب کنید',
    children: <JBOptionList optionList={numberOptionList} />
  },
  parameters: {
    docs: {
      description: {
        story: 'RTL test'
      }
    },
  }
};

export const EmptyList: Story = {
  args: {
    label: 'empty list',
    message: "this list is a empty list",
    children: <JBOptionList optionList={[]} />,
  }
};

export const ModalHeight: Story = {
  args: {
    label: 'select from in mobile',
    message: "put in mobile view and open menu. it must fill half of the page",
    placeholder: "select number here",
    children: <JBOptionList optionList={numberOptionList} />,
    style: { "--jb-select-mobile-modal-height": "50vh", "--jb-select-mobile-modal-border-radius": "1rem" } as React.CSSProperties
  }
};

export const WithError: Story = {
  args: {
    label: 'with error',
    message: "please select a value",
    error: "error message",
  }
};

//when user type and want to change text
export const DynamicList: Story = {
  render: () => {
    const [optionList, setOptionList] = useState<string[]>([]);
    function fillList(text = "") {
      const newList: string[] = [];
      for (let i = 0; i < 20; i++) {
        newList.push(`${text} - ${i}`);
      }
      setOptionList(newList);
    }
    useEffect(() => {
      fillList();
    }, []);
    const onKeyup = function (e: JBSelectEventType<KeyboardEvent>) {
      const text = e.target.textValue;
      fillList(text);
    };
    return (
      <div>
        <JBSelect
          label="please type and see result change"
          onKeyUp={onKeyup}
        >
          <JBOptionList optionList={optionList}></JBOptionList>
        </JBSelect>
      </div>
    );
  },
};

export const CustomOption: Story = {
  args: {
    label: "Color List",
    children: <>
      {
        colorList.map((color) => <JBOption key={color.value} value={color}><span style={{ backgroundColor: color.value, marginInlineEnd: '0.5rem', width: '1rem', height: '1rem', borderRadius: '0.5rem' }}></span>{color.name}</JBOption>)
      }
    </>
  }
}

export const CustomSelectedValueRender: Story = {
  args: {
    label: "Color List With Custom Selected Value Render",
    message: "please select a value and see the result",
    getSelectedValueDOM: (option) => {
      const optionElement = document.createElement("div");
      optionElement.classList.add("selected-value");
      optionElement.innerHTML = /*html */`
        <span part="color-box" style="background-color:${option.value};width:32px;height:16px;display:inline-block;"></span>&nbsp;
        <span>Color ${option.name}</span>
      `
      return optionElement;
    },
    children: <>
      {
        colorList.map((color) => <JBOption key={color.value} value={color}><span style={{ backgroundColor: color.value, marginInlineEnd: '0.5rem', width: '1rem', height: '1rem', borderRadius: '0.5rem' }}></span>{color.name}</JBOption>)
      }
    </>
  }
}

export const CustomOptionRender: Story = {
  args: {
    label: "Color List With Custom Option Render callback",
    message: "here we render color list with callback function ",
    getSelectedValueDOM: (option) => {
      const optionElement = document.createElement("div");
      optionElement.classList.add("selected-value");
      optionElement.innerHTML = /*html */`
              <span style="background-color:${option.value};width:16px;height:16px;display:inline-block;"></span>&nbsp;
              <span>Color ${option.name}</span>
            `
      return optionElement;
    },
    children: <>
      {
        <JBOptionList
          optionList={colorList}
          getTitle={(option) => option.name}
          getContentDOM={(option) => {
            const optionElement = document.createElement("div");
            optionElement.classList.add("selected-value");
            optionElement.innerHTML = /*html */`
              <span style="background-color:${option.value};width:16px;height:16px;display:inline-block;"></span>&nbsp;
              <span>Color ${option.name}</span>
            `
            return optionElement;
          }}
        />
      }
    </>
  }
}

export const JBSelectDesignTest: Story = {
  render: () => {
    function getSelectedValueDOM(option: any) {
      const optionElement = document.createElement("div");
      optionElement.classList.add("selected-value");
      optionElement.innerHTML =
        '<span part="color-box" style="background-color:' + option.value +
        ';width:16px;height:16px"></span>' + "&nbsp;" + option.name;
      return optionElement;
    }
    return (
      <div className="select-custom-design">
        <JBSelect
          searchPlaceholder="search color"
          getSelectedValueDOM={getSelectedValueDOM}
        >
          {
            colorList.map((o) => (<JBOption value={o} key={o.value}><span className="color-circle" style={{ backgroundColor: o.value }}></span>{o.name}</JBOption>))
          }
          <div style={{ height: "24px" }} slot="select-arrow-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <title>arrow icon</title>
              <rect width="24" height="24" rx="5" fill="#E7E7E7" />
              <path
                d="M19 8.5L12 15.5L5 8.5"
                stroke="#8B8B8B"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </JBSelect>
      </div>
    );
  },
};

export const BooleanValue: Story = {
  render: () => {
    const [value, setValue] = useState<boolean | null>(null);
    return (
      <JBSelect value={value} onChange={(e) => {
        setValue(e.target.value);
      }}>
        <JBOption value={true}>True</JBOption>
        <JBOption value={false}>False</JBOption>
      </JBSelect>
    )
  }
}
export const MissingOption: Story = {
  render: (args) => {
    const { value } = args
    const [optionList, setOptionList] = useState<typeof persons>([])
    return (
      <div>
        <JBSelect value={value} label="missing option" message="value is already set but options are not available when option available value will be set">
          {
            optionList.map((person) => (
              <JBOption value={person}>{person.name}</JBOption>
            ))
          }
        </JBSelect>
        <JBButton onClick={() => setOptionList(persons)}>Fill Option</JBButton>
      </div>

    )
  },
  args: {
    value: persons[3]
  }
}
