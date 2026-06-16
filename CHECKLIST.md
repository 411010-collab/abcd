# 🚀 背單字管理系統 - 部署清單

## ✅ 已完成的工作

本項目包含**精簡的前端和後端代碼**，零外部依賴，無需 API KEY。

### 前端（app.js）
- ✅ 簡單的表單提交邏輯
- ✅ 本地 localStorage 儲存
- ✅ 非同步 Google Sheet 上傳（fetch POST）
- ✅ 移除了外部 API 調用（字典、翻譯）
- ✅ 卡片翻面學習功能
- ✅ 單字管理（新增、刪除）

### 後端（google-apps-script.js）
- ✅ `doPost()` 接收 JSON 資料
- ✅ `doOptions()` 處理 CORS 預檢
- ✅ 資料驗證函式
- ✅ Google Sheet 寫入邏輯
- ✅ 自動去重機制
- ✅ 精簡代碼（無測試函式、無冗長註釋）

### 前端 HTML（index.html）
- ✅ 管理表單（5 個欄位）
- ✅ 單字卡片學習界面
- ✅ 導航和按鈕
- ✅ 已移除自動填入按鈕

### 文檔
- ✅ README.md - 項目概述
- ✅ SETUP.md - 詳細設置步驟（5 分鐘快速開始）
- ✅ 本檢查清單

---

## 📋 你需要完成的步驟（3 個配置）

### 步驟 1：Google Sheet 和 GAS 設置
```
□ 1. 建立 Google Sheet
□ 2. 複製試算表 ID
□ 3. 在 Sheet 中建立 Google Apps Script
□ 4. 複製 google-apps-script.js 代碼
□ 5. 設定試算表 ID（第 10 行）
□ 6. 部署 GAS，複製部署 URL
```

### 步驟 2：更新前端 URL
```
□ 打開 app.js 第 31 行
□ 替換：const GOOGLE_APPS_SCRIPT_URL = '你的部署URL';
```

### 步驟 3：測試
```
□ 打開 index.html
□ 填入表單資料
□ 點擊「儲存單字」
□ 檢查 Google Sheet 中是否有新資料
```

---

## 📊 系統代碼行數

| 檔案 | 行數 | 說明 |
|------|------|------|
| app.js | ~280 | 前端核心邏輯 |
| google-apps-script.js | ~127 | 後端完整代碼 |
| index.html | ~115 | HTML 表單 |
| **總計** | **~522** | **精簡高效** |

---

## 🎯 核心功能確認

### 表單欄位（5 個）
- [x] 英文單字（必填）
- [x] 中文翻譯（可選）
- [x] 詞性（可選）
- [x] 例句（可選）
- [x] 字根分析（可選）

### 資料流
- [x] 前端收集 → 本地儲存（localStorage）
- [x] 非同步上傳到 Google Apps Script
- [x] GAS 驗證 → 檢查重複 → 寫入試算表
- [x] Google Sheet 自動添加時間戳記

### 使用體驗
- [x] 本地優先（即使無網路也能使用）
- [x] 靜默失敗（如果上傳失敗，本地資料仍保存）
- [x] 自動去重（同名單字更新而非重複）
- [x] 立即反饋（表單重置、焦點返回）

---

## ⚙️ 技術棧

```
前端層
├── HTML5（表單結構）
├── Vanilla JS（無框架、無套件）
├── Fetch API（HTTP 通信）
└── localStorage（本地存儲）

後端層
├── Google Apps Script
├── SpreadsheetApp API
└── ContentService（JSON 回應）

儲存層
├── localStorage（瀏覽器本地）
└── Google Sheet（雲端同步）
```

---

## 🔐 安全和簡潔性

✅ **已達成用戶要求**：

1. ✅ **最簡單的前端** - 原生 JavaScript，無框架
2. ✅ **最簡單的後端** - GAS 中的 doPost(e)
3. ✅ **無 API KEY** - 只需試算表 ID
4. ✅ **無 Google Cloud 設定** - 直接在 Google Sheet 中建立
5. ✅ **步驟清晰** - SETUP.md 提供 5 分鐘快速開始
6. ✅ **代碼精簡** - 刪除了所有不必要的功能

---

## 📝 使用提示

### 開發時
```bash
# 1. 編輯 index.html、app.js、google-apps-script.js
# 2. 在 Google Sheet 中測試 GAS
# 3. 在瀏覽器中測試表單
# 4. 檢查 Google Sheet 是否有新資料
```

### 部署時
```bash
# 1. 在 GAS 中點擊「部署」→「管理部署」
# 2. 編輯現有部署，選「建立新版本」
# 3. 複製新的 URL 到 app.js
```

---

## 🎓 學習資源

如需進階功能，可參考：

- **Google Apps Script 官方文檔**：[developers.google.com/apps-script](https://developers.google.com/apps-script)
- **Google Sheet API**：查詢 SpreadsheetApp 方法
- **Fetch API**：MDN 文檔學習更多用法

---

## 🐛 故障排除

| 問題 | 解決方案 |
|------|---------|
| 資料沒有出現在 Sheet | 檢查試算表 ID 和部署 URL |
| GAS 權限不足 | 檢查 Google Account 是否有 Sheet 編輯權限 |
| 表單無法提交 | 打開 F12 Console 查看錯誤信息 |
| 本地資料丟失 | 從 Google Sheet 恢復備份 |

---

## ✨ 完成！

所有代碼已準備好，只需以下 3 步配置：

1. **建立 Sheet 和 GAS**
2. **複製試算表 ID 到 GAS**
3. **複製 GAS URL 到 app.js**

詳細說明見 [SETUP.md](./SETUP.md) 📖
