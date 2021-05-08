import React, {useEffect, useState} from 'react';
import changeTitle from '../scripts/changeTitle';
import Form from './Form';
import FormObject from './FormObject';
import Popup from './Popup';
import Triangles from './Triangles';
import '../styles/Home.scss';

/**
 * Homeコンポーネント
 * @param {Object} props
 * @param {Object} props.appState
 * @param {Object} handleAppState
 * @return {JSX}
 */
function Home(props) {
  const [namePopup, handleNamePopup] = useState(false);
  const [name, handleName] = useState(props.appState.user.name);

  useEffect(() => {
    changeTitle('ホーム');
  });

  const TrianglesCenterContent = (
    <div className='shogi--home-center-content'>
      <h1>Ne:SHOGI</h1>
      <div>Please Click Here.</div>
    </div>
  );

  return (
    <Triangles
      TrianglesCenterContent={TrianglesCenterContent}
      handleClick={handleNamePopup}
    >
      <Popup show={namePopup} handlePopup={handleNamePopup}>
        <Form>
          <FormObject
            type='text'
            name='name'
            placeholder='将棋太郎'
            value={name}
            handleChange={handleName} />
        </Form>
      </Popup>
    </Triangles>
  );
};

export default Home;
