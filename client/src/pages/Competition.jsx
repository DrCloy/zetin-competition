import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';

import Button from 'react-bootstrap/Button';

import CompetitionView from '../components/CompetitionView';
import PageNotFound from '../components/PageNotFound';

function Competition() {
  const [competition, setCompetition] = useState(null);
  const [isError, setIsError] = useState(false);

  const { id } = useParams();
  const history = useHistory();

  // get the competition document correspond to the id
  useEffect(() => {
    axios
      .get(`/api/competitions/${id}`)
      .then((res) => {
        setCompetition(res.data);
        setIsError(false);
      })
      .catch((err) => {
        setCompetition(null);
        setIsError(err);
      });
  }, [id]);

  // delete the competition document
  const handleDeleteCompetition = () => {
    (async () => {
      try {
        const { data } = await axios.delete(`/api/competitions/${id}`);
        if (data.posterId) {
          await axios.delete(`/api/files/${data.posterId}`);
        }
      } catch (err) {
        console.error(err);
      } finally {
        history.push('/');
      }
    })();
  };

  if (isError) return <PageNotFound />;
  if (competition)
    return (
      <>
        <CompetitionView data={competition} />
        <div className="fixed-bottom w-100 bg-light border-top">
          <div className="container p-3 text-right">
            <Button onClick={() => history.push(`/competitions/edit/${id}`)}>
              수정
            </Button>{' '}
            <Button variant="danger" onClick={handleDeleteCompetition}>
              삭제
            </Button>
          </div>
        </div>
      </>
    );
  return null;
}

export default Competition;
