import './Admin.css';
import React, { useState } from 'react';

import ListGroup from 'react-bootstrap/ListGroup';
import AdminLoginForm from '../forms/AdminLoginForm';

function Admin() {
  const sidebarPages = [
    {
      name: '대회 페이지 목록',
      component: <div>Competition Page List</div>,
    },
    {
      name: '대회 규정 목록',
      component: <div>Competition Rule List</div>,
    },
    {
      name: '참가자 목록',
      component: <div>Participant List</div>,
    },
  ];

  const [pageName, setPageName] = useState('');
  const [page, setPage] = useState(<div></div>);

  const sidebarHandleClick = (clickedPage) => {
    setPageName(clickedPage.name);
    setPage(clickedPage.component);

    console.log(pageName, page);
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
