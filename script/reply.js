function reply() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getRange("A2:I64")
  var values = range.getValues();
  var filteredValues = values.filter(function(v) { return v[7] === false });
  if (filteredValues.length < 1) return;

  for (var i=0; i<filteredValues.length; i++) {
    var item = filteredValues[i];
    var diffTime = (+new Date(item[6])) - (+new Date());
    if (diffTime <= 0) {
      var msg = item[8];
      postTweet("@jiro_saburomaru [" + msg + "]の時間になりました。");
      var r = item[0] + 1;
      sheet.getRange(r, 8).setValue(true);
    }
  }
}

