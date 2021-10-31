import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Table from 'react-bootstrap/Table';

const ParticipantTable = (props) => {
  const { competition, onParticipantClick } = props;
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    async function getParticipants() {
      const res = await axios.get('/api/participants', {
        params: {
          competitionId: competition._id,
          dateSort: 'asc',
        },
      });

      setParticipants(res.data);
    }

    if (competition) {
      getParticipants();
    }
  }, [competition]);

  return (
    <Table striped bordered hover size="sm">
      <thead>
        <tr>
          <th>#</th>
          <th>성명</th>
          <th>소속</th>
          <th>로봇명</th>
        </tr>
      </thead>
      <tbody>
        {participants.map((value, index) => {
          const { _id, name, team, robotName } = value;
          return (
            <tr
              key={_id}
              onClick={
                onParticipantClick &&
                (() => {
                  onParticipantClick(value);
                })
              }
            >
              <td>{index + 1}</td>
              <td>{name}</td>
              <td>{team}</td>
              <td>{robotName}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default ParticipantTable;
