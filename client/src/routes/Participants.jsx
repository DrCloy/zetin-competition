import { useState, useEffect } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { checkDateTerm } from '../utils';

import Button from 'react-bootstrap/Button';

import ParticipantTable from '../components/ParticipantTable';
import ParticipantView from '../components/ParticipantView';
import ParticipantAuthForm from '../forms/ParticipantAuthForm';
import EntryForm from '../forms/EntryForm';

export default function Participants() {
  const { competition } = useOutletContext();
  const [participants, setParticipants] = useState();
  const [targetParticipant, setTargetParticipant] = useState(null);
  const [modification, setModification] = useState(null);
  const [entryFormProps, setEntryFormProps] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const participantId = searchParams.get('pid');

  useEffect(() => {
    async function getParticipants() {
      try {
        const res = await axios.get('/api/participants', {
          params: {
            competitionId: competition._id,
            dateSort: 'desc',
          },
        });
        setParticipants(res.data);
      } catch (err) {
        alert(err.response?.data);
      }
    }

    if (!participants) {
      getParticipants();
    }
  }, [participants, competition]);

  useEffect(() => {
    async function getTargetParticipant() {
      try {
        const res = await axios.get(`/api/participants/${participantId}`);
        setTargetParticipant(res.data);
      } catch (err) {
        alert(err.response.data);
        setTargetParticipant(null);
      }
    }

    if (participantId) {
      getTargetParticipant();
    } else {
      setTargetParticipant(null);
      setModification(null);
      setEntryFormProps(null);
    }
  }, [participantId]);

  if (targetParticipant) {
    if (modification) {
      return entryFormProps ? (
        <EntryForm {...entryFormProps} />
      ) : (
        <div>
          <p>{modification.message}</p>
          <ParticipantAuthForm
            participant={targetParticipant}
            method={modification.method}
            onSucceed={modification.onSucceed}
            onCancelled={() => setModification(null)}
          />
        </div>
      );
    }

    const isRegistrationPeriod = checkDateTerm(
      Date.now(),
      competition.regDateStart,
      competition.regDateEnd,
    );

    const handlePatchClick = () =>
      setModification({
        method: 'PATCH',
        message: '참가 신청 내용을 수정하려면 비밀번호를 입력해주세요.',
        onSucceed: async (data) => {
          try {
            const { password } = data;
            const res = await axios.get(
              // get more information with authentication
              `/api/participants/${participantId}`,
              { headers: { Authorization: password } },
            );

            setEntryFormProps({
              competition,
              data: res.data,
              auth: password,
              onSubmitted: (res) => {
                setTargetParticipant(res.data);
                setModification(null);
                setEntryFormProps(null);
                alert('참가 신청 내용이 수정되었습니다.');
              },
            });
          } catch (err) {
            alert(err.response?.data);
          }
        },
      });

    const handleDeleteClick = () =>
      setModification({
        method: 'DELETE',
        message: '참가 신청을 취소하려면 비밀번호를 입력해주세요.',
        onSucceed: async (data) => {
          try {
            await axios.delete(`/api/participants/${participantId}`, {
              headers: { Authorization: data.password },
            });
            alert('참가 신청이 취소되었습니다.');
            setSearchParams({});
            setModification(null);
          } catch (err) {
            alert(err.response?.data);
          }
        },
      });

    return (
      <div className="text-right">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setSearchParams({})}
        >
          돌아가기
        </Button>
        <ParticipantView
          participant={targetParticipant}
          className="text-left"
        />
        <div className={isRegistrationPeriod ? 'd-block' : 'd-none'}>
          <Button variant="primary" size="sm" onClick={handlePatchClick}>
            수정
          </Button>{' '}
          <Button variant="danger" size="sm" onClick={handleDeleteClick}>
            참가 취소
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ParticipantTable
      data={participants}
      onClick={(p) => {
        setSearchParams({ pid: p._id });
      }}
      renderHref={(p) => `?pid=${p._id}`}
      countPerPage={15}
    />
  );
}
