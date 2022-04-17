import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';

const ParticipantTable = (props) => {
  const { competition, onParticipantClick } = props;
  const [participants, setParticipants] = useState([]);
  const [activePage, setActivePage] = useState(0);

  const countPerPage = props.countPerPage || 5;

  useEffect(() => {
    async function getParticipants() {
      const res = await axios.get('/api/participants', {
        params: {
          competitionId: competition._id,
          dateSort: 'desc',
        },
      });

      setParticipants(res.data);
    }

    if (competition) {
      getParticipants();
    }
  }, [competition]);

  const paginationItems = [];
  for (let i = 0; i < participants.length / countPerPage; i++) {
    paginationItems.push(
      <Pagination.Item
        key={i}
        active={i === activePage}
        onClick={() => setActivePage(i)}
      >
        {i + 1}
      </Pagination.Item>,
    );
  }

  const offset = activePage * countPerPage;
  const tableRows = participants
    .slice(offset, offset + countPerPage)
    .map((value, index) => {
      const { _id, name, team, robotName } = value;
      return (
        <tr key={_id}>
          <td>{participants.length - index - offset}</td>
          <td>{name}</td>
          <td>{team}</td>
          <td>
            <a
              href={`#${robotName}`}
              onClick={(e) => {
                e.preventDefault();
                onParticipantClick && onParticipantClick(value);
              }}
            >
              {robotName}
            </a>
          </td>
        </tr>
      );
    });

  return (
    <div>
      <Table striped bordered hover size="sm" className="text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>성명</th>
            <th>소속</th>
            <th>로봇명</th>
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
      <Pagination size="sm" className="justify-content-center">
        {paginationItems}
      </Pagination>
    </div>
  );
};

export default ParticipantTable;
