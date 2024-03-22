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
        <div className="max-w-full xs:max-w-1/3 mx-2">
          <Link
            to={`/api/files/${competition?.posterId}`}
            className=""
            target="_blank"
            rel="noreferrer"
            title="새 창에서 포스터 보기"
          >
            <img
              src={`/api/files/${competition?.posterId}`}
              alt=""
              className="w-full h-auto rounded mb-2 aspect-2/3"
            />
          </Link>
        </div>
        <div className="max-w-2/3 mx-2 flex-1">
          <h2 className="font-bold mb-3 flex text-3xl">{competition?.name}</h2>
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
