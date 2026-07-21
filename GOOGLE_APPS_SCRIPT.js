/*
  =============================================================
  Google Apps Script for A1 Health-Check
  =============================================================

  Instructions / วิธีตั้งค่าใช้งาน:
  1. เปิดไฟล์ Google Sheet ของคุณขึ้นมา
  2. ไปที่เมนู Extensions (ส่วนขยาย) > Apps Script
  3. ลบโค้ดเดิมทั้งหมดในนั้นออก แล้ววางโค้ดนี้ลงไป
  4. กด Save (ไอคอนแผ่นดิสก์)
  5. กด Deploy (การใช้งาน) > New deployment (การสร้างการใช้งานที่นำไปใช้ได้จริง)
  6. ตั้งค่า:
     - Select type: Web app (เว็บแอป)
     - Execute as: Me (ตัวฉันเอง)
     - Who has access: Anyone (ทุกคน)
  7. กด Deploy และทำการ Authorize access (ให้สิทธิ์การเข้าถึง)
  8. คัดลอก Web app URL (ที่ลงท้ายด้วย /exec) มาวางในช่องตั้งค่า Google Sheet ในเว็บ A1 Health Quest
*/

function doPost(e) {
  return handleDataSubmit(e);
}

function doGet(e) {
  // หากมีข้อมูลส่งมาทาง GET (Backup query param หรือการทดสอบปิง)
  if (e && e.parameter && (e.parameter.nickname || e.parameter.data || e.parameter.id)) {
    return handleDataSubmit(e);
  }
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    message: "A1 Health-Check Google Apps Script is running correctly!"
  })).setMimeType(ContentService.MimeType.JSON);
}

function handleDataSubmit(e) {
  try {
    var ss = null;
    
    // 1. ดึงไฟล์ Google Sheet ที่ Apps Script นี้ผูกอยู่
    try {
      ss = SpreadsheetApp.getActiveSpreadsheet();
    } catch (err) {}
    
    if (!ss) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "error", 
        message: "ไม่พบ Google Sheet! กรุณาสร้าง Apps Script จากภายในไฟล์ Google Sheet ของคุณ (ไปที่เมนู Extensions > Apps Script ในไฟล์ Google Sheet)" 
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
      
      // ปรับแต่งสไตล์ Header
      var headerRange = sheet.getRange(1, 1, 1, 9);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#4A7C59");
      headerRange.setFontColor("#FFFFFF");
    }
    
    // อ่านข้อมูลที่ส่งเข้ามาอย่างปลอดภัย (รองรับทั้ง JSON string, URL params, GET data)
    var data = {};
    if (e && e.parameter && e.parameter.data) {
      try {
        data = JSON.parse(e.parameter.data);
      } catch(err) {}
    }
    
    if (!data.nickname && e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (!data.nickname && e && e.parameter) {
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
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success",
      message: "บันทึกข้อมูลลง Google Sheet สำเร็จ!"
    })).setMimeType(ContentService.MimeType.JSON);
      
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}



