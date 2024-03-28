import { CompetitionItemMeta } from 'core/model';
import { repo } from 'di';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { checkDateTerm } from 'utils';

export default function CompetitionList() {
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
    <div className="flex flex-col pl-0 mb-0 border rounded divide-y">
      {competitions.map((competition) => (
        <div key={competition.id} className="px-5 py-3 bg-white">
          <div>
            <Link
              className="text-blue-500 no-underline hover:text-blue-800 hover:underline font-bold"
              to={`/admin/competitions/${competition.id}`}
              target="_blank"
              rel="noreferrer"
            >
              {competition.name}
            </Link>
          </div>
          <div className="text-gray-400">
            <small>
              <span>
                📅 대회 날짜:
                {competition.date.toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
              <span className="mr-2"></span>
              <span
                className={
                  checkDateTerm(
                    new Date(),
                    competition.regDateStart,
                    competition.regDateEnd,
                  )
                    ? 'text-green-500'
                    : 'text-gray-400'
                }
              >
                ✒️ 접수 기간:{' '}
                {competition.regDateStart.toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                ~{' '}
                {competition.regDateEnd.toLocaleString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </small>
          </div>
          <div className="float-right">
            <Link
              className="cursor-pointer px-2 py-1 text-[0.875rem] rounded-[0.2rem] text-gray-400
              text-center align-middle bg-transparent transition ease-in-out duration-150 
              hover:bg-gray-400 hover:text-white hover:no-underline "
              to={`/admin/participants?cid=${competition.id}`}
            >
              참가자 목록
            </Link>
            <button
              className="cursor-pointer border-0 px-2 py-1 text-[0.875rem] rounded-[0.2rem] text-gray-400
            text-center align-middle trasition ease-in-out duration-150
            hover:text-white hover:bg-gray-400 hover:no-underline"
            >
              수정
            </button>
            <button
              className="cursor-pointer border-0 px-2 py-1 text-[0.875rem] rounded-[0.2rem] text-red-600
            text-center align-middle trasition ease-in-out duration-150
            hover:text-white hover:bg-red-600 hover:no-underline"
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
