import './Admin.css';
import React, { useState } from 'react';

import AdminLoginForm from '../forms/AdminLoginForm';
import CompetitionForm from '../forms/CompetitionForm';
import CompetitionListView from '../components/CompetitionListView';

/* Bootstrap Components */
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';

/* Admin Page */
function Admin() {
  const [pageIndex, setPageIndex] = useState(0);
  const [token, setToken] = useState(null);

  const pages = [
    {
      name: '통합 관리 페이지',
      component: (
        <div>
          <h3>📜 라인트레이서 대회 페이지 목록</h3>
          <p>
            현재 개설된 라인트레이서 대회 페이지 목록입니다. 여기서 페이지를
            수정 및 삭제할 수 있으며, 참가자 목록을 확인할 수 있습니다.
          </p>
          <CompetitionListView token={token} />
        </div>
      ),
    },
    {
      name: '라인트레이서 대회 페이지 개설',
      component: (
        <CompetitionForm
          token={token}
          onSubmitSuccess={(id) => {
            alert(`대회 페이지를 성공적으로 개설하였습니다.`);
            setPageIndex(0);
          }}
        />
      ),
    },
  ];

  return (
    <>
      {/* sidebar section */}
      <div className="sidebar bg-light border-right">
        <h3>ZETIN Competition Admin Page</h3>
        {/* admin login component */}
        <hr />
        {token ? (
          <div>
            Welcome, administrator.{' '}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setToken(null)}
            >
              Sign out
            </Button>
          </div>
        ) : (
          <AdminLoginForm onAdminLogin={(t) => setToken(t)} />
        )}
        {/* admin service components */}
        <hr />
        <ListGroup>
          {pages.map((page, index) => (
            <ListGroup.Item
              key={page.name}
              onClick={() => setPageIndex(index)}
              action
              className={pageIndex === index ? 'active' : ''}
            >
              {page.name}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
      {/* page section */}
      <div className="container-page">
        {token ? (
          <Container fluid="sm">
            <h2 className="my-4 text-center font-weight-bold">
              {pages[pageIndex].name}
            </h2>
            <div>{pages[pageIndex].component}</div>
          </Container>
        ) : (
          <div>
            <h1>Blocked!</h1>
            <p>관리자 로그인이 필요합니다.</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Admin;
