# MVC_Chat_wsServer

WebSocket server for MVC_Chat

Usage
```bash
npm start
```

## 送信時
WebSocketサーバへ送るJSONの形式
```js
{
  body : 'string: メッセージの内容',
  to : 'string: 宛先(ip:port)、*でブロードキャスト',
  option : {object: 好きなメタデータを送る用、省略可能}
}

```

## 受信時
WebSocketサーバから受け取るJSONの形式
```js
{
  body : 'string: メッセージの内容',
  from : 'string: 送信元(ip:port)',
  isBroad : boolean: ブロードキャストで送られていたらtrue,
  option : {object: メタデータ}
}

```
クライアントが接続/切断した時にWebSocketサーバからブロードキャストで受け取るJSONの形式
```js
{
  body: 'ip:port Connected/Disconnected',
  from: 'server',
  isBroad: true,
  option: { onlineList: ['ip:port'] },
}
```
