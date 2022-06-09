import './Competition.css';

import { useState, useEffect } from 'react';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import axios from 'axios';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import Nav from 'react-bootstrap/Nav';

export default function Competition() {
  const { competitionId } = useParams();
  const [competition, setCompetition] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/competitions/${competitionId}`)
      .then((res) => setCompetition(res.data))
      .catch((err) => setCompetition(null));
  }, [competitionId]);

  if (!competition) return null;

  const { name, posterId } = competition;
  return (
    <Container className="my-3" fluid="xl">
      <Row xs={1} sm={2}>
        <Col sm={4}>
          <a
            href={`/api/files/${posterId}`}
            target="_blank"
            rel="noreferrer"
            title="새 창에서 포스터 보기"
          >
            <Image
              className="w-100 mb-2"
              src={`/api/files/${posterId}?thumbnail=true`}
              rounded
            />
          </a>
        </Col>
        <Col sm={8}>
          <h2
            className="font-weight-bold mb-3"
            style={{ wordBreak: 'keep-all' }}
          >
            {name}
          </h2>
          <Nav
            variant="pills"
            className="competition-nav mb-3 rounded bg-light p-2"
          >
            <Nav.Item>
              <Nav.Link as={NavLink} to="" end>
                대회 정보
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to="entry">
                참가 신청
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={NavLink} to="participants">
                참가자 목록
              </Nav.Link>
            </Nav.Item>
          </Nav>
          <Outlet context={{ competition }} />
        </Col>
      </Row>
    </Container>
  );
}
