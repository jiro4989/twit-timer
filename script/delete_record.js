// deleteRecord は削除フラグの立っていないレコードを削除します。
function deleteRecords() {
  var mentionList = getMentions();
  if (mentionList.length < 1) return;

  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getRange("A2:H" + MAX_RECORD_COUNT);
  var values = range.getValues();
  record: for (var i=values.length-1; 0<=i; i--) {
    var value = values[i];
    var flag = value[7];
    if (flag === true) {
      for (var j=0; j<mentionList.length; j++) {
        var mention = mentionList[j];
        var id = mention.id;
        var recordedId = value[1];
        if (id === recordedId) continue record;
      }

      var recordIndex = i + 2;
      sheet.deleteRow(recordIndex);
    }
  }
  updateRecordsIndex();
}

// updateRecordIndex はレコードの行番号を更新します。
function updateRecordsIndex() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getRange("A2:A" + MAX_RECORD_COUNT);
  var values = range.getValues();
  for (var i=0; i<values.length; i++) {
    if (values[i][0]==="") break;
    sheet.getRange(i+2, 1).setValue("" + (i+1));
  }
}
