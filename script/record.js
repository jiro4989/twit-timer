// recordTimer はタイマーツイートをスプレッドシートに記録します。
function recordTimer() {
  var mentionList = getMentions();
  if (mentionList.length < 1) return;

  // 自分からのツイートのみ抽出
  mentionList = mentionList.filter(function(v) {
    var n = v.user.screen_name;
    if (n == "jiro_saburomaru") return true;
    else return false;
  });
  if (mentionList.length < 1) return;

  // 文言がtimerから始まる
  mentionList = mentionList.filter(function(v) {
    var t = v.text;
    var nt = t.replace(/@[^\s]+\s/g, "")
    if (nt.match(/^timer\s+/)) return true;
    else return false;
  });
  if (mentionList.length < 1) return;

  // timerに続いて数値指定がある
  mentionList = mentionList.filter(function(v) {
    var t = v.text;
    var nt = t.replace(/@[^\s]+\s/g, "")
    if (nt.match(/^timer\s+(\d+)(h|m)/)) return true;
    else return false;
  });
  if (mentionList.length < 1) return;

  var sheet = SpreadsheetApp.getActiveSheet();
  var range = sheet.getRange("B2:G64")

  // スプレッドシートの空レコードの行番号の取得(正確には行番号ではないが)
  var emptyIndex = getEmptyRecordIndex(sheet);
  
  for (var i=0; i<mentionList.length; i++) {
    var item = mentionList[i];
    var tweetId = item.id;

    if (0 < sheet.getRange("B2:B100").getValues().filter(function(v) { return v[0] === tweetId }).length) continue;
    
    var text = item.text;
    text = text.replace(/@[^\s]+\s/g, "")
    var timerTime = Number(text.replace(/^timer\s+(\d+)(h|m)\s+(.*)/, function() { return arguments[1]}));
    var timeType = text.replace(/^timer\s+(\d+)(h|m)\s+(.*)/, function() { return arguments[2]});
    var message = text.replace(/^timer\s+(\d+)(h|m)\s+(.*)/, function() { return arguments[3]});
    Logger.log(timerTime + "分タイマー");
    
    // ツイート時刻と現在時刻の時間差を取得
    var timeDiff = new Date((+new Date()) - (+new Date(item.created_at)));
    var diffMinutes = timeDiff.getMinutes();
    var diffSeconds = timeDiff.getSeconds();

    var timerDate = new Date();
    timerDate.setMinutes(timerDate.getMinutes() + timerTime - diffMinutes);
    timerDate.setSeconds(timerDate.getSeconds() - diffSeconds);

    var mentionFrom = item.user.screen_name;
    var sentTime = item.created_at;
    var sendingTimeOrg = timerDate;
    sheet.getRange(emptyIndex+2, 1).setValue(emptyIndex+1);
    sheet.getRange(emptyIndex+2, 2).setValue(tweetId);
    sheet.getRange(emptyIndex+2, 3).setValue(mentionFrom);
    sheet.getRange(emptyIndex+2, 4).setValue(sentTime);
    sheet.getRange(emptyIndex+2, 5).setValue(timerTime);
    sheet.getRange(emptyIndex+2, 6).setValue(timeType);
    sheet.getRange(emptyIndex+2, 7).setValue(sendingTimeOrg);
    sheet.getRange(emptyIndex+2, 8).setValue(false);
    sheet.getRange(emptyIndex+2, 9).setValue(message);
    
    postTweet("@jiro_saburomaru [" + message + "]のタイマーをセットしました。\n設定時刻：" + formatTime(sendingTimeOrg));
    
    emptyIndex++;
    
    Logger.log("現在時刻:" + formatTime(new Date()));
    Logger.log("警告時刻:" + formatTime(timerDate));
    Logger.log("-------");
  }
}

function getEmptyRecordIndex(sheet) {
  var range = sheet.getRange("B2:G64")

  // スプレッドシートの空レコードの行番号の取得(正確には行番号ではないが)
  var values = range.getValues();
  var emptyIndex = 0;
  for (var i=0; i<values.length; i++) {
    var tweetId = values[i][0];
    if (tweetId.length < 1) {
      emptyIndex = i;
      break;
    }
  }
  return emptyIndex;
}

// formatTime はDate変数から時刻文字列を生成します。
function formatTime(dt) {
  var year    = dt.getFullYear();
  var month   = ("0" + (dt.getMonth() + 1)).slice(-2);
  var date    = ("0" + dt.getDate()).slice(-2);
  var hours   = ("0" + dt.getHours()).slice(-2);
  var minutes = ("0" + dt.getMinutes()).slice(-2);
  var seconds = ("0" + dt.getSeconds()).slice(-2);
  return year + "/" + month + "/" + date + " " + hours + ":" + minutes + ":" + seconds + " GMT+0900(JST)"
}
