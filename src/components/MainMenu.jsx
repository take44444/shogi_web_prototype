import React, {useEffect} from 'react';
import changeTitle from '../scripts/changeTitle';
import MenuButton from './MenuButton';
import TriangleSwirls from './TriangleSwirls';

/**
 * メインメニューコンポーネント
 * @param {Object} props
 * @return {JSX}
 */
function MainMenu(props) {
  useEffect(() => {
    changeTitle('メインメニュー');
  });
  return (
    <TriangleSwirls>
      <MenuButton text='部屋作成' />
      <MenuButton text='部屋一覧' />
    </TriangleSwirls>
  );
};

export default MainMenu;
