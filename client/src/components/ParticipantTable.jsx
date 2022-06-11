import { useState } from 'react';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';

export default function ParticipantTable(props) {
  const {
    data,
    renderFunction,
    renderHref,
    onClick,
    countPerPage,
    ...restProps
  } = props;

  const [activePage, setActivePage] = useState(0);
  let tableRows;
  const paginationItems = [];
  const count = props.countPerPage || 5;
  const offset = activePage * count;

  if (data) {
    // for pagination
    for (let i = 0; i < data.length / countPerPage; i++) {
      paginationItems.push(
        <Pagination.Item
          key={i}
          active={i === activePage}
          onClick={() => setActivePage(i)}
        >
          {i + 1}
        </Pagination.Item>,
      );
    }

    // for table rows
    tableRows = data.slice(offset, offset + count).map((value, index) => {
      const { _id, name, team, robotName } = value;
      return (
        <tr key={_id}>
          <td>{data.length - index - offset}</td>
          <td>{name}</td>
          <td>{team}</td>
          <td>
            <a
              href={renderHref ? renderHref(value) : '#'}
              onClick={(e) => {
                e.preventDefault();
                onClick && onClick(value);
              }}
            >
              {robotName}
            </a>
          </td>
          {renderFunction ? <td>{renderFunction(value)}</td> : null}
        </tr>
      );
    });
  }

  return (
    <div {...restProps}>
      <Table striped hover size="sm" className="text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>성명</th>
            <th>소속</th>
            <th>로봇명</th>
            {renderFunction ? <th>기능</th> : null}
          </tr>
        </thead>
        <tbody>{tableRows}</tbody>
      </Table>
      <Pagination size="sm" className="justify-content-center">
        {paginationItems.length ? paginationItems : null}
      </Pagination>
    </div>
  );
}
