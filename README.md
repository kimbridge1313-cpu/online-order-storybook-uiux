# Online Order Storybook UIUX

通用線上訂餐系統的 Storybook UIUX 原始碼。

## 內容

- 顧客手機點餐、結帳與完成頁
- 櫃檯點餐介面
- 後台登入、儀表板、訂單、商品與報表頁
- Neutral Daylight 設計系統
- Storybook viewport：手機 430、平板 1440

## 執行

```bash
pnpm install
pnpm storybook
```

Storybook 預設網址：<http://localhost:6006/>

## 建置

```bash
pnpm typecheck
pnpm build-storybook
```

`node_modules`、`dist`、`storybook-static` 與歷史設計封存不提交至 repository。
