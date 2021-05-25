# Gameクラス 仕様書
`/src/scripts/game.js`に記述されている**Gameクラス**は将棋盤の状態を保持し、メソッドを通じた入力に応じて将棋盤の状態を計算し、新しい将棋盤の状態を返します。
## コンストラクタ
`Game`クラスはコンストラクタで2つの引数を受け取ります。

    constructor(handleChange, userSession) {
      this.shogiBoard = new ShogiBoard(),
      this.gameState = {
        boardState: [],
        verify: false,
        history: [],
        events: [],
      };
      this.handleChange = handleChange;
      this.handleChange(this.gameState);
    };

- `handleChange`: 将棋盤イベントハンドラ  
  `this.gameState`が変更されたときに、新しい`this.gameState`を引数として実行すると対戦画面のReactコンポーネントのstateが変更され、レンダリングされます。  
  `this.gameState`が変更されるのは次の場合です。
  - コンストラクタ及び`Game`クラスのメソッドが実行された(通信は未完了)   
    この場合必ず`verify: false`とします。
  - 通信が完了した(この場合`verify: true`)

- `userSession` 自分のユーザーセッション情報

## ゲームの状態(`this.gameState`)
`this.gameState`のみがReactコンポーネントに渡される唯一の情報です。this.gameStateの変更があるたびに、`this.handleChange`にこれが渡され、ゲームコンポーネントのstateが変更されます。
### 将棋盤の状態(`this.gameState.boardState`)
将棋盤の各座標と持ち駒に一対一対応する2次元配列です。  
各配列の要素はReactコンポーネントです。
### サーバーでの検証(`this.gameState.verify`)
ゲームの状態がサーバーで検証されているかどうかを保存します。  
### 指し手履歴(`history`)
指し手の履歴を`push`していきます。  
指し手情報は配列で`[pieceId, toX, toY, isReverse]`です。
### イベント(`events`)
王手などの特定のイベント発生時にはイベント名を配列`events`に保存します。定義されたイベントは以下の通りです。
- `put`: 駒をおく
- `invaild`: 無効な手
- `ohte-sente`: ホストが王手
- `ohte-gote`: ゲストが王手
- `tsumi-sente`: ホストが詰み状態(ゲストの勝ち)
- `tsumi-gote`: ゲストが詰み状態(ホストの勝ち)
## 指し手メソッド(`move`)
指し手が実行されたときに、指し手のコードを引数として実行されるメソッドです。  
指し手のコードをもとに新しい`this.gameState`を更新し、`this.handleChange`を実行します。  
同時にサーバーにリクエストを送信し、手が正しいことが返ってきたら`this.gameState.verify = true`に更新して`this.handleChange`を実行します。
## 駒選択メソッド(`getActive`)
ユーザーが駒を選択したらその駒の座標を引数として実行されます。  
選択された駒が移動可能な場所の情報を含む`this.gameState`を作成し、`this.handleChange`を実行します。  
引数に(null, null)が指定された場合は選択された駒をリセット(何も選択されていない状態)します。