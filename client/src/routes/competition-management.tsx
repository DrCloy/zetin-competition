import CompetitionList from 'components/competition-list';
import CompetitionForm from 'components/forms/competition-form';
import { CompetitionItem, CompetitionItemMeta } from 'core/model';
import { repo } from 'di';
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';

export default function CompetitionManagement() {
  const [competitions, setCompetitions] = useState<CompetitionItemMeta[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [target, setTarget] = useState<CompetitionItem | null>(null);

  useEffect(() => {
    async function getCompetitions() {
      const data = await repo.competitionList.getCompetitionList();
      setCompetitions(data);
    }
    if (competitions.length === 0) {
      getCompetitions();
    }
  }, [competitions]);

  const showPatchDialog = async (competition: CompetitionItemMeta) => {
    try {
      const response = await repo.competitionDetail.getCompetitionDetail(
        competition.id,
      );
      setTarget(response);
      setShowForm(true);
    } catch (error: any) {
      window.alert(error.response?.data);
    }
  };

  const showDeleteDialog = async (competition: CompetitionItemMeta) => {
    try {
      if (
        window.confirm(
          `정말로 '${competition.name}' 라인트레이서 경연 대회 페이지를 삭제하시겠습니까?`,
        )
      ) {
        await repo.competitionDetail.deleteCompetition(competition.id);
        setCompetitions(competitions.filter((c) => c.id !== competition.id));
      }
    } catch (error: any) {
      window.alert(error.response?.data);
    }
  };

  return (
    <>
      <div>
        <h3 className="text-[1.75rem]">📜 라인트레이서 대회 페이지 목록</h3>
        <p className="mb-4">
          현재 개설된 라인트레이서 대회 페이지 목록입니다. 여기서 페이지를 수정
          및 삭제할 수 있으며, 참가자 목록을 확인할 수 있습니다.
        </p>
        <button
          className="mb-4 bg-blue-500 border-blue-500 text-white text-center rounded p-[0.375rem_0.75rem]"
          onClick={() => {
            setShowForm(true);
            setTarget(null);
          }}
        >
          라인트레이서 대회 페이지 만들기
        </button>
        <CompetitionList
          data={competitions}
          onPatchClick={showPatchDialog}
          onDeleteClick={showDeleteDialog}
        />
      </div>
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
        <div className="relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding border border-white border-opacity-20 rounded-md divide-y divide-slate-300">
          <div className="flex items-start justify-between p-4 mb-0 text-2xl">
            {target
              ? '라인트레이서 대회 페이지 수정'
              : '라인트레이서 대회 페이지 만들기'}
            <button className="float-right" onClick={() => setShowForm(false)}>
              X
            </button>
          </div>
          <div className="relative flex-auto p-4">
            <CompetitionForm
              isOpen={showForm}
              competition={target}
              onSubmitted={(response) => {
                setCompetitions([]);
                setShowForm(false);
              }}
            />
          </div>
        </div>
      </ReactModal>
    </>
  );
}
