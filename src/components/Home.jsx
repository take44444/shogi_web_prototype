import React, {useEffect, useState} from 'react';
import changeTitle from '../scripts/changeTitle';
import Form from './Form';
import FormObject from './FormObject';
import Popup from './Popup';
import Triangles from './Triangles';

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

  const TrianglesCenterLink = (
    <div onClick={handleNamePopup.bind(this, true)}>
      Please click here.
    </div>
  );

  return (
    <Triangles
      trianglesCenterTitle='Ne:SHOGI'
      trianglesCenterLink={TrianglesCenterLink}>
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
