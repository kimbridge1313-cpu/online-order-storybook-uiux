import { useMemo, useState } from 'react'
import {
  BarChart3, Check, ChevronDown, ChevronLeft, ChevronRight, ClipboardList, LayoutDashboard, LogOut,
  LockKeyhole, MapPin, Menu, MessageCircle, Minus, Package, Plus, Search, Settings, ShoppingBag, Store,
  UserRound, X,
} from 'lucide-react'
import './lam-platform.css'

export type PlatformRole = 'customer' | 'counter' | 'admin'
export type PlatformView =
  | 'start' | 'menu' | 'checkout' | 'success'
  | 'counter'
  | 'login' | 'dashboard' | 'orders' | 'products' | 'reports' | 'settings'

type Product = {
  id: string
  name: string
  description: string
  category: string
  price: number
  image: string
  available: boolean
  optionGroups?: ProductOptionGroup[]
}

type ProductOption = { id: string; name: string; priceDelta: number }
type ProductOptionGroup = { id: string; name: string; type: 'single' | 'multiple'; required: boolean; options: ProductOption[] }

type CartLine = Product & { quantity: number }

const products: Product[] = [
  { id: 'bread', name: '鄉村酸種麵包', description: '外酥內軟，麥香帶有淡淡果香', category: '麵包', price: 120, image: '/preview-products/bread.png', available: true },
  { id: 'tart', name: '綜合水果塔', description: '新鮮季節水果，酸甜多層次', category: '甜點', price: 150, image: '/preview-products/tart.png', available: true },
  { id: 'tea', name: '日月潭紅玉紅茶', description: '台茶十八號紅玉，香氣甘潤', category: '飲品', price: 60, image: '/preview-products/tea.png', available: true, optionGroups: [
    { id: 'temperature', name: '溫度', type: 'single', required: true, options: [{ id: 'cold', name: '冷', priceDelta: 0 }, { id: 'hot', name: '熱', priceDelta: 0 }] },
    { id: 'sweetness', name: '甜度', type: 'single', required: true, options: [{ id: 'less-sugar', name: '少甜', priceDelta: 0 }, { id: 'no-sugar', name: '無糖', priceDelta: 0 }] },
  ] },
  { id: 'meal', name: '舒肥雞胸餐盒', description: '嫩煮雞胸搭配時蔬，清爽無負擔', category: '餐盒', price: 160, image: '/preview-products/meal.png', available: true },
]

const customerStores = [
  { id: 'chenglong', name: '成龍捌貳', address: '台北市中山區松江路 82 號', hours: '07:30–19:00', distance: '目前門店' },
  { id: 'minsheng', name: '民生門市', address: '台北市松山區民生東路三段 108 號', hours: '08:00–19:30', distance: '1.2 km' },
  { id: 'daan', name: '大安門市', address: '台北市大安區信義路四段 26 號', hours: '08:30–20:00', distance: '2.6 km' },
]

const orders = [
  { id: '#A1048', customer: '陳小姐', channel: 'LINE', items: 3, total: 430, status: '待接單', time: '11:42' },
  { id: '#A1047', customer: '林先生', channel: '櫃檯', items: 2, total: 280, status: '製作中', time: '11:36' },
  { id: '#A1046', customer: '王小姐', channel: 'LINE', items: 4, total: 520, status: '可取餐', time: '11:20' },
  { id: '#A1045', customer: '張先生', channel: '櫃檯', items: 1, total: 160, status: '已完成', time: '10:58' },
]

const money = (value: number) => `NT$ ${value.toLocaleString('zh-TW')}`

export interface LaMPlatformProps {
  initialRole?: PlatformRole
  initialView?: PlatformView
}

function Brand({ compact = false, label = '品牌名稱', mark = 'LOGO' }: { compact?: boolean; label?: string; mark?: string }) {
  return <div className="lp-brand"><span aria-label="品牌標誌">{mark}</span>{!compact && <strong>{label}</strong>}</div>
}

