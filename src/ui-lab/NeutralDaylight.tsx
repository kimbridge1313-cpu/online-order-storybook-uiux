import './neutral-daylight.css'

type LabMode = 'mobile' | 'tablet'

type MenuItem = {
  name: string
  detail: string
  price: number
  tone: 'oat' | 'sage' | 'clay'
}

const categories = ['推薦', '輕食', '主餐', '飲品']

const menuItems: MenuItem[] = [
  { name: '野菇溫沙拉', detail: '烤時蔬・藜麥・胡麻醬', price: 220, tone: 'sage' },
  { name: '香草烤雞飯', detail: '舒肥雞胸・季節蔬菜', price: 280, tone: 'oat' },
  { name: '番茄布拉塔', detail: '牛番茄・羅勒・橄欖油', price: 260, tone: 'clay' },
]

export interface NeutralDaylightProps {
  mode: LabMode
  label: 'M01' | 'T01'
}

function FoodArtwork({ tone }: Pick<MenuItem, 'tone'>) {
  return (
    <div className={`ndl-art ndl-art--${tone}`} aria-hidden="true">
      <span className="ndl-art__plate" />
      <span className="ndl-art__leaf ndl-art__leaf--one" />
      <span className="ndl-art__leaf ndl-art__leaf--two" />
      <span className="ndl-art__dot ndl-art__dot--one" />
      <span className="ndl-art__dot ndl-art__dot--two" />
    </div>
  )
}

export function NeutralDaylight({ mode, label }: NeutralDaylightProps) {
  return (
    <div className={`ndl-stage ndl-stage--${mode}`}>
      <div className="ndl-browser-label">Neutral Daylight · {label}</div>
      <section className="ndl-app" aria-label={`${label} 線上訂餐預覽`}>
        <header className="ndl-header">
          <a className="ndl-brand" href="#top" aria-label="Daylight Deli 首頁">
            <span className="ndl-brand__mark">D</span>
            <span>Daylight Deli</span>
          </a>
          <div className="ndl-header__actions">
            <button className="ndl-location" type="button">
              <span>取餐門市</span>
              <strong>松江店⌄</strong>
            </button>
            <button className="ndl-cart" type="button" aria-label="購物車，2 件商品">
              <span>購物袋</span>
              <b>2</b>
            </button>
          </div>
        </header>

        <main className="ndl-main" id="top">
          <section className="ndl-hero">
            <div>
              <span className="ndl-eyebrow">DAYLIGHT KITCHEN · 今日供應</span>
              <h1>簡單吃，<br />好好過一天。</h1>
              <p>當季食材、剛好的份量，現在點餐，約 20 分鐘後取餐。</p>
            </div>
            <div className="ndl-hero__note">
              <span>營業中</span>
              <strong>11:00–20:30</strong>
              <small>最後點餐 20:00</small>
            </div>
          </section>

          <nav className="ndl-categories" aria-label="餐點分類">
            {categories.map((category, index) => (
              <button className={index === 0 ? 'is-active' : ''} type="button" key={category}>
                {category}
              </button>
            ))}
          </nav>

          <section className="ndl-menu" aria-labelledby={`${label}-recommended`}>
            <div className="ndl-section-heading">
              <div>
                <span>CHEF'S SELECTION</span>
                <h2 id={`${label}-recommended`}>今日推薦</h2>
              </div>
              <button type="button">查看全部 →</button>
            </div>

            <div className="ndl-grid">
              {menuItems.map((item, index) => (
                <article className="ndl-card" key={item.name}>
                  <FoodArtwork tone={item.tone} />
                  <div className="ndl-card__content">
                    <div>
                      <span className="ndl-card__number">0{index + 1}</span>
                      <h3>{item.name}</h3>
                      <p>{item.detail}</p>
                    </div>
                    <div className="ndl-card__footer">
                      <strong>NT$ {item.price}</strong>
                      <button type="button" aria-label={`加入 ${item.name}`}>＋</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>

        <footer className="ndl-footer">
          <span>Daylight Deli</span>
          <p>每日新鮮備料，售完為止。</p>
          <button type="button">查看購物袋 · 2</button>
        </footer>
      </section>
    </div>
  )
}
