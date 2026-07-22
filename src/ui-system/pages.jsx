import { useState } from 'react'
import { Check, Copy, Download } from 'lucide-react'
import { BrandHeader, CartBar, CategoryTabs, demoProducts, OrderPanel, ProductCard, StoreSelector, TabletCategoryRail } from './components'

function tokenStyles(settings) {
  return {
    '--lam-page-padding': `${settings.pagePadding}px`,
    '--lam-section-gap': `${settings.sectionGap}px`,
    '--lam-product-gap': `${settings.productGap}px`,
    '--lam-glass-opacity': settings.glassOpacity,
    '--lam-glass-blur': `${settings.glassBlur}px`,
    '--lam-light-warm-opacity': settings.warmLight,
    '--lam-light-cool-opacity': settings.coolLight,
    '--lam-light-angle': `${settings.lightAngle}deg`
  }
}

function ConfigActions({ page, config }) {
  const [copied, setCopied] = useState(false)
  const payload = JSON.stringify({ page, version: 1, ...config }, null, 2)

  async function copyConfig() {
    await navigator.clipboard.writeText(payload)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  function downloadConfig() {
    const url = URL.createObjectURL(new Blob([payload], { type: 'application/json' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${page.toLowerCase()}-visual-preset.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="lam-config-actions" aria-label="保存目前視覺設定">
      <button type="button" onClick={copyConfig}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? '已複製' : '複製設定'}</button>
      <button type="button" onClick={downloadConfig}><Download size={16} />下載 JSON</button>
    </div>
  )
}

export function MobileOrderPage({
  pagePadding = 20,
  sectionGap = 18,
  productGap = 16,
  glassOpacity = 0.58,
  glassBlur = 18,
  warmLight = 0.92,
  coolLight = 0.5,
  lightAngle = -8,
  imageRatio = 1.05,
  cardOpacity = 0.46,
  cartHeight = 82,
  cartTopGap = 28,
  cartBottomGap = 18
}) {
  const settings = { pagePadding, sectionGap, productGap, glassOpacity, glassBlur, warmLight, coolLight, lightAngle }
  const config = { ...settings, imageRatio, cardOpacity, cartHeight, cartTopGap, cartBottomGap }
  return (
    <div className="lam-canvas lam-mobile-canvas" style={tokenStyles(settings)}>
      <div className="lam-light-field" aria-hidden="true" />
      <ConfigActions page="M01" config={config} />
      <div className="lam-mobile-shell">
        <BrandHeader />
        <StoreSelector />
        <CategoryTabs />
        <main className="lam-product-grid">
          {demoProducts.map((product) => <ProductCard product={product} imageRatio={imageRatio} cardOpacity={cardOpacity} key={product.id} />)}
        </main>
        <CartBar height={cartHeight} topGap={cartTopGap} bottomGap={cartBottomGap} />
      </div>
    </div>
  )
}

export function TabletOrderPage({
  glassOpacity = 0.58,
  glassBlur = 18,
  warmLight = 0.82,
  coolLight = 0.42,
  lightAngle = -5,
  sidebarWidth = 188,
  orderWidth = 424,
  productGap = 16
}) {
  const settings = { pagePadding: 0, sectionGap: 0, productGap, glassOpacity, glassBlur, warmLight, coolLight, lightAngle }
  const config = { glassOpacity, glassBlur, warmLight, coolLight, lightAngle, sidebarWidth, orderWidth, productGap }
  return (
    <div className="lam-canvas lam-tablet-canvas" style={{ ...tokenStyles(settings), '--lam-sidebar-width': `${sidebarWidth}px`, '--lam-order-width': `${orderWidth}px` }}>
      <div className="lam-light-field" aria-hidden="true" />
      <ConfigActions page="T01" config={config} />
      <BrandHeader tablet />
      <div className="lam-tablet-body">
        <TabletCategoryRail />
        <main className="lam-tablet-products">
          <CategoryTabs categories={['全部', '麵包', '甜點', '飲品', '餐盒']} />
          <div className="lam-tablet-grid">
            {[...demoProducts, ...demoProducts, ...demoProducts.slice(0, 2)].map((product, index) => <ProductCard layout="row" product={product} key={`${product.id}-${index}`} />)}
          </div>
        </main>
        <OrderPanel />
      </div>
    </div>
  )
}
