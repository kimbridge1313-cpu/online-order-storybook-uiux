import type { Preview } from '@storybook/react-vite'
import '../src/styles.css'
import '../src/ui-system/tokens.css'
import '../src/ui-system/ui-system.css'
import '../src/product-app/product-detail-balance.css'

const preview: Preview = {
  parameters: {
    controls: {
      expanded: true,
      sort: 'requiredFirst',
      matchers: { color: /(background|color)$/i, date: /Date$/i },
    },
    a11y: { test: 'todo' },
    options: {
      storySort: {
        order: [
          'Design System',
          ['Foundations', 'Components', 'Pages'],
          '元件',
        ],
      },
    },
    viewport: {
      options: {
        mobile430: {
          name: '手機 430',
          styles: { width: '430px', height: '932px' },
        },
        tablet1440: {
          name: '平板 1440',
          styles: { width: '1440px', height: '1080px' },
        },
      },
    },
  },
}

export default preview
