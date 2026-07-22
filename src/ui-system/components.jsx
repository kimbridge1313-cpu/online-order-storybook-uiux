import { ChevronDown, ChevronRight, MapPin, Menu, Plus, Search, ShoppingBag } from 'lucide-react'

export const demoProducts = [
  { id: 'bread', name: '鄉村酸種麵包', description: '外酥內軟，麥香帶有淡淡果香', category: '麵包', price: 120, image: '/preview-products/bread.png' },
  { id: 'tart', name: '綜合水果塔', description: '新鮮季節水果，酸甜多層次', category: '甜點', price: 150, image: '/preview-products/tart.png' },
  { id: 'tea', name: '日月潭紅玉紅茶', description: '台茶十八號紅玉，香氣甘潤', category: '飲品', price: 60, image: '/preview-products/tea.png' },
  { id: 'meal', name: '舒肥雞胸餐盒', description: '嫩煮雞胸搭配時蔬，清爽無負擔', category: '餐盒', price: 160, image: '/preview-products/meal.png' }
]

export function formatPrice(value) {
  return `NT$ ${Number(value).toLocaleString('zh-TW')}`
}

export function GlassPanel({ as: Element = 'div', className = '', children, ...props }) {
  return <Element className={`lam-glass ${className}`.trim()} {...props}>{children}</Element>
}

export function BrandHeader({ tablet = false }) {
  return (
    <header className={`lam-header ${tablet ? 'is-tablet' : ''}`}>
      <div className="lam-brand">
        <span className="lam-brand-mark">LàM</span>
        {!tablet && <strong>LàM</strong>}
        {tablet && <span className="lam-store-compact">成龍捌貳 <ChevronDown size={16} /></span>}
      </div>
      {tablet ? <h1>櫃檯點餐</h1> : null}
      <div className="lam-header-actions">
        {tablet && <button type="button"><Search size={20} />搜尋</button>}
        <button type="button"><ShoppingBag size={23} />{tablet ? '掃碼' : null}</button>
        <button type="button"><Menu size={25} />{tablet ? '林店員' : null}</button>
      </div>
    </header>
  )
}

export function StoreSelector({ store = '成龍捌貳', hours = '07:30–19:00' }) {
  return (
    <GlassPanel className="lam-store-selector">
      <div><MapPin size={23} /><strong>{store}</strong><ChevronDown size={19} /></div>
      <div className="lam-store-hours"><span>營業中</span><time>{hours}</time><ChevronRight size={19} /></div>
    </GlassPanel>
  )
}

export function CategoryTabs({ categories = ['全部', '麵包', '甜點', '飲品'], active = '全部' }) {
  return (
    <GlassPanel as="nav" className="lam-category-tabs" aria-label="商品分類">
      {categories.map((category) => <button className={category === active ? 'is-active' : ''} type="button" key={category}>{category}</button>)}
    </GlassPanel>
  )
}

export function ProductCard({ product = demoProducts[0], layout = 'grid', imageRatio = 1.05, cardOpacity = 0.46, showDescription = true }) {
  return (
    <GlassPanel
      as="article"
      className={`lam-product-card is-${layout}`}
      style={{ '--lam-product-ratio': imageRatio, '--lam-card-opacity': cardOpacity }}
    >
      <div className="lam-product-image"><img src={product.image} alt={product.name} /></div>
      <div className="lam-product-copy">
        <h2>{product.name}</h2>
        {showDescription && <p>{product.description}</p>}
        <div><strong>{formatPrice(product.price)}</strong><button type="button" aria-label={`加入${product.name}`}><Plus size={21} /></button></div>
      </div>
    </GlassPanel>
  )
}

export function CartBar({ count = 2, total = 280, height = 82, topGap = 28, bottomGap = 18 }) {
  return (
    <GlassPanel className="lam-cart-bar" style={{ '--lam-cart-height': `${height}px`, '--lam-cart-top-gap': `${topGap}px`, '--lam-cart-bottom-gap': `${bottomGap}px` }}>
      <div className="lam-cart-symbol"><ShoppingBag size={25} /><b>{count}</b></div>
      <div className="lam-cart-total"><span>購物車 <em>{count} 件</em></span><strong>{formatPrice(total)}</strong></div>
      <button className="lam-primary" type="button">前往結帳 <ChevronRight size={20} /></button>
    </GlassPanel>
  )
}

export function TabletCategoryRail({ active = '全部' }) {
  const categories = ['全部', '麵包', '甜點', '飲品', '餐盒']
  return <GlassPanel as="nav" className="lam-tablet-rail">{categories.map((item) => <button className={item === active ? 'is-active' : ''} key={item}>{item}</button>)}</GlassPanel>
}

export function OrderPanel() {
  return (
    <GlassPanel as="aside" className="lam-order-panel">
      <div className="lam-order-title"><h2>餐點清單</h2><button type="button">清空</button></div>
      {demoProducts.slice(0, 3).map((product) => (
        <div className="lam-order-row" key={product.id}>
          <img src={product.image} alt="" />
          <div><strong>{product.name}</strong><span>{formatPrice(product.price)}</span><div className="lam-quantity">−　1　＋</div></div>
          <b>{formatPrice(product.price)}</b>
        </div>
      ))}
      <section className="lam-order-options"><span>用餐方式</span><div><button className="is-active">內用</button><button>外帶自取</button></div><p>桌號 <b>−　3　＋</b></p><p>優惠折扣 <b>選擇優惠　›</b></p></section>
      <div className="lam-order-total"><p><span>商品小計</span><b>NT$ 330</b></p><p><span>優惠折扣</span><b className="is-discount">−NT$ 60</b></p><strong><span>總計</span><b>NT$ 270</b></strong></div>
      <button className="lam-primary lam-create-order">建立訂單</button>
    </GlassPanel>
  )
}
