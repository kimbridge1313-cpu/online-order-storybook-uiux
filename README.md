# Online Order Storybook UIUX

這個 repository 保存通用線上訂餐系統的 Storybook UIUX 原始碼。

目前完整可維護原始碼收錄於：

- `online-order-storybook-uiux-source.zip`

壓縮檔已排除 `node_modules`、`dist`、`storybook-static`、設計歷史封存與字型／大型圖片資產，保留 React、Storybook、CSS、TypeScript、設定與 lockfile。

## 執行

```bash
unzip online-order-storybook-uiux-source.zip
cd storybook-code
pnpm install
pnpm storybook
```

商品圖片可沿用目前 Storybook 部署站的 `preview-products` 資產，或重新放入 `public/preview-products/`。
