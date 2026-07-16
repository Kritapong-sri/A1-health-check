/*
  Google Apps Script for A1 Health-Check
  
  Instructions:
  1. Open the Google Sheet: https://docs.google.com/spreadsheets/d/1Gmi4xMwkAmEr4WAF9F_aDMOHWdwkh7ElXm22XTRc_VE/edit
  2. Click Extensions > Apps Script
  3. Delete any default code and paste this script
  4. Click Save (disk icon)
  5. Click Deploy > New deployment
  6. Select type "Web app"
  7. Set:
     - Description: A1 Health-Check Web App
     - Execute as: Me (your-email)
     - Who has access: Anyone
  8. Click Deploy
  9. Authorize access if prompted
  10. Copy the Web app URL and paste it into `script.js` at the top (replace GOOGLE_SHEET_URL)
*/

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.openById("1Gmi4xMwkAmEr4WAF9F_aDMOHWdwkh7ElXm22XTRc_VE").getSheets()[0];
    
    // Check and create headers if sheet is empty
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
    
    var data = JSON.parse(e.postData.contents);
    
    // Append the record row
    sheet.appendRow([
      data.id ? data.id.toString() : new Date().getTime().toString(),
      data.date || Utilities.formatDate(new Date(), "GMT+7", "dd/MM/yyyy"),
      data.nickname || "Anonymous",
      data.avatar || "Default Pig",
      data.score || 50,
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
  return ContentService.createTextOutput("A1 Health-Check Google Apps Script running. Please use POST method.");
}
