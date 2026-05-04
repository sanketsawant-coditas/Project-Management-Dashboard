import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Components/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    label: {
      control: "text",
      description: "Label text above the input",
    },
    error: {
      control: "text",
      description: "Error message displayed below the input",
    },
    placeholder: {
      control: "text",
      description: "Placeholder text",
    },
    disabled: {
      control: "boolean",
      description: "Disable the input",
    },
    required: {
      control: "boolean",
      description: "Mark as required",
    },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "date"],
      description: "Input type",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

// Default input
export const Default: Story = {
  args: {
    placeholder: "Enter text...",
  },
};

// With label
export const WithLabel: Story = {
  args: {
    label: "Email Address",
    placeholder: "user@example.com",
  },
};

// With error
export const WithError: Story = {
  args: {
    label: "Password",
    placeholder: "Enter password",
    error: "Password must be at least 6 characters",
  },
};

// Disabled
export const Disabled: Story = {
  args: {
    label: "Disabled Field",
    placeholder: "Cannot edit",
    disabled: true,
  },
};

// Required
export const Required: Story = {
  args: {
    label: "Required Field",
    placeholder: "This field is required",
    required: true,
  },
};

// Email type
export const EmailType: Story = {
  args: {
    label: "Email",
    type: "email",
    placeholder: "name@company.com",
  },
};

// Password type
export const PasswordType: Story = {
  args: {
    label: "Password",
    type: "password",
    placeholder: "Enter password",
  },
};
