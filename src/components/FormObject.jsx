import React from 'react';
import '../styles/FormObject.scss';

/**
 * フォームオブジェクト
 * @param {Object} props
 * @param {str} props.type text/
 * @param {string} props.name name属性
 * @param {string} props.value value属性
 * @param {string|boolean} props.placeholder placeholder属性
 * @return {JSX}
 */
function FormObject(props) {
  /**
  * フォームオブジェクト更新時のハンドラ
  * @param {Object} e イベントハンドラ
  */
  const handleChange = (e) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    props.handleChange(value);
  };

  const Text = (
    <input
      type='text'
      name={props.name}
      value={props.value}
      onChange={handleChange}
      className='shogi--form-object-text'
      placeholder={props.placeholder ? props.placeholder : ''} />
  );
  const Objects = {
    text: Text,
  };
  if (Objects[props.type]) {
    return (Objects[props.type]);
  };
  return (<div>The object of {props.type} type is not defined.</div>);
};

export default FormObject;
