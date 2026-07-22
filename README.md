# Online Order Template

線上訂餐專案與 LaM Neutral Daylight Storybook UI Lab。

## UI Lab 內容

- M01 手機點餐頁
- T01 平板櫃檯點餐頁
- Neutral Daylight 設計 tokens
- 光影與玻璃材質 playground
- 商品卡片、門店、分類、購物車與訂單面板
- M01、T01 原始設計參考圖
- 視覺參數複製與 JSON 下載

UI Lab 位於 `src/ui-system/`，預覽商品圖位於 `public/preview-products/`，原始參考圖位於 `design-references/`。UI Lab 與既有訂單功能保持隔離。

## 完整設計封存

完整共創歷程位於 `design-archive/`：

- `01-generated-iterations/`：AI 生成介面稿與 contact sheet
- `02-user-reference-images/`：使用者確認與批註過的參考圖
- `03-figma-transfer-assets/`：Figma 轉移用素材
- `04-html-experimental-snapshot/`：React／HTML 視覺實驗與 patch

`04-html-experimental-snapshot/` 僅供逐檔參考，不會參與正式 App、TypeScript 或 Storybook 建置，也不可直接覆蓋正式訂單邏輯。`03-figma-transfer-assets/` 中的 `*_EDITABLE.png` 是封存記錄裡的無效下載檔，不應作為圖片使用。

## 常用指令

```bash
pnpm install
pnpm storybook
pnpm test-storybook
pnpm typecheck
pnpm build-storybook
```

Storybook 預設網址：<http://localhost:6006/>

## 尚未包含

- M02 手機結帳頁
- Canva 原始檔
- Figma 檔案本體（線上設計：<https://www.figma.com/design/4QpE6FzHf9g0al6x6JA8oS>）
- 正式系統的 Firebase、LIFF 或 API 修改
