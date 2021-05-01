export const init = () => {
    // CSSで100vhの代わりにカスタブオブジェクトvhを利用(スマホ対策)
    document.documentElement.style.setProperty('--vh', window.innerHeight + 'px');
    window.onresize = () => {
        document.documentElement.style.setProperty('--vh', window.innerHeight + 'px');
    };
  };
