/* eslint-disable indent */
import type React from 'react';
import { Fragment, useEffect, useState } from 'react';
import { JBSelect, JBOptionList, JBOption, type Props, type JBSelectEventType } from 'jb-select/react';
import './styles/style.css'
import type { Meta, StoryObj } from '@storybook/react';
import { colorList, nameList, numberOptionList, persons } from './constants';

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

export const WithValue: Story = {
  args: {
    label: 'select from menu',
    message: "please select a value",
    placeholder: "placeholder",
    value: nameList[3],
    children: <JBOptionList optionList={nameList} />
  }
};

export const OptionObject: Story = {
  args: {
    label: 'select from menu',
    children: <JBOptionList optionList={[{ name: 'peter', family: 'hanan', userId: 1 }, { name: 'reza', family: 'asadi', userId: 2 }]} getTitle={(option) => `${option.name} ${option.family}`} getValue={(option) => option.userId} />,
    onChange: (e) => { console.log('onChange', e.target.value); }
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
      <JBSelect label='xl size' message="message underneath" size='xl'></JBSelect>
      <JBSelect label='xl size' placeholder="placeholder" size='xl'>{options}</JBSelect>
      <JBSelect label='xl size' value={persons[0]} size='xl'>{options}</JBSelect>

      <JBSelect label='lg size' message="message underneath" size='lg'></JBSelect>
      <JBSelect label='lg size' placeholder="placeholder" size='lg'>{options}</JBSelect>
      <JBSelect label='lg size' value={persons[0]} size='lg'>{options}</JBSelect>

      <JBSelect label='md size' message="message underneath" size='md'></JBSelect>
      <JBSelect label='md size' placeholder="placeholder" size='md'>{options}</JBSelect>
      <JBSelect label='md size' value={persons[0]} size='md'>{options}</JBSelect>

      <JBSelect label='sm size' message="message underneath" size='sm'></JBSelect>
      <JBSelect label='sm size' placeholder="placeholder" size='sm'>{options}</JBSelect>
      <JBSelect label='sm size' value={persons[0]} size='sm'>{options}</JBSelect>

      <JBSelect label='xs size' message="message underneath" size='xs'></JBSelect>
      <JBSelect label='xs size' placeholder="placeholder" size='xs'>{options}</JBSelect>
      <JBSelect label='xs size' value={persons[0]} size='xs'>{options}</JBSelect>
    </div>)
  }
}
export const OverflowTest: Story = {
  render: () => {
    return <div style={{height:'10rem', overflowY:"auto"}}>
      <JBSelect label='overflow test' style={{width:"10rem"}}>
        {
          persons.map((p) => <JBOption key={p.userId} value={p}>{p.name}</JBOption>)
        }
      </JBSelect>
      <div style={{height:'20rem', background:'red'}}></div>
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

export const StyleTest: Story = {
  render: (args) => {
    return (
      <div>
        <div className="filter-select-style-1">
          <JBSelect {...args}><JBOptionList optionList={numberOptionList} /></JBSelect>
        </div>
        <div className='style-table-title-1'>JB Select Custom Style 1</div>
        <div className='style-table-content-1'>
          --jb-select-margin: 0px 2px;<br /><br />
          --jb-select-rounded: 24px;<br /><br />
          --jb-select-border-color: royalblue;<br /><br />
          --jb-select-border-color-selected: tomato;<br /><br />
          --jb-select-bgcolor: mintcream;
        </div>
        <br /><br />
        <div className="filter-select-style-2">
          <JBSelect {...args}><JBOptionList optionList={numberOptionList} /></JBSelect>
        </div>
        <div className='style-table-title-2'>JB Select Custom Style 2</div>
        <div className='style-table-content-2'>
          --jb-select-margin: 0px 4px;<br /><br />
          --jb-select-rounded: 0px;<br /><br />
          --jb-select-border-color: rgb(26, 23, 23);<br /><br />
          --jb-select-border-color-selected: rgb(30, 29, 43);<br /><br />
          --jb-select-bgcolor-selected: rgb(195, 57, 230);<br /><br />
          --jb-select-bgcolor: lightgray;<br /><br />
          --jb-select-mobile-search-input-height: 64px;<br /><br />
          --jb-select-border-bottom-width:1px;<br /><br />
          --jb-select-mobile-item-list-border-radius:16px;
        </div>
        <br /><br />
        <div className="self-style-wrapper">
          <JBSelect className="self-style-select" label="self style" message="this select get classname itself and style are not set to parent element"><JBOptionList optionList={numberOptionList} /></JBSelect>
        </div>
        <div className='style-table-title-2'>JB Select Custom Style 2</div>
        <div className='style-table-content-2'>
          --jb-select-margin: 0px 4px;<br /><br />
          --jb-select-rounded: 0px;<br /><br />
          --jb-select-border-color: rgb(26, 23, 23);<br /><br />
          --jb-select-border-color-selected: rgb(30, 29, 43);<br /><br />
          --jb-select-bgcolor-selected: rgb(195, 57, 230);<br /><br />
          --jb-select-bgcolor: lightgray;
        </div>
        <br /><br />
        <div className="with-divider-line">
          <JBSelect className="self-style-select" label="self style" message="this select get classname itself and style are not set to parent element"><JBOptionList optionList={numberOptionList} /></JBSelect>
        </div>
        <div className='style-table-title-2'>JB Select Custom Style 3</div>
        <div className='style-table-content-2'>
          --jb-select-margin: 0px 4px;<br /><br />
          --jb-select-rounded: 0px;<br /><br />
          --jb-select-border-color: rgb(26, 23, 23);<br /><br />
          --jb-select-border-color-selected: rgb(30, 29, 43);<br /><br />
          --jb-select-bgcolor-selected: rgb(195, 57, 230);<br /><br />
          --jb-select-bgcolor: lightgray;
        </div>
      </div>
    );
  },
  args: {
    label: `Select Option`,
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