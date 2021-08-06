import React from 'react';

function PageWrapper(props) {
  return (
    <div className="page">
      <h2 className="text-center my-4">{props.title}</h2>
      {props.page}
    </div>
  );
}

export default PageWrapper;
