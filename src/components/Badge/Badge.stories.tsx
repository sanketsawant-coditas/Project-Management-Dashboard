import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'success', 'warning', 'danger', 'info', 'primary', 'secondary'], // add any variants defined in your SCSS
      description: 'Badge style variant (falls back to "default" if class not found)',
    },
    children: {
      control: 'text',
      description: 'Badge content',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

// Default badge
export const Default: Story = {
  args: {
    children: 'Default',
    variant: 'default',
  },
};

// Success badge
export const Success: Story = {
  args: {
    children: 'Success',
    variant: 'success',
  },
};

// Warning badge
export const Warning: Story = {
  args: {
    children: 'Warning',
    variant: 'warning',
  },
};

// Danger badge
export const Danger: Story = {
  args: {
    children: 'Danger',
    variant: 'danger',
  },
};

// Info badge (if you have that style)
export const Info: Story = {
  args: {
    children: 'Info',
    variant: 'info',
  },
};

// Primary badge (example)
export const Primary: Story = {
  args: {
    children: 'Primary',
    variant: 'primary',
  },
};

// Secondary badge
export const Secondary: Story = {
  args: {
    children: 'Secondary',
    variant: 'secondary',
  },
};

// All variants showcase (non‑interactive)
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Badge variant="default">Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="danger">Danger</Badge>
      <Badge variant="info">Info</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="non-existent">Fallback</Badge>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Shows all available variant styles. The last badge uses an undefined variant and falls back to "default".',
      },
    },
  },
};