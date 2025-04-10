Personal Expense Tracker Lite


Using Google AppScript to store and get data from google sheets


Porject Structure:
AuthModule
    LoginCompnent
    RegisterComponent

ExpenseModule
    AddExpenseComponent
    ShowAllExpenseComponent

DashboardModule
    DashboardComponent

LayoutModule (for shared UI components)
    NavbarComponent
    SidebarComponent
    FooterComponent (optional)
    HeaderComponent (optional)

SharedModule (optional for reusable utilities)
    Reusable pipes, directives, and services

src/
├── app/
│   ├── auth/
│   ├── expense/
│   ├── dashboard/
│   ├── layout/
│   │   ├── navbar/
│   │   ├── sidebar/
│   │   └── layout.component.ts
│   ├── shared/
│   └── app.component.ts



// Handle GET requests
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({ message: "API is working!" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Handle POST requests (Create/Update)
function doPost(e) {
  const action = e.parameter.action;  // Action: 'create', 'update', or 'delete'
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  
  if (action === 'create') {
    return createRow(e, sheet);
  } else if (action === 'update') {
    return updateRow(e, sheet);
  } else if (action === 'delete') {
    return deleteRow(e, sheet);
  } else {
    return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Function to Create a Row
function createRow(e, sheet) {
  const data = JSON.parse(e.postData.contents);  // Assuming JSON body
  sheet.appendRow([data.name, data.age, data.city]);
  return ContentService.createTextOutput(JSON.stringify({ success: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Function to Update a Row
function updateRow(e, sheet) {
  const data = JSON.parse(e.postData.contents);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === data.name) {  // Matching by name
      sheet.getRange(i + 1, 2, 1, 2).setValues([[data.age, data.city]]);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ error: "Name not found" }))
    .setMimeType(ContentService.MimeType.JSON);
}

// Function to Delete a Row
function deleteRow(e, sheet) {
  const data = JSON.parse(e.postData.contents);
  const rows = sheet.getDataRange().getValues();
  
  for (let i = 0; i < rows.length; i++) {
    if (rows[i][0] === data.name) {
      sheet.deleteRow(i + 1);
      return ContentService.createTextOutput(JSON.stringify({ success: true }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }
  return ContentService.createTextOutput(JSON.stringify({ error: "Name not found" }))
    .setMimeType(ContentService.MimeType.JSON);
}
