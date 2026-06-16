# 📚 背單字管理系統

一個簡單的英文單字管理系統。使用前端表單收集單字資料，通過 Google Apps Script 自動寫入 Google 試算表。**完全不需要 API KEY 或複雜的 Google Cloud 設定。**

## ✨ 特色

- 📝 **簡單表單**：收集英文單字、翻譯、詞性、例句、字根分析
- 💾 **本地儲存**：資料立即保存到瀏覽器（即使 Google 服務出現故障也不會丟失）
- ☁️ **自動上傳**：非同步上傳到 Google Sheet（不阻塞本地操作）
- 🔄 **自動去重**：同名單字自動更新，不會重複存入
- 🎴 **卡片模式**：支援翻面卡片學習、隨機排序、上下導航
- 🚀 **零設定**：無需 API KEY、OAuth 或任何服務帳戶配置

## 🚀 5分鐘快速開始

詳細步驟見 [SETUP.md](./SETUP.md)，快速要點：

1. 建立 Google Sheet，複製試算表 ID
2. 在 Sheet 中建立 Google Apps Script，貼上 [google-apps-script.js](./google-apps-script.js) 代碼
3. 將試算表 ID 填入 GAS（第 10 行）
4. 部署 GAS，複製部署 URL
5. 將 URL 填入 [app.js](./app.js)（第 31 行）
6. 打開 [index.html](./index.html)，開始使用！

## 📁 檔案結構

```
.
├── index.html                  # 前端 UI（管理表單 + 卡片學習）
├── app.js                      # 前端 JavaScript（核心邏輯）
├── google-apps-script.js       # 後端代碼（部署到 GAS）
├── styles.css                  # 樣式（可選）
├── SETUP.md                    # 完整設置指南
└── README.md                   # 本檔案
```

## 📊 代碼簡介

### 前端（app.js）
```javascript
// 1. 用戶填入表單
const entry = {
  word: '單字',
  translation: '翻譯',
  partOfSpeech: '詞性',
  example: '例句',
  rootAnalysis: '字根分析',
};

// 2. 保存到本地 localStorage
saveWords(entry);

// 3. 非同步發送到 Google Apps Script
sendToGoogleSheet(entry);
```

### 後端（google-apps-script.js）
```javascript
function doPost(e) {
  // 1. 接收 JSON 資料
  const data = JSON.parse(e.postData.contents);
  
  // 2. 驗證 + 去重
  if (!validateData(data)) return error();
  
  // 3. 寫入試算表
  writeToSheet(data);
  
  // 4. 返回成功
  return sendResponse(true);
}
```

## 🎯 使用場景

- **英文老師**：管理學生單字表，自動存檔
- **語言學習者**：構建個人單字庫，配合卡片複習
- **小型教育機構**：無需購買昂貴的管理系統

## ⚙️ 技術棧

| 層級 | 技術 |
|------|------|
| 前端 | HTML5 + Vanilla JavaScript + Tailwind CSS |
| 後端 | Google Apps Script |
| 儲存 | localStorage (本地) + Google Sheet (雲端) |
| 通信 | Fetch API + JSON |

## 🔒 安全性

- ✅ 無需 API KEY
- ✅ 無需 OAuth 複雜流程
- ✅ 無需第三方服務
- ✅ 所有資料都在你的 Google Sheet 上
- ✅ GAS Web App 執行身份為你的 Google 帳號

## 📝 表單欄位

| 欄位 | 類型 | 必填 | 說明 |
|------|------|------|------|
| 英文單字 | 文字 | ✅ | 單字本身 |
| 中文翻譯 | 文字 | ⭕ | 一或多個意思 |
| 詞性 | 文字 | ⭕ | 如 noun, verb, adjective |
| 例句 | 文字 | ⭕ | 實際使用情境 |
| 字根分析 | 文字 | ⭕ | 詞根、詞源或記憶方法 |

## 🐛 常見問題

**Q：資料為什麼沒有出現在 Google Sheet？**
A：
1. 確認是否設定了正確的 GAS URL
2. 確認試算表 ID 是否正確
3. 打開瀏覽器控制台（F12）查看錯誤

**Q：同一個單字提交兩次會怎樣？**
A：自動更新為最新資料，不會重複存入。

**Q：本地資料丟失了怎麼辦？**
A：Google Sheet 上有完整備份。如需恢復，可從 Sheet 複製資料或重新手動輸入。

## 📌 部署檢查清單

- [ ] Google Sheet 已建立
- [ ] 試算表 ID 已複製到 GAS
- [ ] GAS 已部署
- [ ] GAS URL 已複製到 app.js
- [ ] 表單提交測試成功
- [ ] Google Sheet 能看到新資料

## 🎉 下一步

- 擴展欄位：在 HTML 和 GAS 中增加新欄位
- 資料匯入：從 CSV 批量匯入單字
- 多人協作：邀請他人編輯同一個 Google Sheet
- 數據分析：使用 Google Sheets 的圖表功能統計學習進度

---

**需要幫助？** 參考 [SETUP.md](./SETUP.md) 的詳細步驟。
