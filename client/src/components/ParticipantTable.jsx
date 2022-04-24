import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';

/*
 < Properties >
 * competition: a competition document
 * onParticipantClick: participant click handler
 * searchParamName: set name of query parameter, default is 'pid' 
 */
const ParticipantTable = (props) => {
  const {
    competition,
    onParticipantClick,
    searchParamName,
    countPerPage,
    ...restProps
  } = props;
  const [participants, setParticipants] = useState(null);
  const [activePage, setActivePage] = useState(0);

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

  let tableRows;
  let paginationItems;
  const count = props.countPerPage || 5;
  const offset = activePage * count;

  if (participants) {
    // for pagination
    paginationItems = [];
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

    // for table rows
    tableRows = participants
      .slice(offset, offset + count)
      .map((value, index) => {
        const { _id, name, team, robotName } = value;
        return (
          <tr key={_id}>
            <td>{participants.length - index - offset}</td>
            <td>{name}</td>
            <td>{team}</td>
            <td>
              <a
                href={'?' + (searchParamName || 'pid') + '=' + _id}
                onClick={(e) => {
                  e.preventDefault();
                  onParticipantClick && onParticipantClick(_id);
                }}
              >
                {robotName}
              </a>
            </td>
          </tr>
        );
      });
  } else {
    tableRows = [];
    for (let i = 0; i < count; i++) {
      tableRows.push(
        <tr key={i}>
          <td>-</td>
          <td>-</td>
          <td>-</td>
          <td>-</td>
        </tr>,
      );
    }
  }

  return (
    <div {...restProps}>
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
