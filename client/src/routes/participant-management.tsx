import ParticipantForm from 'components/forms/participant-form';
import ParticipantTable from 'components/participant-table';
import ParticipantView from 'components/participant-view';
import {
  CompetitionEvent,
  CompetitionItem,
  CompetitionItemMeta,
  ParticipantInput,
  ParticipantItem,
} from 'core/model';
import { repo } from 'di';
import { useCallback, useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { Link, useSearchParams } from 'react-router-dom';

export default function ParticipantManagement() {
  const [competitions, setCompetitions] = useState<CompetitionItemMeta[]>([]);
  const [targetCompetition, setTargetCompetition] =
    useState<CompetitionItem | null>(null);
  const [targetParticipant, setTargetParticipant] =
    useState<ParticipantItem | null>(null);

  const [searchParams, setSearchParams] = useSearchParams({
    cid: '',
  });
  const competitionId: string = searchParams.get('cid') || '';

  const [showForm, setShowForm] = useState(false);
  const [showView, setShowView] = useState(false);

  useEffect(() => {
    async function fetchCompetitions() {
      try {
        const response = await repo.competitionList.getCompetitionList();
        setCompetitions(response);
      } catch (error) {
        alert('대회 목록을 불러오는 중에 오류가 발생했습니다.');
      }
    }

    if (competitions.length === 0) {
      fetchCompetitions();
    }
  }, [competitions]);

  const loadCompetition = useCallback(async () => {
    const response = await repo.competitionDetail.getCompetitionDetail(
      competitionId,
      true,
    );
    setTargetCompetition(response);
  }, [competitionId]);

  useEffect(() => {
    try {
      if (competitionId) {
        loadCompetition();
      } else {
        setTargetCompetition(null);
      }
    } catch (error) {
      alert('대회 정보를 불러오는 중에 오류가 발생했습니다.');
    }
  }, [competitionId, loadCompetition]);

  const showParticipantEditDialog = async (participant: ParticipantItem) => {
    setTargetParticipant(participant);
    setShowForm(true);
  };

  const showUnparticipationDialog = async (participant: ParticipantItem) => {
    try {
      if (
        window.confirm(
          `정말로 '${participant.name}'의 참가를 취소하시겠습니까?`,
        )
      ) {
        await repo.participantManager.deleteParticipant(
          participant.participantId,
        );
        alert('참가가 취소되었습니다.');
        loadCompetition();
      }
    } catch (error: any) {
      alert(error?.message || error?.response.data);
    }
  };

  const onsubmit = async (data: ParticipantInput) => {
    try {
      if (targetParticipant) {
        await repo.participantManager.updateParticipant(data);
        alert('참가자 정보가 수정되었습니다.');
      } else {
        await repo.participantManager.createParticipant(data);
        alert('참가자가 등록되었습니다.');
      }

      loadCompetition();
    } catch (error: any) {
      alert(error?.message || error?.response.data);
    }
  };

  return (
    <div>
      <h3 className="text-3xl mb-2">👪 대회 참가자 관리</h3>
      <p className="mb-4">
        관리자가 대회 참가자를 수정하거나 삭제할 수 있습니다. 비밀번호를 변경할
        수도 있어서 대회 참가자가 비밀번호를 잊어버렸을 시에 관리자가 임의의
        비밀번호로 설정하여 전달할 수 있습니다.
      </p>
      <div className="mb-4 flex">
        <select
          className="border border-gray-300 rounded-md p-2 w-1/2 px-3 py-1.5 text-base text-gray-700 transition duration-150 ease-in-out
        focus:border-blue-300 focus:outline-0 focus:shadow-[0_0_0_0.2rem] focus:shadow-[rgba(0,123,255,.25)]"
          onChange={(e) => {
            setSearchParams({ cid: e.target.value });
          }}
          value={competitionId}
        >
          <option value="">라인트레이서 대회 선택 ... </option>
          {competitions &&
            competitions.map((competition) => (
              <option key={competition.id} value={competition.id}>
                {competition.name}
              </option>
            ))}
        </select>
        {targetCompetition && (
          <div className="text-right w-1/2 ">
            <button
              className="cursor-pointer mr-1 text-white bg-gray-500 border-gray-500 inline-block text-center align-middle px-3 py-1.5 rounded transition duration-150 ease-in0out
          active:border-gray-600 active:bg-gray-600 hover:bg-gray-600 hover:border-gray-600 focus:outline-0 focus:shadow-[0_0_0_0.2rem] focus:shadow-gray-300"
              onClick={() => {
                setTargetParticipant(null);
                setShowForm(true);
              }}
            >
              참가자 등록
            </button>
            <Link
              to={`/api/competitions/${competitionId}/participants?toCSV=true`}
              target="_blank"
              rel="noreferrer"
              className="cursor-pointer mr-1 text-white bg-gray-500 border-gray-500 inline-block text-center align-middle px-3 py-1.5 rounded transition duration-150 ease-in0out
          active:border-gray-600 active:bg-gray-600 hover:bg-gray-600 hover:border-gray-600 focus:outline-0 focus:shadow-[0_0_0_0.2rem] focus:shadow-gray-300"
            >
              CSV 파일로 내보내기
            </Link>
          </div>
        )}
      </div>
      {targetCompetition &&
        targetCompetition.events.map((event: CompetitionEvent) => (
          <div key={event.id}>
            <h5 className="text-xl mb-2">'{event.name}' 참가자</h5>
            <ParticipantTable
              data={event.participants as ParticipantItem[]}
              countPerPage={10}
              onRobotClick={(participant) => {
                setTargetParticipant(participant);
                setShowView(true);
              }}
              onEditClick={(participant) => {
                showParticipantEditDialog(participant);
              }}
              onUnparticipationClick={(participant) => {
                showUnparticipationDialog(participant);
              }}
            />
          </div>
        ))}
      <ReactModal
        isOpen={showView}
        onRequestClose={() => setShowView(false)}
        shouldCloseOnOverlayClick={false}
        shouldReturnFocusAfterClose={false}
        ariaHideApp={false}
        overlayClassName="fixed top-0 left-0 bg-black bg-opacity-50 z-[1040] w-full h-full transition-opacity ease-linear overflow-y-auto"
        className="block box-border relative max-w-full md:max-w-3xl w-full mx-auto my-7 transition-transform ease-out duration-300 text-gray-800
        overflow-y-auto"
        bodyOpenClassName="overflow-hidden"
        closeTimeoutMS={200}
      >
        <div className="relative flex flex-col w-full bg-white bg-clip-padding border border-white border-opacity-20 rounded-md divide-y divide-slate-300">
          <div className="flex items-start justify-between p-4 mb-0 text-2xl leading-normal">
            참가자 정보
            <button className="float-right" onClick={() => setShowView(false)}>
              X
            </button>
          </div>
          <ParticipantView participant={targetParticipant!} />
        </div>
      </ReactModal>
      <ReactModal
        isOpen={showForm}
        onRequestClose={() => setShowForm(false)}
        overlayClassName="fixed top-0 left-0 bg-black bg-opacity-50 z-[1040] w-full h-full transition-opacity ease-linear overflow-y-auto"
        className="block box-border relative max-w-full md:max-w-3xl w-full mx-auto my-7 transition-transform ease-out duration-300 text-gray-800
        overflow-y-auto"
        bodyOpenClassName="overflow-hidden"
        shouldCloseOnOverlayClick={false}
        closeTimeoutMS={200}
        shouldReturnFocusAfterClose={false}
        ariaHideApp={false}
      >
        <div className="relative flex flex-col w-full bg-white bg-clip-padding border border-white border-opacity-20 rounded-md divide-y divide-slate-300">
          <div className="flex items-start justify-between p-4 mb-0 text-2xl leading-normal">
            {targetParticipant ? '참가자 수정' : '참가자 등록'}
            <button className="float-right" onClick={() => setShowForm(false)}>
              X
            </button>
          </div>
          <ParticipantForm
            competition={targetCompetition!}
            participant={targetParticipant}
            onSubmitted={(data: ParticipantInput) => {
              onsubmit(data);
              loadCompetition();
              setTargetParticipant(null);
              setShowForm(false);
            }}
          />
        </div>
      </ReactModal>
    </div>
  );
}
