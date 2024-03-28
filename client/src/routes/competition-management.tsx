import CompetitionList from 'components/competition-list';

export default function CompetitionManagement() {
  return (
    <div className="mx-32 p-3">
      <div className="py-6 container max-w-[90%] px-[15px] mx-auto">
        <h3 className="text-[1.75rem]">📜 라인트레이서 대회 페이지 목록</h3>
        <p className="mb-4">
          현재 개설된 라인트레이서 대회 페이지 목록입니다. 여기서 페이지를 수정
          및 삭제할 수 있으며, 참가자 목록을 확인할 수 있습니다.
        </p>
        <button className="mb-4 bg-blue-500 border-blue-500 text-white text-center rounded p-[0.375rem_0.75rem]">
          라인트레이서 대회 페이지 만들기
        </button>
        <CompetitionList />
      </div>
    </div>
  );
}
