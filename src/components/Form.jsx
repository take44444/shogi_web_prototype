import React from 'react';

/**
 * フォームグループコンポーネント
 * @param {Object} props
 * @param {JSX} props.children 子要素
 * @return {JSX}
 */
function Form(props) {
  const handleSubmit = (e) => {
    e.preventDefault();
    props.handleSubmit();
  };
  return (
    <form onSubmit={handleSubmit}>
      {props.children}
    </form>
  );
};

export default Form;
