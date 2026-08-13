import type { Meta, StoryObj } from "@storybook/react-vite";
import { faker } from "@faker-js/faker";
import { useEffect, useRef, useState } from "react";
import { expect, userEvent, waitFor } from "storybook/test";
import type { JBListboxWebComponent } from "jb-select/listbox";
import type { JBOptionWebComponent } from "jb-select/option";
import { JBListbox } from "jb-select/listbox/react";
import { JBOption } from "jb-select/option/react";
import { JBCheckbox } from "jb-checkbox/react";
import { JBInput } from "jb-input/react";
import "jb-icons/search";
import "jb-icons/react";

const StringListbox = JBListbox<string>;
faker.seed(42);
const generatedFilterOptions = faker.helpers.multiple(() => ({ id: faker.string.uuid(), name: faker.company.name() }), { count: 100 });

const meta = {
  title: "Components/form elements/JBListbox",
  component: StringListbox,
  args: {
    label: "Environment",
    name: "environment",
  },
  render: args => (
    <form>
      <StringListbox {...args}>
        <JBOption value="development">Development</JBOption>
        <JBOption value="staging">Staging</JBOption>
        <JBOption value="production">Production</JBOption>
      </StringListbox>
    </form>
  ),
} satisfies Meta<typeof StringListbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    label: "Select an environment",
    message: "Choose one environment",
  },
  play: async ({ canvasElement }) => {
    const listbox = getListbox(canvasElement);
    await userEvent.click(getOptionControl(listbox, 1));
    await waitFor(() => {
      expect(listbox.value).toBe("staging");
      expect(listbox.querySelectorAll<JBOptionWebComponent<string>>("jb-option")[1].selected).toBe(true);
    });
  },
};

export const FilteredOptions: Story = {
  args: {
    label: "company",
    message: "Type to filter the options",
  },
  render: args => {
    const [filter, setFilter] = useState("");
    const listboxRef = useRef<JBListboxWebComponent<string>>(null);

    useEffect(() => {
      listboxRef.current?.dispatchEvent(new CustomEvent("filter-change", { detail: { filterText: filter } }));
    }, [filter]);

    return (
      <form>
        <StringListbox {...args} ref={listboxRef}>
          <JBInput placeholder="Search Company Here" value={filter} onInput={event => setFilter(event.target.value)}>
            <jb-icon-search slot="end-section"  />
          </JBInput>
          <hr style={{ margin: "1rem 0", border: "1px solid #ccc" }} />
          <div style={{ maxHeight: "400px", overflowY: "auto" }}>
            {generatedFilterOptions.map(option => (
              <JBOption key={option.id} value={option.id}>
                {option.name}
              </JBOption>
            ))}
          </div>
        </StringListbox>
      </form>
    );
  },
};

function getListbox(canvasElement: HTMLElement) {
  return canvasElement.querySelector<JBListboxWebComponent<string>>("jb-listbox")!;
}

function getOptionControl(listbox: JBListboxWebComponent<string>, index: number) {
  const option = listbox.querySelectorAll("jb-option")[index];
  return option.shadowRoot!.querySelector<HTMLElement>(".option-content-wrapper")!;
}

export const SingleSelection: Story = {
  args: {
    initialValue: "staging",
  },
  play: async ({ canvasElement }) => {
    const listbox = getListbox(canvasElement);
    const form = canvasElement.querySelector("form")!;

    await waitFor(() => expect(listbox.value).toBe("staging"));
    await userEvent.click(getOptionControl(listbox, 2));

    expect(listbox.value).toBe("production");
    expect(new FormData(form).get("environment")).toBe("production");
    expect(listbox.isDirty).toBe(true);

    form.reset();
    expect(listbox.value).toBe("staging");
    expect(listbox.isDirty).toBe(false);
  },
};

export const MultipleSelection: Story = {
  args: {
    multiple: true,
    name: "teams",
  },
  render: args => (
    <form>
      <StringListbox {...args}>
        <JBOption value="design">Design</JBOption>
        <JBOption value="engineering">Engineering</JBOption>
        <JBOption value="qa">QA</JBOption>
      </StringListbox>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const listbox = getListbox(canvasElement);
    const form = canvasElement.querySelector("form")!;

    await userEvent.click(getOptionControl(listbox, 0));
    await userEvent.click(getOptionControl(listbox, 2));

    expect(listbox.value).toEqual(["design", "qa"]);
    expect(new FormData(form).getAll("teams")).toEqual(["design", "qa"]);

    await userEvent.click(getOptionControl(listbox, 0));
    expect(listbox.value).toEqual(["qa"]);
  },
};

export const MultipleWithCheckbox: Story = {
  args: {
    multiple: true,
    name: "features",
    label: "Features",
  },
  render: args => (
    <form>
      <StringListbox {...args}>
        <JBOption value="analytics">
          <JBCheckbox label="Analytics" />
        </JBOption>
        <JBOption value="notifications">
          <JBCheckbox label="Notifications" />
        </JBOption>
        <JBOption value="billing">
          <JBCheckbox label="Billing" />
        </JBOption>
      </StringListbox>
    </form>
  ),
};

export const SingleWithCheckbox: Story = {
  args: {
    name: "plan",
    label: "Plan",
  },
  render: args => (
    <form>
      <StringListbox {...args}>
        <JBOption value="free">
          <JBCheckbox label="Free" />
        </JBOption>
        <JBOption value="pro">
          <JBCheckbox label="Pro" />
        </JBOption>
        <JBOption value="enterprise">
          <JBCheckbox label="Enterprise" />
        </JBOption>
      </StringListbox>
    </form>
  ),
  play: async ({ canvasElement }) => {
    const listbox = getListbox(canvasElement);
    const checkbox = listbox.querySelectorAll("jb-option")[1].querySelector("jb-checkbox")!;

    await userEvent.click(checkbox.shadowRoot!.querySelector<HTMLElement>(".jb-checkbox-web-component")!);

    expect(listbox.value).toBe("pro");
    expect(listbox.querySelectorAll<JBOptionWebComponent<string>>("jb-option")[1].selected).toBe(true);
  },
};

export const RequiredValidation: Story = {
  args: {
    required: true,
  },
  play: async ({ canvasElement }) => {
    const listbox = getListbox(canvasElement);

    expect(listbox.checkValidity()).toBe(false);
    expect(listbox.reportValidity()).toBe(false);
    expect(listbox.validationMessage).toBeTruthy();

    await userEvent.click(getOptionControl(listbox, 0));
    expect(listbox.checkValidity()).toBe(true);
  },
};

export const KeyboardSelection: Story = {
  play: async ({ canvasElement }) => {
    const listbox = getListbox(canvasElement);
    listbox.focus();
    await userEvent.keyboard("{ArrowDown}{Enter}");
    expect(listbox.value).toBe("staging");
  },
};
