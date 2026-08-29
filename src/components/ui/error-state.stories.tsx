import type { Meta, StoryObj } from '@storybook/react';
import { ErrorState } from './error-state';

const meta = {
  title: 'UI/ErrorState',
  component: ErrorState,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onRetry: { action: 'retried' },
  },
} satisfies Meta<typeof ErrorState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Failed to load data',
  },
};

export const WithCustomDescription: Story = {
  args: {
    title: 'Authentication Error',
    description: 'Your session has expired. Please log in again to continue.',
  },
};

export const WithoutRetry: Story = {
  args: {
    title: 'Access Denied',
    description: 'You do not have permission to view this resource.',
    onRetry: undefined,
  },
};
