import ParticipantAuthForm from 'components/forms/participant-auth-form';
import ParticipantForm from 'components/forms/participant-form';
import ParticipantTable from 'components/participant-table';
import ParticipantView from 'components/participant-view';
import { CompetitionItem, ParticipantInput, ParticipantItem } from 'core/model';
import { repo } from 'di';
import { useEffect, useState } from 'react';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import { checkDateTerm } from 'utils';

type modificationType = {
  message: string;
  onSucceed: (data: { password: string }) => Promise<void>;
};

type entryForm = {
  competition: CompetitionItem;
  participant: ParticipantItem;
  auth?: string;
  onSubmitted?: (data: ParticipantInput) => void;
};

export default function Participants() {
  const { competition }: { competition: CompetitionItem } = useOutletContext();
  const [participants, setParticipants] = useState<ParticipantItem[]>([]);
  const [targetParticipant, setTargetParticipant] =
    useState<ParticipantItem | null>(null);
  const [modification, setModification] = useState<modificationType | null>(
    null,
  );
  const [entryFormProps, setEntryFormProps] = useState<entryForm | null>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const participantId = searchParams.get('pid');
  const page = searchParams.get('page');

  useEffect(() => {
    async function fetchParticipants() {
      try {
        const response = await repo.participantManager.getAllParticipants(
          competition.id,
        );
        console.log(response);
        setParticipants(response);
      } catch (error: any) {
        alert(
          error.response?.data ||
            '참가자 목록을 불러오는 중에 오류가 발생했습니다.',
        );
      }
    }

    if (competition && participants.length === 0) {
      fetchParticipants();
    }

    if (!page && !participantId) {
      setSearchParams({ page: '1' });
    }
  }, [competition, participants, setSearchParams, page, participantId]);

  useEffect(() => {
    if (participantId) {
      const target = participants.find(
        (participant) => participant.participantId === participantId,
      );
      if (target) {
        setTargetParticipant(target);
      }
    } else {
      setTargetParticipant(null);
    }
  }, [participantId, participants]);

  if (targetParticipant) {
    if (modification) {
      return entryFormProps ? (
        <ParticipantForm
          competition={entryFormProps.competition}
          participant={entryFormProps.participant}
          onSubmitted={entryFormProps.onSubmitted}
        />
      ) : (
        <div>
          <p className="mb-4">{modification.message}</p>
          <ParticipantAuthForm
            onSucceed={modification.onSucceed}
            onCancelled={() => setModification(null)}
          />
        </div>
      );
    }

    const isResitrationPeriod = checkDateTerm(
      new Date(),
      competition.regDateStart,
      competition.regDateEnd,
    );

    const handlePatchClick = () =>
      setModification({
        message: '참가 신청 내용을 수정하려면 비밀번호를 입력해주세요.',
        onSucceed: async (data) => {
          try {
            const { password } = data;
            const res = await repo.participantManager.getParticipant(
              targetParticipant.participantId,
              { Authorization: password },
            );

            setEntryFormProps({
              competition,
              participant: res,
              auth: password,
              onSubmitted: async (data: ParticipantInput) => {
                await repo.participantManager.updateParticipant(data);
                setParticipants([]);
                alert('참가 신청 내용이 수정되었습니다.');
                setModification(null);
                setEntryFormProps(null);
              },
            });
          } catch (error) {
            alert('비밀번호가 일치하지 않습니다.');
          }
        },
      });

    const handleDeleteClick = () =>
      setModification({
        message: '참가 신청을 취소하려면 비밀번호를 입력해주세요.',
        onSucceed: async (data) => {
          try {
            await repo.participantManager.deleteParticipant(
              targetParticipant.participantId,
              { Authorization: data.password },
            );
            setParticipants([]);
            alert('참가 신청이 취소되었습니다.');
            setModification(null);
            setSearchParams({ page: page || '1' });
          } catch (error) {
            alert('비밀번호가 일치하지 않습니다.');
          }
        },
      });

    return (
      <div>
        <div className="text-right">
          <button
            className="cursor-pointer px-2 py-1 text-sm leading-normal rounded text-white bg-gray-400 border-gray-400 inline-block text-center align-middle border transition duratio-150 ease-in-out active:bg-gray-600 active:border-gray-600 hover:bg-gray-500 hover:border-gray-500 focus:outline-0 focus:shadow-[0_0_0_0.2rem] focus:shadow-[rgba(130,138,145,.5)]"
            onClick={() => setSearchParams({ page: page || '1' })}
          >
            돌아가기
          </button>
        </div>
        <ParticipantView participant={targetParticipant} />
        <div
          className={`${isResitrationPeriod ? 'block' : 'hidden'} text-right`}
        >
          <button
            className="cursor-pointer px-2 py-1 text-sm leading-normal rounded text-white bg-blue-500 border-blue-500 inline-block text-center align-middle border transition duratio-150 ease-in-out active:bg-blue-700 active:border-blue-700 hover:bg-blue-600 hover:border-blue-600 focus:outline-0 focus:shadow-[0_0_0_0.2rem] focus:shadow-[rgba(38,143,255,.5)]"
            onClick={handlePatchClick}
          >
            수정
          </button>{' '}
          <button
            className="cursor-pointer px-2 py-1 text-sm leading-normal rounded text-white bg-red-500 border-red-500 inline-block text-center align-middle border transition duratio-150 ease-in-out active:bg-red-700 active:border-red-700 hover:bg-red-600 hover:border-red-600 focus:outline-0 focus:shadow-[0_0_0_0.2rem] focus:shadow-[rgba(225,83,97,.5)]"
            onClick={handleDeleteClick}
          >
            참가 취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ParticipantTable
        data={participants}
        countPerPage={10}
        isFunctionActive={false}
        page={parseInt(page || '1')}
        onRobotClick={(participant) => {
          setTargetParticipant(participant);
          setSearchParams({ pid: participant.participantId });
        }}
        onPaginationClick={(page) => {
          setSearchParams({ page: page.toString() });
        }}
      />
    </div>
  );
}
