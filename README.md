twit-timer
================================================================================

つぶやいたらタイマーをセットするアプリです。

目的
--------------------------------------------------------------------------------

ツイッター上でタイマーが欲しかった。

システム構成
--------------------------------------------------------------------------------

下記のサービスを利用してシステムを構成します。

- GoogleAppScript (定期実行トリガー。cronの代用)
- GoogleSpreadsheet (DB)

使い方
--------------------------------------------------------------------------------

下記のワードでタイマーがセットされます。

```
@jiro_saburomaru timer 10m ラーメン
```
プロジェクトのプロパティ
--------------------------------------------------------------------------------

| プロパティ名             | 説明                                       |
|--------------------------|--------------------------------------------|
| TWITTER_API_KEY          | Twitterアプリ登録で取得したAPIキー         |
| TWITTER_API_SECRET       | Twitterアプリ登録で取得したAPIシークレット |

