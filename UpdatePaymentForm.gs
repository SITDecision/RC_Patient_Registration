function updatePatientNameDropdownInForm() {
    var sheetName = 'УчетПациентов_';
    var sheet = SpreadsheetApp
        .getActiveSpreadsheet()
        .getSheetByName(sheetName);

    var checkNumberRowsToSelect = sheet.getRange("F1:F1").getValue();
    if (checkNumberRowsToSelect != 'Кол-во заполненных') {
        throw new Error('there in no number for calculating filled data');
    }

    var patientNames = getUniquePatientNames(sheet);
    refreshDataOnForm(patientNames);
    Logger.log('patients dropdown was filled for the payment form');
}

//private
function refreshDataOnForm(patientNames) {
    var form = FormApp.openById("1jaApM6nciebLEqvT2yOPVHMj63sDKZrwKc4NZ1Kp3v8");
    var patientNamesDropdownId = '1690273101';
  
    var namesList = form.getItemById(patientNamesDropdownId).asListItem();
    namesList.setChoiceValues(patientNames);
}

//private
function getUniquePatientNames(sheet) {
    var numberRowsToSelect = sheet.getRange("G1:G1").getValue();

    return sheet
        .getRange(8, 2, numberRowsToSelect)
        .getValues()
        .map(function (element) {
            return element.toString();
        })
        .filter(function (element, pos, arr) {
            return arr.indexOf(element) === pos;
        })
        .filter(function(element){
            return element != '';
        });
}