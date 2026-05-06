import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Components/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger"],
      description: "Button style variant",
    },
    loading: {
      control: "boolean",
      description: "Show loading spinner and disable button",
    },
    disabled: {
      control: "boolean",
      description: "Disable button",
    },
    children: {
      control: "text",
      description: "Button label",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Default button
export const Primary: Story = {
  args: {
    children: "Primary Button",
    variant: "primary",
  },
};

// Secondary button
export const Secondary: Story = {
  args: {
    children: "Secondary Button",
    variant: "secondary",
  },
};

// Danger button
export const Danger: Story = {
  args: {
    children: "Danger Button",
    variant: "danger",
  },
};

// Loading state
export const Loading: Story = {
  args: {
    children: "Submit",
    loading: true,
  },
};

// Disabled state
export const Disabled: Story = {
  args: {
    children: "Disabled Button",
    disabled: true,
  },
};

// All variants showcase
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "1rem" }}>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="danger">Danger</Button>
    </div>
  ),
};
