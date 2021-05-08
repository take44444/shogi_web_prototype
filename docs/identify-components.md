# コンポーネントの特定
バンドルされたjs,cssファイルをブラウザでプレビューしながら該当のコンポーネントjsxファイルおよびscssファイルを特定する手順を記します。
## ブラウザの開発者モード
ブラウザの開発者モードで当該要素のクラスで`shogi--`から始まるものを探します。  
クラス名が`shogi--abc_def-ghi_lmn`だった場合、[命名ルール](./name-rules.md)よりコンポーネント名は`AbcDef`であることがわかります。したがって、該当のファイルは以下のとおりです。
- Reactコンポーネントファイルは`/src/components/AbcDef.jsx`です。
- デザインが記されたファイルは`/src/styles/AbcDef.scss`です。
## React Developer Tools
HTMLの要素ではなくReactコンポーネントでのネスト構造や、各コンポーネントのprops,stateを確認するには**React Developer Tools**が便利です。Chrome, FireFox等で利用できます。
