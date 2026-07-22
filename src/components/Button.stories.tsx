import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: '元件/Button',
  component: Button,
  tags: ['autodocs', 'ai-generated'],
  args: {
    children: '加入購物車',
    onClick: fn(),
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Primary: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: '加入購物車' })
    await expect(button).toBeEnabled()
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalledOnce()
  },
}

export const Secondary: Story = {
  args: { variant: 'secondary' },
}

export const Disabled: Story = {
  args: { disabled: true },
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole('button', { name: '加入購物車' }),
    ).toBeDisabled()
  },
}
