import React from 'react';

function PageWrapper(props) {
  const { title, subTitle, page } = props;

  return (
    <div className="page">
      <div className="my-4">
        {title && <h2 className="text-center">{title}</h2>}
        {subTitle && <h5 className="text-center text-muted">{subTitle}</h5>}
      </div>
      {page}
    </div>
  );
}

export default PageWrapper;
