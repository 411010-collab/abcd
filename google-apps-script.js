/**
 * Google Apps Script - 背單字管理系統後端
 * 
 * 功能：接收前端表單資料，驗證並寫入 Google 試算表
 */

// ============================================
// 設定
// ============================================
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
const SHEET_NAME = '單字資料';

// ============================================
// 主函式
// ============================================

/**
 * 處理前端 POST 請求
 */
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    if (!validateData(data)) {
      return sendResponse(false, '資料驗證失敗：必要欄位缺失');
    }

    const rowNumber = writeToSheet(data);
    return sendResponse(true, `單字已成功保存至第 ${rowNumber} 列`);
    
  } catch (error) {
    Logger.log('錯誤: ' + error.toString());
    return sendResponse(false, '伺服器錯誤');
  }
}

/**
 * 處理 CORS 預檢請求
 */
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHttpHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
}

// ============================================
// 驗證與寫入
// ============================================

/**
 * 驗證資料完整性
 */
function validateData(data) {
  return data.word && typeof data.word === 'string' && data.word.trim() !== '';
}

/**
 * 寫入資料到試算表
 */
function writeToSheet(data) {
  const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    addHeaders(sheet);
  }

  const existingRow = findWordRow(sheet, data.word);
  const row = [
    new Date().toLocaleString('zh-TW'),
    data.word,
    data.translation || '',
    data.partOfSpeech || '',
    data.example || '',
    data.rootAnalysis || '',
  ];

  if (existingRow > 0) {
    sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
    return existingRow;
  } else {
    sheet.appendRow(row);
    return sheet.getLastRow();
  }
}

/**
 * 添加表頭
 */
function addHeaders(sheet) {
  const headers = ['時間戳記', '英文單字', '中文翻譯', '詞性', '例句', '字根分析'];
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold').setBackground('#58a6ff').setFontColor('#ffffff');
  sheet.autoResizeColumns(1, headers.length);
}

/**
 * 查找單字是否已存在
 */
function findWordRow(sheet, word) {
  try {
    const data = sheet.getRange(2, 2, sheet.getLastRow() - 1, 1).getValues();
    for (let i = 0; i < data.length; i++) {
      if (data[i][0].toLowerCase() === word.toLowerCase()) {
        return i + 2;
      }
    }
    return 0;
  } catch (error) {
    return 0;
  }
}

/**
 * 返回 JSON 回應
 */
function sendResponse(success, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: success ? 'success' : 'error', message }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHttpHeaders({ 'Access-Control-Allow-Origin': '*' });
}
