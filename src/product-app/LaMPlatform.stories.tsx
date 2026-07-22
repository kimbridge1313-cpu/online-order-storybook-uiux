import type { Meta, StoryObj } from '@storybook/react-vite'
import { LaMPlatform } from './LaMPlatform'

const meta = { title: '通用訂餐/Complete Platform', component: LaMPlatform, parameters: { layout: 'fullscreen' }, tags: ['ai-generated'] } satisfies Meta<typeof LaMPlatform>
export default meta
type Story = StoryObj<typeof meta>

export const CustomerMenu: Story = { args: { initialRole: 'customer', initialView: 'menu' } }
export const CustomerStart: Story = { args: { initialRole: 'customer', initialView: 'start' } }
export const CustomerCheckout: Story = { args: { initialRole: 'customer', initialView: 'checkout' } }
export const CustomerSuccess: Story = { args: { initialRole: 'customer', initialView: 'success' } }
export const CounterOrdering: Story = { args: { initialRole: 'counter', initialView: 'counter' } }
export const AdminLogin: Story = { args: { initialRole: 'admin', initialView: 'login' } }
export const AdminDashboard: Story = { args: { initialRole: 'admin', initialView: 'dashboard' } }
export const AdminOrders: Story = { args: { initialRole: 'admin', initialView: 'orders' } }
export const AdminProducts: Story = { args: { initialRole: 'admin', initialView: 'products' } }
export const AdminReports: Story = { args: { initialRole: 'admin', initialView: 'reports' } }
