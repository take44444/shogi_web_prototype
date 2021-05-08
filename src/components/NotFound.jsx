import React, {useEffect} from 'react';
import changeTitle from '../scripts/changeTitle';

/**
 * NotFoundコンポーネント
 * @return {JSX} ページコンポーネント
 */
function NotFound() {
  useEffect(() => {
    changeTitle('リクエストエラー');
  });

  return (<div>404 Not Found</div>);
};

export default NotFound;
