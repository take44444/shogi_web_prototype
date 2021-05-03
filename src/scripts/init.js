/**
 * アプリロード時に一度だけ実行される初期化関数
 */
const init = () => {
  // CSSで100vhの代わりにカスタブオブジェクトvhを利用(スマホ対策)
  document.documentElement.style
      .setProperty('--vh', window.innerHeight + 'px');
  window.onresize = () => {
    document.documentElement.style
        .setProperty('--vh', window.innerHeight + 'px');
  };
};

export default init;
