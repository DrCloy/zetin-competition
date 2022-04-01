import './Admin.css';
import React, { useState } from 'react';

import ListGroup from 'react-bootstrap/ListGroup';
import AdminLoginForm from '../forms/AdminLoginForm';

function Admin() {
  const sidebarPages = [
    {
      name: '페이지1',
      component: <div>페이지1 컴포넌트</div>,
    },
    {
      name: '페이지2',
      component: <div>페이지2 컴포넌트</div>,
    },
    {
      name: '페이지3',
      component: <div>페이지3 컴포넌트</div>,
    },
  ];

  const [pageName, setPageName] = useState('');
  const [page, setPage] = useState(<div></div>);

  const sidebarHandleClick = (clickedPage) => {
    setPageName(clickedPage.name);
    setPage(clickedPage.component);
  };

  return (
    <>
      <div className="sidebar bg-light">
        <h3>ZETIN Competition Admin Page</h3>
        <hr />
        <AdminLoginForm />
        <hr />
        <ListGroup>
          {sidebarPages.map((page) => (
            <ListGroup.Item
              key={page.name}
              onClick={() => sidebarHandleClick(page)}
              action
              className={pageName === page.name ? 'active' : ''}
            >
              {page.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      <div className="page">{page}</div>
    </>
  );
}

export default Admin;
