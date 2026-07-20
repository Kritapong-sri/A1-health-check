/*
  Google Apps Script for A1 Health-Check
  
  Instructions:
  1. เปิดไฟล์ Google Sheet ของคุณเองที่คุณต้องการให้บันทึกข้อมูล
  2. กดที่เมนู Extensions (ส่วนขยาย) > Apps Script
  3. ลบโค้ดเดิมในนั้นออกทั้งหมด แล้ววางโค้ดนี้ลงไป
  4. กด Save (ไอคอนแผ่นดิสก์)
  5. กด Deploy (การใช้งาน) > New deployment (การสร้างการใช้งานที่นำไปใช้ได้จริง)
  6. ตั้งค่า:
     - Select type: Web app (เว็บแอป)
     - Execute as: Me (ตัวฉันเอง)
     - Who has access: Anyone (ทุกคน)
  7. กด Deploy และทำการ Authorize access (ให้สิทธิ์การเข้าถึง)
  8. คัดลอก Web app URL มาใส่ใน script.js (ที่ตัวแปร GOOGLE_SHEET_URL)
*/

function doPost(e) {
  try {
    var ss = null;
    
    // 1. ดึงไฟล์ Google Sheet ที่ Apps Script นี้ผูกอยู่
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (err) {}
    
    // 2. หากยังไม่ได้ ให้ลองดึงตาม ID (กรณีใส่ ID ไว้)
    if (!ss) {
      try {
        ss = SpreadsheetApp.openById("1Gmi4xMwkAmEr4WAF9F_aDMOHWdwkh7ElXm22XTRc_VE");
      } catch (err) {}
    }
    
    if (!ss) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "ไม่พบ Google Sheet กรุณาสร้าง Apps Script จากในไฟล์ Google Sheet ของคุณ (Extensions > Apps Script)" 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var sheet = ss.getSheets()[0];
    
    // สร้าง Header หากชีตยังว่างอยู่
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp ID", 
        "Date Completed", 
        "Nickname", 
        "Avatar Customization", 
        "HP Score", 
        "Mood Status", 
        "Quest 01 (1 Year Goal)", 
        "Quest 02 (What is needed)", 
        "Quest 03 (Mood Details / Note)"
      ]);
    }
    
    // อ่านข้อมูลที่ส่งเข้ามาอย่างปลอดภัย
    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }
    
    // เพิ่มแถวข้อมูลลงในชีต
    sheet.appendRow([
      data.id ? data.id.toString() : new Date().getTime().toString(),
      data.date || Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy HH:mm:ss"),
      data.nickname || "Anonymous",
      data.avatar || "Default Pig",
      data.score !== undefined ? data.score : 50,
      data.mood || "ok",
      data.q1 || "",
      data.q2 || "",
      data.q3 || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput("A1 Health-Check Google Apps Script is running correctly!");
}

