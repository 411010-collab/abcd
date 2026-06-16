# 背單字管理系統 - 完整設置指南

這是一個簡單的單字管理系統，前端收集資料，後端使用 Google Apps Script 寫入 Google 試算表。**完全不需要 API KEY 或 Google Cloud 設定。**

---

## 📋 系統架構

```
┌──────────────────┐
│  前端表單 (HTML)  │  收集單字資料
├──────────────────┤
│ • 英文單字       │
│ • 中文翻譯       │
│ • 詞性           │
│ • 例句           │
│ • 字根分析       │
└────────┬─────────┘
         │ JSON POST 請求
         ▼
┌──────────────────────────────┐
│ Google Apps Script 後端      │
├──────────────────────────────┤
│ • 驗證資料                   │
│ • 檢查重複                   │
│ • 寫入試算表                 │
└────────┬─────────────────────┘
         │ 讀寫操作
         ▼
┌──────────────────────────────┐
│  Google 試算表               │
├──────────────────────────────┤
│ 時間 | 單字 | 翻譯 | ... 等  │
└──────────────────────────────┘
```

---

## 🚀 快速開始（5 分鐘）

### 步驟 1：建立 Google Sheet
1. 前往 [Google Drive](https://drive.google.com)
2. 點擊「+ 新建」→ 「Google 試算表」
3. 命名為「背單字資料」

### 步驟 2：複製試算表 ID
試算表 URL：
```
https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
```
複製 `{SPREADSHEET_ID}` 部分（長字串）

### 步驟 3：建立 Google Apps Script
1. 在 Google Sheet 頁面，點擊「延伸功能」→ 「Apps Script」
2. 新標籤打開編輯器
3. 刪除預設代碼，複製 [google-s-script.js](./google-apps-script.js) 的所有代碼
4. **重要**：找到第 10 行，替換：
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```
   為：
   ```javascript
   const SPREADSHEET_ID = '你複製的ID';
   ```
5. 按 Ctrl+S 保存

### 步驟 4：部署 Google Apps Script
1. 點擊「部署」→「新增部署」
2. 類型選「Web 應用」
3. 設定：
   - 執行身份：選擇你的 Google 帳號
   - 訪問權限：「任何人」
4. 點擊「部署」
5. 授予權限：按照彈窗授權即可

### 步驟 5：複製部署 URL
部署完成後，看到的 URL 如：
```
https://script.google.com/macros/d/[部署ID]/userweb
```
**複製整個 URL**

### 步驟 6：更新前端設定
1. 打開 [app.js](./app.js)，找到第 32 行：
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';
   ```
2. 替換為：
   ```javascript
   const GOOGLE_APPS_SCRIPT_URL = '你複製的部署URL';
   ```
3. 保存

**完成！** 現在可以使用管理表單了。

---

## 💾 使用方式

### 前端介面

打開 [index.html](./index.html)，切換到「管理單字」標籤：

1. **英文單字**：輸入要新增的單字（必填）
2. **翻譯**：輸入中文翻譯（可選）
3. **詞性**：如 noun, verb, adjective（可選）
4. **例句**：輸入使用例句（可選）
5. **字根分析**：輸入字根或詞源分析（可選）
6. 點擊「儲存單字」

### 資料流

1. **本地儲存**：資料立即保存到瀏覽器 localStorage
2. **後端上傳**：資料異步發送到 Google Apps Script
3. **試算表記錄**：資料寫入 Google Sheet（自動去重）

### 查看 Google Sheet 中的資料

1. 打開你建立的 Google Sheet
2. 新工作表「單字資料」會自動建立
3. 每個新單字會添加一行，包含：
   - 時間戳記
   - 英文單字
   - 中文翻譯
   - 詞性
   - 例句
   - 字根分析

---

## 🔧 檔案說明

| 檔案 | 說明 |
|------|------|
| [index.html](./index.html) | 前端表單 UI（已完整配置）|
| [app.js](./app.js) | 前端 JavaScript（需配置 GAS URL）|
| [google-apps-script.js](./google-apps-script.js) | 後端代碼（需配置試算表 ID）|
| [styles.css](./styles.css) | 樣式文件（可選）|

---

## ⚡ 代碼特色

### 前端（app.js）
```javascript
// 1. 收集表單資料
const entry = {
  word,
  translation,
  partOfSpeech,
  example,
  rootAnalysis,
};

// 2. 本地保存（localStorage）
saveWords(entry);

// 3. 非同步發送到後端
sendToGoogleSheet(entry);
```

### 後端（google-apps-script.js）
```javascript
function doPost(e) {
  // 1. 解析 JSON 資料
  const data = JSON.parse(e.postData.contents);
  
  // 2. 驗證資料
  if (!validateData(data)) return sendResponse(false, '驗證失敗');
  
  // 3. 寫入試算表
  writeToSheet(data);
  
  // 4. 返回成功回應
  return sendResponse(true, '保存成功');
}
```

---

## ❌ 常見問題

### Q1：部署後還是無法上傳資料
**A**：
1. 檢查是否正確複製了 GAS 的部署 URL
2. 檢查 SPREADSHEET_ID 是否正確
3. 打開瀏覽器開發工具（F12），查看 Console 中的錯誤信息

### Q2：Google Sheet 中沒有看到資料
**A**：
1. 確認 GAS 中設定的試算表 ID 是否正確
2. 檢查試算表是否與部署 GAS 的帳號同享
3. 檢查是否有權限錯誤，查看 GAS 編輯器的「執行紀錄」

### Q3：如何更新部署？
**A**：如果修改了 GAS 代碼：
1. 在 GAS 編輯器中修改代碼
2. 點擊「部署」→「管理部署」
3. 選擇最新版本，點擊鉛筆圖標編輯
4. 選「建立新版本」
5. 部署完成

### Q4：如何移除重複的單字？
**A**：在試算表中手動刪除即可，或選擇同名單字會自動更新前一次的記錄。

---

## 🎯 進階調整（可選）

### 自訂工作表名稱
編輯 `google-apps-script.js` 第 11 行：
```javascript
const SHEET_NAME = '自訂名稱';
```

### 自訂欄位
修改 `google-apps-script.js` 中的 `addHeaders()` 函式，增加或移除欄位。

### 添加更多驗證
在 `validateData()` 函式中添加檢查邏輯。

---

## 📌 重要提醒

✅ **已完成**
- [x] HTML 表單已配置
- [x] 前端 JavaScript 已準備
- [x] 後端 GAS 代碼已準備

❌ **需要你完成**
- [ ] 創建 Google Sheet
- [ ] 複製試算表 ID 到 GAS
- [ ] 部署 GAS 並複製 URL
- [ ] 複製 GAS URL 到 app.js
- [ ] 測試表單提交

---

## ✨ 最後檢查清單

```
□ Google Sheet 已建立且 ID 已複製
□ GAS 代碼已更新試算表 ID
□ GAS 已部署且 URL 已複製
□ app.js 已更新 GAS URL
□ 打開 index.html，切換到「管理單字」
□ 填入表單數據
□ 點擊「儲存單字」
□ 檢查 Google Sheet 是否有新資料
□ 成功！🎉
```
  try {
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/userweb';
```

### 完整範例

```javascript
async function sendToGoogleSheet(entry) {
  try {
    // ✅ 正確的格式
    const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/d/AKfycbw1a2b3c4d5e6f7g8h9i0j1k2l3/userweb';

    if (GOOGLE_SCRIPT_URL === 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      console.warn('未設定 Google Apps Script URL，資料只保存在本地');
      return;
    }

    const payload = {
      word: entry.word,
      translation: entry.translation,
      partOfSpeech: entry.partOfSpeech,
      example: entry.example,
      rootAnalysis: entry.rootAnalysis,
      timestamp: new Date().toISOString(),
    };

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Google Sheet 寫入失敗:', response.statusText);
    } else {
      console.log('單字已成功保存到 Google Sheet');
    }
  } catch (error) {
    console.error('發送到 Google Sheet 時出錯:', error);
  }
}
```

---

## 測試流程

### 測試清單

- [ ] **Google Sheet 已建立**
- [ ] **試算表 ID 已複製**
- [ ] **Google Apps Script 已部署**
- [ ] **部署 URL 已複製**
- [ ] **前端 URL 已更新**

### 測試步驟

#### 1. 打開應用

打開 `index.html`，點擊「管理單字」頁籤。

#### 2. 填入表單

```
英文單字: abandon
中文翻譯: 放棄
詞性: verb
例句: She had to abandon her car.
字根分析: ab- (離開) + bandon = 放棄
```

#### 3. 點擊「儲存單字」

#### 4. 檢查結果

**本地檢查：**
- [ ] 單字出現在下方的「已儲存單字」列表

**Google Sheet 檢查：**
- [ ] 刷新 Google Sheet
- [ ] 檢查是否有新行被添加
- [ ] 驗證所有欄位都被正確填入

**瀏覽器控制台檢查：**
- [ ] 按 `F12` 打開開發者工具
- [ ] 查看 Console 標籤
- [ ] 確認看到訊息：「單字已成功保存到 Google Sheet」

---

## 故障排除

### ❌ 問題 1：「Google Sheet 寫入失敗」

**原因：** URL 不正確或權限不足

**解決方案：**

1. 確認部署 URL 正確複製（沒有多餘空格）
2. 檢查試算表分享權限
3. 在 Google Apps Script 編輯器中執行 `testConnection()` 測試

### ❌ 問題 2：「CORS 錯誤」

**原因：** 跨域請求被拒絕

**解決方案：**

Google Apps Script 已在程式碼中設定 CORS 頭：

```javascript
.setHttpHeaders({ 'Access-Control-Allow-Origin': '*' })
```

如果仍有問題，確認：
1. 部署類型是「Web 應用」
2. 訪問權限設為「任何人」

### ❌ 問題 3：「資料未出現在 Google Sheet」

**原因：** 多個可能：

**檢查清單：**

1. ✅ 表單是否成功提交（本地列表是否更新）
2. ✅ 瀏覽器控制台是否有錯誤訊息
3. ✅ Google Sheet 是否刷新
4. ✅ 工作表名稱是否匹配
5. ✅ 試算表 ID 是否正確

### ❌ 問題 4：「資料寫入重複」

**原因：** 同一單字被提交多次

**解決方案：**

Google Apps Script 程式碼已有重複檢查邏輯：

```javascript
const existingRow = findWordRow(sheet, data.word);
if (existingRow > 0) {
  // 更新現有行
  sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
} else {
  // 新增新行
  sheet.appendRow(row);
}
```

如果仍有重複，檢查單字大小寫是否一致（程式碼已進行大小寫不敏感檢查）。

### ❌ 問題 5：「部署後無法更新程式碼」

**原因：** 程式碼修改後需要重新部署

**解決方案：**

1. 在 Google Apps Script 編輯器修改程式碼
2. 點擊「部署」 → 「管理部署」
3. 選擇現有部署 → 編輯
4. 選擇新版本 → 「更新」

---

## 高級設定

### 自動備份

Google Apps Script 可設定觸發器自動備份資料：

```javascript
function setupBackupTrigger() {
  ScriptApp.newTrigger('backupToGoogleDrive')
    .timeBased()
    .atHour(2)  // 每天凌晨 2 點
    .everyDays(1)
    .create();
}

function backupToGoogleDrive() {
  // 建立試算表備份並保存到 Google Drive
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  const driveFolder = DriveApp.getFoldersByName('備份').next();
  const timestamp = new Date().toISOString().split('T')[0];
  spreadsheet.copy(`備份_${timestamp}`);
}
```

### 郵件通知

每次新增單字時發送通知：

```javascript
function sendNotificationEmail(data) {
  GmailApp.sendEmail(
    'your-email@gmail.com',
    '新增單字：' + data.word,
    `
    單字：${data.word}
    翻譯：${data.translation}
    詞性：${data.partOfSpeech}
    時間：${new Date().toLocaleString()}
    `
  );
}
```

---

## 安全性建議

1. **驗證資料**：Google Apps Script 已驗證必要欄位
2. **限制訪問**：改為 Google Workspace 成員專用
3. **日誌記錄**：所有操作已被記錄到 Google Apps Script 執行紀錄
4. **定期備份**：定期導出試算表為 CSV

---

## 參考資源

- [Google Apps Script 官方文件](https://developers.google.com/apps-script)
- [Google Sheets API](https://developers.google.com/sheets/api)
- [Fetch API (JavaScript)](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

## 常見問題 (FAQ)

**Q: 可以不使用 Google Sheet 嗎？**  
A: 可以。您可以修改 `sendToGoogleSheet()` 函式改為發送到其他後端（如 Node.js、Python 等）。

**Q: 如何刪除 Google Sheet 中的資料？**  
A: 在 Google Sheet 中直接編輯。Google Apps Script 沒有提供刪除接口。

**Q: 可以設定密碼保護嗎？**  
A: 可以。在 Google Apps Script 中添加 API 金鑰驗證。

---

*最後更新：2026-06-09*