function Quantity({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  return (
    <div className="lp-quantity">
      <button type="button" aria-label="減少數量" onClick={() => onChange(Math.max(0, value - 1))}><Minus size={14} /></button>
      <b>{value}</b>
      <button type="button" aria-label="增加數量" onClick={() => onChange(value + 1)}><Plus size={14} /></button>
    </div>
  )
}

function ProductTile({ product, quantity, onAdd, onOpen, counter = false }: { product: Product; quantity: number; onAdd: () => void; onOpen?: () => void; counter?: boolean }) {
  return (
    <article className={`lp-product ${counter ? 'is-counter' : ''}`} onClick={onOpen}>
      <img src={product.image} alt={product.name} />
      <div className="lp-product__copy">
        <small>{product.category}</small>
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div><strong>{money(product.price)}</strong><button type="button" onClick={event => { event.stopPropagation(); onAdd() }} aria-label={`加入${product.name}`}><Plus size={18} />{quantity > 0 && <b>{quantity}</b>}</button></div>
      </div>
    </article>
  )
}

function ProductDetail({ product, quantity, onClose, onAdd }: { product: Product; quantity: number; onClose: () => void; onAdd: () => void }) {
  const [selections, setSelections] = useState<Record<string, string[]>>({})
  const [note, setNote] = useState('')
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [error, setError] = useState('')
  const optionGroups = product.optionGroups || []
  const optionPrice = optionGroups.reduce((sum, group) => sum + group.options.filter(option => (selections[group.id] || []).includes(option.id)).reduce((groupSum, option) => groupSum + option.priceDelta, 0), 0)
  const subtotal = (product.price + optionPrice) * orderQuantity

  function toggleOption(group: ProductOptionGroup, optionId: string) {
    setError('')
    setSelections(current => {
      if (group.type === 'single') return { ...current, [group.id]: [optionId] }
      const selected = current[group.id] || []
      return { ...current, [group.id]: selected.includes(optionId) ? selected.filter(id => id !== optionId) : [...selected, optionId] }
    })
  }

  function submit() {
    const missing = optionGroups.find(group => group.required && !(selections[group.id] || []).length)
    if (missing) return setError(`請選擇「${missing.name}」`)
    for (let index = 0; index < orderQuantity; index += 1) onAdd()
  }

  return <div className="lp-product-detail" role="dialog" aria-modal="true" aria-label={`${product.name}商品資訊`}><button className="lp-product-detail__backdrop" type="button" aria-label="關閉商品資訊" onClick={onClose} /><section className="lp-product-detail__sheet"><span className="lp-product-detail__handle" /><header><button type="button" onClick={onClose} aria-label="返回商品列表"><ChevronLeft size={22} /></button><strong>商品資訊</strong><span /></header><main><section className="lp-product-detail__intro"><img src={product.image} alt={product.name} /><div className="lp-product-detail__copy"><small>{product.category}</small><h1>{product.name}</h1><p>{product.description}</p><div><strong>{money(product.price)}</strong><span>今日供應</span></div></div></section>{optionGroups.length > 0 && <section className="lp-product-options">{optionGroups.map(group => <fieldset key={group.id}><legend>{group.name}<span>{group.required ? '必選' : '選填'} · {group.type === 'single' ? '單選' : '多選'}</span></legend><div>{group.options.map(option => { const selected = (selections[group.id] || []).includes(option.id); return <button className={selected ? 'is-active' : ''} type="button" onClick={() => toggleOption(group, option.id)} key={option.id}><span>{option.name}{option.priceDelta > 0 && <small>+{money(option.priceDelta)}</small>}</span>{selected && <Check size={15} />}</button> })}</div></fieldset>)}</section>}<section className="lp-product-note"><label><span>商品備註</span><textarea value={note} onChange={event => setNote(event.target.value)} placeholder="例如：不要蔥、餐點分開裝" /></label><div><span>數量</span><Quantity value={orderQuantity} onChange={value => setOrderQuantity(Math.max(1, value))} /></div>{error && <p>{error}</p>}</section></main><footer><button className="lp-primary" type="button" onClick={submit}>加入購物車 · {money(subtotal)}{quantity > 0 && <span>（購物車已有 {quantity}）</span>}<Plus size={18} /></button></footer></section></div>
}

function CustomerHeader({ cartCount, onCart }: { cartCount: number; onCart: () => void }) {
  return (
    <header className="lp-customer-header">
      <Brand />
      <nav><button type="button">菜單</button><button type="button">我的訂單</button></nav>
      <div><button className="lp-header-search" type="button" aria-label="搜尋"><Search size={21} /></button><button type="button" aria-label={`購物車 ${cartCount} 件`} onClick={onCart}><ShoppingBag size={22} />{cartCount > 0 && <b>{cartCount}</b>}</button><button className="lp-header-menu" type="button" aria-label="開啟選單"><Menu size={23} /></button></div>
    </header>
  )
}

function CustomerStart({ onStart }: { onStart: () => void }) {
  const [lineConnected, setLineConnected] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')

  return <div className="lp-customer lp-customer-start lp-canvas">
    <CustomerHeader cartCount={0} onCart={() => {}} />
    <main>
      <header className="lp-start-intro">
        <h1>開始點餐</h1>
        <p>我們會使用 LINE 傳送訂單更新、取餐提醒與優惠訊息，不會在未經同意的情況下傳送其他訊息。</p>
      </header>

      <section className="lp-start-step">
        <header><b>1</b><h2>連結 LINE 帳號</h2></header>
        <div className="lp-start-card lp-line-card">
          <div className="lp-line-profile"><span><UserRound size={32} /></span><div><strong>使用您的 LINE 接收訂單通知</strong><p>快速、安全，讓取餐更順利</p></div></div>
          <button className={lineConnected ? 'is-connected' : ''} type="button" onClick={() => setLineConnected(value => !value)}><MessageCircle size={22} /><span>{lineConnected ? 'LINE 已連結' : '使用 LINE 開始'}</span>{lineConnected && <Check size={18} />}</button>
        </div>
      </section>

      <section className="lp-start-step">
        <header><b>2</b><div><h2>顧客資料</h2><p>請填寫聯絡資料，以便我們與您聯繫</p></div></header>
        <div className="lp-start-card lp-customer-fields">
          <label><span>姓名</span><input value={name} onChange={event => setName(event.target.value)} placeholder="請輸入姓名" autoComplete="name" /></label>
          <label><span>手機號碼</span><input value={phone} onChange={event => setPhone(event.target.value)} placeholder="請輸入手機號碼" inputMode="tel" autoComplete="tel" /></label>
        </div>
      </section>

      <p className="lp-start-privacy"><LockKeyhole size={15} />您的資料將使用於訂單聯繫與服務通知，我們將妥善保護您的個資。</p>
      <button className="lp-primary lp-start-submit" type="button" onClick={onStart}>儲存並開始點餐<ChevronRight size={20} /></button>
      <button className="lp-start-later" type="button" onClick={onStart}>稍後再說</button>
    </main>
  </div>
}

function CartSummary({ lines, onQuantity, onCheckout, buttonLabel = '前往結帳' }: { lines: CartLine[]; onQuantity: (id: string, value: number) => void; onCheckout: () => void; buttonLabel?: string }) {
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
  return (
    <aside className="lp-cart-panel">
      <div className="lp-panel-title"><div><small>YOUR ORDER</small><h2>餐點清單</h2></div><span>{lines.reduce((sum, line) => sum + line.quantity, 0)} 件</span></div>
      <div className="lp-cart-lines">
        {lines.length === 0 && <div className="lp-empty"><ShoppingBag size={30} /><p>尚未加入商品</p><small>從菜單挑選今天想吃的餐點。</small></div>}
        {lines.map(line => <div className="lp-cart-line" key={line.id}><img src={line.image} alt="" /><div><strong>{line.name}</strong><span>{money(line.price)}</span><Quantity value={line.quantity} onChange={value => onQuantity(line.id, value)} /></div><b>{money(line.price * line.quantity)}</b></div>)}
      </div>
      <div className="lp-cart-total"><p><span>商品小計</span><b>{money(total)}</b></p><p><span>優惠折扣</span><b className="is-discount">− NT$ 0</b></p><strong><span>總計</span><b>{money(total)}</b></strong></div>
      <button className="lp-primary" type="button" disabled={!lines.length} onClick={onCheckout}>{buttonLabel}<ChevronRight size={18} /></button>
    </aside>
  )
}

function CustomerMenu({ lines, add, update, goCheckout }: { lines: CartLine[]; add: (p: Product) => void; update: (id: string, value: number) => void; goCheckout: () => void }) {
  const [category, setCategory] = useState('全部')
  const [cartOpen, setCartOpen] = useState(false)
  const [storeOpen, setStoreOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedStoreId, setSelectedStoreId] = useState(customerStores[0].id)
  const selectedStore = customerStores.find(store => store.id === selectedStoreId) || customerStores[0]
  const visible = category === '全部' ? products : products.filter(p => p.category === category)
  return (
    <div className="lp-customer lp-canvas">
      <CustomerHeader cartCount={lines.reduce((s, x) => s + x.quantity, 0)} onCart={() => setCartOpen(true)} />
      <main className="lp-customer-main">
        <button className="lp-store-info" type="button" aria-label={`選擇門店，目前為${selectedStore.name}`} onClick={() => setStoreOpen(true)}>
          <span className="lp-store-info__store">
            <MapPin size={21} />
            <strong>{selectedStore.name}</strong>
            <ChevronDown size={18} />
          </span>
          <span className="lp-store-info__hours">
            <b>營業中</b>
            <time>{selectedStore.hours}</time>
          </span>
          <ChevronRight className="lp-store-info__next" size={19} />
        </button>
        <nav className="lp-tabs" aria-label="商品分類">{['全部', '麵包', '甜點', '飲品'].map(item => <button type="button" className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}</nav>
        <section className="lp-product-grid">{visible.map(product => <ProductTile product={product} quantity={lines.find(x => x.id === product.id)?.quantity || 0} onAdd={() => add(product)} onOpen={() => setSelectedProduct(product)} key={product.id} />)}</section>
      </main>
      {selectedProduct && <ProductDetail product={selectedProduct} quantity={lines.find(line => line.id === selectedProduct.id)?.quantity || 0} onClose={() => setSelectedProduct(null)} onAdd={() => add(selectedProduct)} />}
      {lines.length > 0 && <button className="lp-floating-cart" type="button" onClick={() => setCartOpen(true)}><span><ShoppingBag size={20} />{lines.reduce((s, x) => s + x.quantity, 0)} 件</span><strong>{money(lines.reduce((s, x) => s + x.price * x.quantity, 0))}</strong><ChevronRight size={18} /></button>}
      {storeOpen && <div className="lp-store-picker" role="dialog" aria-modal="true" aria-labelledby="store-picker-title"><button className="lp-store-picker__backdrop" type="button" aria-label="關閉門店選擇" onClick={() => setStoreOpen(false)} /><section className="lp-store-picker__sheet"><span className="lp-store-picker__handle" /><header><div><small>SELECT A STORE</small><h2 id="store-picker-title">選擇門店</h2></div><button type="button" aria-label="關閉" onClick={() => setStoreOpen(false)}><X size={20} /></button></header><div className="lp-store-picker__list">{customerStores.map(store => <button className={store.id === selectedStoreId ? 'is-active' : ''} type="button" onClick={() => { setSelectedStoreId(store.id); setStoreOpen(false) }} key={store.id}><MapPin size={20} /><span><strong>{store.name}</strong><small>{store.address}</small><em><b>營業中</b>{store.hours}</em></span><span>{store.id === selectedStoreId ? <Check size={18} /> : store.distance}</span></button>)}</div></section></div>}
      {cartOpen && <div className="lp-drawer"><button className="lp-drawer__backdrop" aria-label="關閉購物車" onClick={() => setCartOpen(false)} /><div className="lp-drawer__panel"><button className="lp-close" aria-label="關閉" onClick={() => setCartOpen(false)}><X /></button><CartSummary lines={lines} onQuantity={update} onCheckout={goCheckout} /></div></div>}
    </div>
  )
}

function Checkout({ lines, update, onBack, onSubmit }: { lines: CartLine[]; update: (id: string, value: number) => void; onBack: () => void; onSubmit: () => void }) {
  return <div className="lp-checkout lp-canvas"><CustomerHeader cartCount={lines.reduce((s, x) => s + x.quantity, 0)} onCart={() => {}} /><main><button className="lp-text-button" onClick={onBack}>← 返回菜單</button><div className="lp-checkout-grid"><section><small>CHECKOUT · M02</small><h1>確認訂單</h1><div className="lp-form-card"><h2>取餐資訊</h2><div className="lp-segment"><button className="is-active">外帶自取</button><button>內用</button></div><label><span>取餐門市</span><select defaultValue="songjiang"><option value="songjiang">成龍捌貳 · 松江店</option></select></label><label><span>取餐時間</span><select defaultValue="asap"><option value="asap">儘快 · 約 20 分鐘</option><option>12:30</option><option>13:00</option></select></label></div><div className="lp-form-card"><h2>聯絡資料</h2><div className="lp-form-grid"><label><span>姓名</span><input defaultValue="陳小姐" /></label><label><span>手機</span><input defaultValue="0912 345 678" /></label></div><label><span>訂單備註</span><textarea placeholder="餐具需求或其他備註" /></label></div><div className="lp-form-card"><h2>付款方式</h2><div className="lp-payment"><button className="is-active"><b>現</b><span>現場付款<small>取餐時於櫃檯結帳</small></span></button><button><b>卡</b><span>線上刷卡<small>Visa、Mastercard、JCB</small></span></button></div></div></section><CartSummary lines={lines} onQuantity={update} onCheckout={onSubmit} buttonLabel="送出訂單" /></div></main></div>
}

function Success({ onAgain }: { onAgain: () => void }) {
  return <div className="lp-success lp-canvas"><div className="lp-success-card"><span className="lp-success-icon">✓</span><small>ORDER CONFIRMED</small><h1>訂單已送出</h1><p>店家已收到你的訂單，完成接單後會透過 LINE 通知。</p><div><span>訂單編號<strong>#A1049</strong></span><span>預計取餐<strong>12:20</strong></span></div><section><p><span>取餐門市</span><b>成龍捌貳 · 松江店</b></p><p><span>付款方式</span><b>現場付款</b></p><p><span>訂單金額</span><b>NT$ 430</b></p></section><button className="lp-primary" onClick={onAgain}>繼續點餐</button></div></div>
}

function Counter({ lines, add, update, clear }: { lines: CartLine[]; add: (p: Product) => void; update: (id: string, value: number) => void; clear: () => void }) {
  const [category, setCategory] = useState('全部')
  const visible = category === '全部' ? products : products.filter(p => p.category === category)
  return <div className="lp-counter lp-canvas"><header><Brand compact /><div><small>COUNTER · T01</small><h1>櫃檯點餐</h1></div><nav><button><Search size={18} />搜尋</button><button><UserRound size={18} />林店員</button></nav></header><div className="lp-counter-layout"><aside className="lp-category-rail">{['全部', '麵包', '甜點', '飲品', '餐盒'].map(item => <button className={category === item ? 'is-active' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}</aside><main><div className="lp-section-title"><div><small>MENU</small><h2>{category === '全部' ? '全部商品' : category}</h2></div><span>{visible.length} 項</span></div><section className="lp-counter-grid">{visible.map(product => <ProductTile counter product={product} quantity={lines.find(x => x.id === product.id)?.quantity || 0} onAdd={() => add(product)} key={product.id} />)}</section></main><div className="lp-counter-cart"><CartSummary lines={lines} onQuantity={update} onCheckout={clear} buttonLabel="建立訂單" /></div></div></div>
}

const adminNav: { view: PlatformView; label: string; icon: typeof LayoutDashboard }[] = [
  { view: 'dashboard', label: '營運總覽', icon: LayoutDashboard }, { view: 'orders', label: '訂單管理', icon: ClipboardList },
  { view: 'products', label: '商品管理', icon: Package }, { view: 'reports', label: '營業報表', icon: BarChart3 }, { view: 'settings', label: '門店設定', icon: Settings },
]

function AdminShell({ view, setView, children }: { view: PlatformView; setView: (v: PlatformView) => void; children: React.ReactNode }) {
  return <div className="lp-admin"><aside><Brand /><nav>{adminNav.map(item => { const Icon = item.icon; return <button type="button" className={view === item.view ? 'is-active' : ''} onClick={() => setView(item.view)} key={item.view}><Icon size={19} />{item.label}</button> })}</nav><button className="lp-admin-user"><span>林</span><div><strong>林店員</strong><small>門店管理員</small></div><LogOut size={17} /></button></aside><main><header><button className="lp-mobile-menu"><Menu /></button><div><small>成龍捌貳 · 松江店</small><h1>{adminNav.find(x => x.view === view)?.label || '管理中心'}</h1></div><div><button><Search size={19} /></button><span>營業中</span></div></header>{children}</main></div>
}

function Dashboard() {
  return <div className="lp-admin-content"><section className="lp-metrics">{[['今日營業額','NT$ 18,420','+12.5%'],['今日訂單','86 筆','+8.2%'],['平均客單','NT$ 214','+3.1%'],['待處理訂單','6 筆','需留意']].map(x => <article key={x[0]}><small>{x[0]}</small><strong>{x[1]}</strong><span>{x[2]}</span></article>)}</section><div className="lp-dashboard-grid"><section className="lp-admin-card"><div className="lp-panel-title"><div><small>REVENUE</small><h2>本週營業趨勢</h2></div><span>近 7 日</span></div><div className="lp-chart">{[42,58,48,72,64,88,76].map((h,i)=><div key={i}><span style={{height:`${h}%`}} /><small>{['一','二','三','四','五','六','日'][i]}</small></div>)}</div></section><section className="lp-admin-card"><div className="lp-panel-title"><div><small>LIVE</small><h2>最新訂單</h2></div><button>查看全部</button></div><OrderRows compact /></section></div></div>
}

function OrderRows({ compact = false }: { compact?: boolean }) {
  return <div className="lp-order-table">{!compact && <div className="lp-table-head"><span>訂單</span><span>顧客／來源</span><span>品項</span><span>金額</span><span>狀態</span><span>時間</span></div>}{orders.map(order => <div className="lp-table-row" key={order.id}><strong>{order.id}</strong><span>{order.customer}<small>{order.channel}</small></span>{!compact && <span>{order.items} 項</span>}<b>{money(order.total)}</b><em className={`is-${order.status}`}>{order.status}</em><time>{order.time}</time></div>)}</div>
}

function AdminOrders() { const [filter,setFilter]=useState('全部'); return <div className="lp-admin-content"><div className="lp-toolbar"><div className="lp-tabs">{['全部','待接單','製作中','可取餐','已完成'].map(x=><button className={filter===x?'is-active':''} onClick={()=>setFilter(x)} key={x}>{x}</button>)}</div><button className="lp-secondary">匯出訂單</button></div><section className="lp-admin-card"><OrderRows /></section></div> }

function AdminProducts() { const [items,setItems]=useState(products); return <div className="lp-admin-content"><div className="lp-toolbar"><div><small>PRODUCT CATALOG</small><h2>商品目錄</h2></div><button className="lp-primary"><Plus size={17}/>新增商品</button></div><section className="lp-admin-card lp-product-list">{items.map(p=><article key={p.id}><img src={p.image} alt=""/><div><small>{p.category}</small><strong>{p.name}</strong><span>{money(p.price)}</span></div><label className="lp-switch"><input type="checkbox" checked={p.available} onChange={()=>setItems(items.map(x=>x.id===p.id?{...x,available:!x.available}:x))}/><span/></label><button>編輯</button></article>)}</section></div> }

function Reports() { return <div className="lp-admin-content"><section className="lp-metrics">{[['本月營業額','NT$ 482,650','+18.4%'],['完成訂單','2,186 筆','+11.2%'],['退款金額','NT$ 3,240','0.67%'],['熱門品項','水果塔','386 份']].map(x=><article key={x[0]}><small>{x[0]}</small><strong>{x[1]}</strong><span>{x[2]}</span></article>)}</section><section className="lp-admin-card"><div className="lp-panel-title"><div><small>SALES MIX</small><h2>商品銷售排行</h2></div><span>本月</span></div><div className="lp-ranking">{products.map((p,i)=><div key={p.id}><b>0{i+1}</b><img src={p.image} alt=""/><span><strong>{p.name}</strong><small>{[386,342,298,264][i]} 份</small></span><em>{money([57900,41040,17880,42240][i])}</em></div>)}</div></section></div> }

function AdminSettings() { return <div className="lp-admin-content"><section className="lp-admin-card lp-settings"><div><small>STORE PROFILE</small><h2>門店基本資料</h2></div><label><span>門店名稱</span><input defaultValue="成龍捌貳 · 松江店"/></label><div className="lp-form-grid"><label><span>聯絡電話</span><input defaultValue="02 2501 8282"/></label><label><span>營業時間</span><input defaultValue="07:30–19:00"/></label></div><label><span>門店地址</span><input defaultValue="台北市中山區松江路 82 號"/></label><button className="lp-primary">儲存變更</button></section></div> }

function AdminLogin({ onLogin }: { onLogin: () => void }) { return <div className="lp-login lp-canvas"><section><Brand/><small>MANAGEMENT</small><h1>門店管理入口</h1><p>管理訂單、商品與每日營運資料。</p><label><span>帳號</span><input defaultValue="store.manager"/></label><label><span>密碼</span><input type="password" defaultValue="password"/></label><button className="lp-primary" onClick={onLogin}>登入管理中心</button><small>Demo：任意帳號皆可登入</small></section></div> }

export function LaMPlatform({ initialRole = 'customer', initialView }: LaMPlatformProps) {
  const defaultView: PlatformView = initialView || (initialRole === 'customer' ? 'menu' : initialRole === 'counter' ? 'counter' : 'login')
  const [role, setRole] = useState<PlatformRole>(initialRole)
  const [view, setView] = useState<PlatformView>(defaultView)
  const [lines, setLines] = useState<CartLine[]>([{ ...products[0], quantity: 1 }, { ...products[1], quantity: 1 }])
  const add = (product: Product) => setLines(current => current.some(x => x.id === product.id) ? current.map(x => x.id === product.id ? { ...x, quantity: x.quantity + 1 } : x) : [...current, { ...product, quantity: 1 }])
  const update = (id: string, quantity: number) => setLines(current => quantity <= 0 ? current.filter(x => x.id !== id) : current.map(x => x.id === id ? { ...x, quantity } : x))
  const switchRole = (next: PlatformRole) => { setRole(next); setView(next === 'customer' ? 'menu' : next === 'counter' ? 'counter' : 'login') }
  const adminContent = useMemo(() => view === 'dashboard' ? <Dashboard /> : view === 'orders' ? <AdminOrders /> : view === 'products' ? <AdminProducts /> : view === 'reports' ? <Reports /> : <AdminSettings />, [view])
  return <div className="lp-platform"><div className="lp-role-switch" aria-label="介面切換">{(['customer','counter','admin'] as PlatformRole[]).map(r=><button className={role===r?'is-active':''} onClick={()=>switchRole(r)} key={r}>{r==='customer'?'顧客端':r==='counter'?'櫃檯端':'後台'}</button>)}</div>{role === 'customer' ? view === 'start' ? <CustomerStart onStart={()=>setView('menu')} /> : view === 'checkout' ? <Checkout lines={lines} update={update} onBack={()=>setView('menu')} onSubmit={()=>setView('success')}/> : view === 'success' ? <Success onAgain={()=>{setLines([]);setView('menu')}}/> : <CustomerMenu lines={lines} add={add} update={update} goCheckout={()=>setView('checkout')}/> : role === 'counter' ? <Counter lines={lines} add={add} update={update} clear={()=>setLines([])}/> : view === 'login' ? <AdminLogin onLogin={()=>setView('dashboard')}/> : <AdminShell view={view} setView={setView}>{adminContent}</AdminShell>}</div>
}
