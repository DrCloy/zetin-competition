import { ParticipantItem } from 'core/model';
import { useEffect, useState } from 'react';
import DropdownButton from './dropdown-button';

export default function ParticipantTable({
  data,
  countPerPage = 5,
  isFunctionActive = true,
  page,
  onRobotClick,
  onEditClick,
  onUnparticipationClick,
  onPaginationClick,
}: {
  data: ParticipantItem[];
  countPerPage?: number;
  isFunctionActive?: boolean;
  page?: number;
  onRobotClick?: (participant: ParticipantItem) => void;
  onEditClick?: (participant: ParticipantItem) => void;
  onUnparticipationClick?: (participant: ParticipantItem) => void;
  onPaginationClick?: (page: number) => void;
}) {
  const [currentPage, setCurrentPage] = useState(0);
  const [tableData, setTableData] = useState<ParticipantItem[]>([]);
  const [paginationItem, setPaginationItem] = useState<JSX.Element[]>([]);
  const [realData, setRealData] = useState<ParticipantItem[]>([]);
  const offset = currentPage * countPerPage;

  useEffect(() => {
    if (page) {
      setCurrentPage(page - 1);
    }
  }, [page]);

  useEffect(() => {
    if (data) {
      setRealData(
        data
          .filter((p) => p !== null)
          .map((p, i) => ({ ...p, realOrder: i + 1 })),
      );
    }
  }, [data]);

  useEffect(() => {
    const paginationItem = [];
    for (let i = 0; i < realData.length / countPerPage; i++) {
      paginationItem.push(
        <button
          key={i}
          className={`${
            currentPage === i
              ? 'bg-blue-500 text-white border-blue-500'
              : 'bg-white text-blue-500 border-gray-300 last:border-r'
          } ${
            currentPage === i - 1 ? '' : 'border-l'
          }  border-y px-2 py-1 max-w-fit first:rounded-l last:rounded-r`}
          onClick={() => {
            setCurrentPage(i);
            onPaginationClick && onPaginationClick(i + 1);
          }}
        >
          {i + 1}
        </button>,
      );
    }

    setPaginationItem(paginationItem);

    if (realData.length) {
      setTableData(
        realData.slice(
          offset,
          offset + countPerPage > realData.length
            ? realData.length
            : offset + countPerPage,
        ),
      );
    }
  }, [realData, currentPage, countPerPage, offset, onPaginationClick]);

  return (
    <div>
      <table className="table indent-[initial] border-spacing-0.5 border-gray-400 mb-4 w-full border-collapse box-border table-auto text-center">
        <thead className="table-header-group align-middle border-b-2 border-t border-b-gray-300">
          <tr>
            <td className="align-bottom p-1.5 font-bold table-cell">#</td>
            <td className="align-bottom p-1.5 font-bold table-cell">성명</td>
            <td className="align-bottom p-1.5 font-bold table-cell">소속</td>
            <td className="align-bottom p-1.5 font-bold table-cell">로봇명</td>
            {isFunctionActive && (
              <td className="align-bottom p-1.5 font-bold table-cell">기능</td>
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300 table-row-group align-middle border-spacing-0.5">
          {tableData &&
            tableData.map((participant, index) => (
              <tr key={index} className="odd:bg-gray-100 hover:bg-gray-200">
                <td className="p-1.5 table-cell">{participant.realOrder}</td>
                <td className="p-1.5 table-cell">{participant.name}</td>
                <td className="p-1.5 table-cell">{participant.team}</td>
                <td className="p-1.5 table-cell">
                  {onRobotClick ? (
                    <div
                      className="text-blue-500 no-underline hover:text-blue-700 hover:underline"
                      onClick={() => {
                        if (onRobotClick) {
                          onRobotClick(participant);
                        }
                      }}
                    >
                      {participant.robotName}
                    </div>
                  ) : (
                    <>{participant.robotName}</>
                  )}
                </td>
                {isFunctionActive && (
                  <td className="p-1.5 table-cell">
                    <DropdownButton
                      outerItem={
                        <svg
                          id="Layer_1"
                          version="1.1"
                          viewBox="0 0 512 512"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="currentColor"
                          className="h-3 w-3 text-blue-500"
                        >
                          <path d="M98.9,184.7l1.8,2.1l136,156.5c4.6,5.3,11.5,8.6,19.2,8.6c7.7,0,14.6-3.4,19.2-8.6L411,187.1l2.3-2.6  c1.7-2.5,2.7-5.5,2.7-8.7c0-8.7-7.4-15.8-16.6-15.8v0H112.6v0c-9.2,0-16.6,7.1-16.6,15.8C96,179.1,97.1,182.2,98.9,184.7z"></path>
                        </svg>
                      }
                      outerOptions={{
                        className:
                          'no-underline inline-flex text-center align-middle justify-center w-full px-4 py-2 text-sm font-normal text-blue transision ease-in-out duration-150 hover:text-blue-600 focus:outline-0 focus:shadow-[0_0_0_0_0.2rem] focus:shadow-[rgba(0,123,255,.25)]',
                      }}
                      innerItems={[
                        {
                          label: '수정',
                          onClick: () => {
                            if (onEditClick) {
                              onEditClick(participant);
                            }
                          },
                        },
                        {
                          label: '참가 취소',
                          onClick: () => {
                            if (onUnparticipationClick) {
                              onUnparticipationClick(participant);
                            }
                          },
                        },
                      ]}
                    />
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
      <div className="w-fit items-center justify-center mx-auto grid grid-flow-col mb-4">
        {paginationItem.length ? paginationItem : null}
      </div>
    </div>
  );
}
