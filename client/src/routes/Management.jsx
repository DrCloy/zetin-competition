import CompetitionListView from '../components/CompetitionListView';

export default function Management() {
  return (
    <div>
      <h3>📜 라인트레이서 대회 페이지 목록</h3>
      <p>
        현재 개설된 라인트레이서 대회 페이지 목록입니다. 여기서 페이지를 수정 및
        삭제할 수 있으며, 참가자 목록을 확인할 수 있습니다.
      </p>
      <CompetitionListView />
    </div>
  );
}
