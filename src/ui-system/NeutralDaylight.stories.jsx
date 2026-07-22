import { CartBar, demoProducts, GlassPanel, ProductCard } from './components'
import { MobileOrderPage, TabletOrderPage } from './pages'

const meta = {
  title: 'Design System/Foundations/Neutral Daylight',
  parameters: { layout: 'fullscreen' },
  tags: ['autodocs']
}

export default meta

export const Tokens = {
  render: () => (
    <div style={{ minHeight: '100vh', padding: 32, background: 'var(--lam-color-canvas)' }}>
      <h1>Neutral Daylight Tokens</h1>
      <p>這些不是單頁數值，而是所有系統共用的視覺語言。</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16, marginTop: 28 }}>
        {[['Canvas', '#f1f2f0'], ['Surface', '#ffffff'], ['Ink', '#242a27'], ['Muted', '#626b66'], ['Brand', '#315d3b'], ['Warm light', '#fff9eb'], ['Cool bounce', '#d6e0e2']].map(([name, color]) => <GlassPanel key={name} style={{ borderRadius: 16, padding: 16 }}><div style={{ height: 96, borderRadius: 10, background: color }} /><strong style={{ display: 'block', marginTop: 12 }}>{name}</strong><code>{color}</code></GlassPanel>)}
      </div>
    </div>
  )
}

export const GlassMaterial = {
  args: { opacity: 0.31, blur: 6, radius: 18 },
  argTypes: {
    opacity: { control: { type: 'range', min: 0.2, max: 0.9, step: 0.01 }, name: '透明度' },
    blur: { control: { type: 'range', min: 0, max: 40, step: 1 }, name: '背景模糊' },
    radius: { control: { type: 'range', min: 0, max: 32, step: 1 }, name: '圓角' }
  },
  render: ({ opacity, blur, radius }) => <div className="lam-canvas" style={{ minHeight: 600, padding: 80 }}><div className="lam-light-field" /><GlassPanel style={{ maxWidth: 460, minHeight: 220, margin: '0 auto', padding: 28, borderRadius: radius, '--lam-glass-opacity': opacity, '--lam-glass-blur': `${blur}px` }}><h2>半透明，但不犧牲清晰度</h2><p>光影屬於背景，卡片只承接環境，不搶走商品本身。</p></GlassPanel></div>
}

export const ProductCardPlayground = {
  args: { product: demoProducts[0], imageRatio: 1.15, cardOpacity: 0.27, showDescription: true },
  argTypes: {
    product: { control: 'object', name: '商品資料' },
    imageRatio: { control: { type: 'range', min: 0.7, max: 1.5, step: 0.05 }, name: '圖片比例' },
    cardOpacity: { control: { type: 'range', min: 0.2, max: 0.85, step: 0.01 }, name: '卡片透明度' },
    showDescription: { control: 'boolean', name: '顯示商品描述' }
  },
  render: (args) => <div className="lam-canvas" style={{ minHeight: 700, padding: 60 }}><div className="lam-light-field" /><div style={{ width: 190, margin: '0 auto' }}><ProductCard {...args} /></div></div>
}

export const CartBarPlayground = {
  args: { count: 2, total: 280, height: 82, topGap: 28, bottomGap: 18 },
  argTypes: {
    height: { control: { type: 'range', min: 68, max: 110, step: 1 }, name: '購物車高度' },
    topGap: { control: { type: 'range', min: 8, max: 64, step: 1 }, name: '與商品區距離' },
    bottomGap: { control: { type: 'range', min: 8, max: 48, step: 1 }, name: '底部距離' }
  },
  render: (args) => <div className="lam-canvas" style={{ minHeight: 500, padding: 20 }}><div className="lam-light-field" /><div style={{ maxWidth: 390, margin: '200px auto 0' }}><CartBar {...args} /></div></div>
}

const pageControls = {
  pagePadding: { control: { type: 'range', min: 12, max: 36, step: 1 }, name: '頁面左右留白' },
  sectionGap: { control: { type: 'range', min: 8, max: 40, step: 1 }, name: '區塊間距' },
  productGap: { control: { type: 'range', min: 8, max: 32, step: 1 }, name: '商品卡片間距' },
  glassOpacity: { control: { type: 'range', min: 0.25, max: 0.85, step: 0.01 }, name: '玻璃透明度' },
  glassBlur: { control: { type: 'range', min: 0, max: 40, step: 1 }, name: '玻璃模糊' },
  warmLight: { control: { type: 'range', min: 0, max: 1, step: 0.02 }, name: '暖光強度' },
  coolLight: { control: { type: 'range', min: 0, max: 1, step: 0.02 }, name: '冷光強度' },
  lightAngle: { control: { type: 'range', min: -30, max: 30, step: 1 }, name: '光線角度' }
}

export const M01MobileOrder = {
  args: { pagePadding: 20, sectionGap: 18, productGap: 23, glassOpacity: 0.68, glassBlur: 18, warmLight: 0.12, coolLight: 0.68, lightAngle: -30, imageRatio: 1.3, cardOpacity: 0.71, cartHeight: 82, cartTopGap: 8, cartBottomGap: 18 },
  argTypes: { ...pageControls, imageRatio: { control: { type: 'range', min: 0.75, max: 1.35, step: 0.05 }, name: '商品圖片比例' }, cardOpacity: { control: { type: 'range', min: 0.2, max: 0.8, step: 0.01 }, name: '商品卡片透明度' }, cartHeight: { control: { type: 'range', min: 68, max: 110, step: 1 }, name: '購物車高度' }, cartTopGap: { control: { type: 'range', min: 8, max: 64, step: 1 }, name: '購物車上方距離' }, cartBottomGap: { control: { type: 'range', min: 8, max: 48, step: 1 }, name: '購物車底部距離' } },
  parameters: { viewport: { defaultViewport: 'mobile430' } },
  render: (args) => <MobileOrderPage {...args} />
}

export const T01TabletCounter = {
  args: { glassOpacity: 0.25, glassBlur: 25, warmLight: 0.88, coolLight: 0.38, lightAngle: 9, sidebarWidth: 158, orderWidth: 408, productGap: 23 },
  argTypes: { ...pageControls, pagePadding: { table: { disable: true } }, sectionGap: { table: { disable: true } }, sidebarWidth: { control: { type: 'range', min: 150, max: 240, step: 2 }, name: '左側分類寬度' }, orderWidth: { control: { type: 'range', min: 360, max: 500, step: 2 }, name: '右側訂單寬度' } },
  parameters: { viewport: { defaultViewport: 'tablet1440' } },
  render: (args) => <TabletOrderPage {...args} />
}
