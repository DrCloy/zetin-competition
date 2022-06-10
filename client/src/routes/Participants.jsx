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
  const [participant, setParticipant] = useState(null);
  const [modification, setModification] = useState(null);
  const [entryFormData, setEntryFormData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const participantId = searchParams.get('pid');

  const isRegistrationPeriod = checkDateTerm(
    Date.now(),
    competition.regDateStart,
    competition.regDateEnd,
  );

  useEffect(() => {
    if (participantId) {
      axios
        .get(`/api/participants/${participantId}`)
        .then((res) => setParticipant(res.data))
        .catch((err) => setParticipant(null));
    } else {
      setParticipant(null);
      setModification(null);
      setEntryFormData(null);
    }
  }, [participantId]);

  return participant ? (
    modification ? (
      entryFormData ? (
        <EntryForm {...entryFormData} />
      ) : (
        <>
          <p>{modification.message}</p>
          <ParticipantAuthForm
            participant={participant}
            method={modification.method}
            onSucceed={modification.onSucceed}
            onCancelled={() => setModification(null)}
          />
        </>
      )
    ) : (
      <>
        <div className="text-right">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSearchParams({})}
          >
            돌아가기
          </Button>
        </div>
        <ParticipantView participant={participant} />
        <div className={`text-right${isRegistrationPeriod ? ' ' : ' d-none'}`}>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setModification({
                method: 'PATCH',
                message: '참가 신청 내용을 수정하려면 비밀번호를 입력해주세요.',
                onSucceed: async (data) => {
                  const { password } = data;
                  const resParticipant = await axios.get(
                    // get more information with authentication
                    `/api/participants/${participantId}`,
                    { headers: { Authorization: password } },
                  );
                  setEntryFormData({
                    competition,
                    data: resParticipant.data,
                    auth: password,
                    onSubmitted: (res) => {
                      setParticipant(res.data);
                      setModification(null);
                      setEntryFormData(null);
                      alert('참가 신청 내용이 수정되었습니다.');
                    },
                  });
                },
              });
            }}
          >
            수정
          </Button>{' '}
          <Button
            variant="danger"
            size="sm"
            onClick={() =>
              setModification({
                method: 'DELETE',
                message: '참가 신청을 취소하려면 비밀번호를 입력해주세요.',
                onSucceed: async (data) => {
                  const { password } = data;
                  await axios.delete(`/api/participants/${participantId}`, {
                    headers: { Authorization: password },
                  });
                  setSearchParams({});
                  setModification(null);
                  alert('참가 신청이 취소되었습니다.');
                },
              })
            }
          >
            참가 취소
          </Button>
        </div>
      </>
    )
  ) : (
    <ParticipantTable
      competition={competition}
      onParticipantClick={(pid) => {
        setSearchParams({ pid });
      }}
      countPerPage={10}
      searchParamName={'pid'}
      className={participant && 'd-none'}
    />
  );
}
