import CompetitionList from 'components/competition-list';
import { CompetitionItemMeta } from 'core/model';
import { repo } from 'di';
import { useEffect, useState } from 'react';

export default function CompetitionManagement() {
  const [competitions, setCompetitions] = useState<CompetitionItemMeta[]>([]);

  useEffect(() => {
    async function getCompetitions() {
      const data = await repo.competitionList.getCompetitions();
      setCompetitions(data);
    }
    if (competitions.length === 0) {
      getCompetitions();
    }
  }, [competitions]);
  return (
    <div className="w-full lg:max-w-[60%] p-3 mx-auto">
      <div className="py-6 container px-[15px]">
        <h3 className="text-[1.75rem]">📜 라인트레이서 대회 페이지 목록</h3>
        <p className="mb-4">
          현재 개설된 라인트레이서 대회 페이지 목록입니다. 여기서 페이지를 수정
          및 삭제할 수 있으며, 참가자 목록을 확인할 수 있습니다.
        </p>
        <button className="mb-4 bg-blue-500 border-blue-500 text-white text-center rounded p-[0.375rem_0.75rem]">
          라인트레이서 대회 페이지 만들기
        </button>
        <CompetitionList data={competitions} />
      </div>
    </div>
  );
}
