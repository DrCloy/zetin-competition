import { CompetitionItem } from 'core/model';
import { useEffect, useState } from 'react';
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { repo } from 'di';
export default function Competition() {
  const { competitionId } = useParams();
  const [competition, setCompetition] = useState<CompetitionItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCompetition() {
      if (!competitionId) {
        navigate('/competition');
        return;
      }
      try {
        const competition = await repo.competitionDetail.getCompetitionDetail(
          competitionId,
        );
        if (!competition) {
          navigate('/competition-error');
          return;
        }
        setCompetition(competition);
      } catch (error) {
        setCompetition(null);
        navigate('/competition-error');
      }
    }
    fetchCompetition();
  }, [competitionId, navigate]);
  return (
    <div className="my-4 max-w-screen-xl w-full px-4 mx-auto box-border block ">
      <div className="flex flex-wrap flex-auto">
        <div className="max-w-full xs:max-w-1/3 w-full mx-2 p-4">
          <Link
            to={`/api/files/${competition?.posterId}/thumbnail`}
            className=""
            target="_blank"
            rel="noreferrer"
            title="새 창에서 포스터 보기"
          >
            <img
              src={`/api/files/${competition?.posterId}`}
              alt=""
              className="w-full h-auto rounded-lg mb-2 aspect-2/3"
            />
          </Link>
        </div>
        <div className="max-w-2/3 mx-2 flex-1 pt-4">
          <div className="inline-block w-full">
            <h2 className="float-left font-bold mb-3 text-3xl">
              {competition?.name}
            </h2>
            <button
              className="float-right cursor-pointer no-underline"
              onClick={() => {
                navigate('/competitions');
              }}
            >
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="w-8 h-8 fill-gray-600 stroke-gray-600 stroke-1 hover:bg-gray-400 hover:fill-white hover:stroke-white hover:stroke-1 rounded-full"
              >
                <path
                  clipRule="evenodd"
                  fillRule="evenodd"
                  d="M17 10a.75.75 0 0 1-.75.75H5.612l4.158 3.96a.75.75 0 1 1-1.04 1.08l-5.5-5.25a.75.75 0 0 1 0-1.08l5.5-5.25a.75.75 0 1 1 1.04 1.08L5.612 9.25H16.25A.75.75 0 0 1 17 10Z"
                />
              </svg>
            </button>
          </div>
          <nav className="rounded grid grid-flow-row bg-light p-2 mb-3">
            <ul className="flex">
              <li>
                <NavLink
                  to={`/competitions/${competitionId}`}
                  className={({ isActive }) =>
                    (isActive
                      ? 'text-white no-underline bg-gray-700 '
                      : 'text-gray-700 hover:text-black hover:underline ') +
                    'px-2 py-2 block cursor-pointer rounded'
                  }
                  end
                >
                  대회 정보
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/competitions/${competitionId}/entry`}
                  className={({ isActive }) =>
                    (isActive
                      ? 'text-white no-underline bg-gray-700 '
                      : 'text-gray-700 hover:text-black hover:underline ') +
                    'px-2 py-2 block cursor-pointer rounded'
                  }
                  end
                >
                  참가 신청
                </NavLink>
              </li>
              <li>
                <NavLink
                  to={`/competitions/${competitionId}/participants`}
                  className={({ isActive }) =>
                    (isActive
                      ? 'text-white no-underline bg-gray-700 '
                      : 'text-gray-700 hover:text-black hover:underline ') +
                    'px-2 py-2 block cursor-pointer rounded'
                  }
                  end
                >
                  참가자 목록
                </NavLink>
              </li>
            </ul>
          </nav>
          <Outlet context={{ competition }} />
        </div>
      </div>
    </div>
  );
}
