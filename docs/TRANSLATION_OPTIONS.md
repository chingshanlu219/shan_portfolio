# 免費翻譯 API 選項

**目前使用：MyMemory**（完全免費、無需 API Key）

## 0. MyMemory（已實作）✅

- **官網**: https://mymemory.translated.net/
- **免費額度**: 5,000 字/日（匿名）
- **品質**: 中等
- **需要**: 無需註冊、無需 API Key
- **使用**: 後台編輯頁 → 選來源語言 → 點「翻譯所有空白」

---

## 1. LibreTranslate（備選：完全免費）

- **官網**: https://libretranslate.com
- **免費額度**: 自架無限制，或使用公共 API（有每日限制）
- **品質**: 中等
- **實作**: 呼叫 `https://libretranslate.com/translate`，無需 API Key
- **優點**: 開源、可自架、隱私友善
- **缺點**: 公共 API 可能不穩定

```bash
# 自架（Docker）
docker run -ti --rm -p 5000:5000 libretranslate/libretranslate
```

## 2. Google Cloud Translation（免費額度）— 推薦

- **官網**: https://cloud.google.com/translate
- **免費額度**: 每月 500,000 字元
- **品質**: 高
- **使用情境**: 僅在後台編輯時翻譯，翻譯結果存進 MongoDB，前台不呼叫 API。所以 50 萬字/月 = 你後台翻譯的總字數不超過即可。

### 申請步驟

1. **建立 Google Cloud 專案**
   - 前往 https://console.cloud.google.com
   - 登入 Google 帳號
   - 點「選取專案」→「新增專案」→ 輸入名稱（如 `shan-portfolio`）→ 建立

2. **啟用 Cloud Translation API**
   - 左側選單「API 和服務」→「程式庫」
   - 搜尋「Cloud Translation API」
   - 點進去 →「啟用」

3. **建立 API 金鑰**
   - 「API 和服務」→「憑證」
   - 「建立憑證」→「API 金鑰」
   - 複製金鑰，加入 `.env.local`：`GOOGLE_TRANSLATE_API_KEY=你的金鑰`

4. **（建議）限制金鑰**
   - 在憑證頁面點該金鑰 →「應用程式限制」選「HTTP 參照來源」或「IP 位址」
   - 「API 限制」選「限制金鑰」→ 只勾選「Cloud Translation API」

## 3. DeepL（免費額度）

- **官網**: https://www.deepl.com/pro-api
- **免費額度**: 500,000 字/月（需註冊）
- **品質**: 非常高
- **需要**: 註冊取得 API Key
- **環境變數**: `DEEPL_API_KEY`

## 4. MyMemory（免費、無需註冊）

- **官網**: https://mymemory.translated.net/
- **免費額度**: 每日約 1000 字（未註冊）
- **品質**: 中等
- **實作**: 簡單 GET 請求，無需 Key
- **適合**: 輕量、測試用

## 建議

- **預算零、快速上線**: LibreTranslate 公共 API 或 MyMemory
- **要穩定、品質好**: Google 或 DeepL 免費額度
- **完全掌控**: 自架 LibreTranslate
