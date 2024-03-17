import { formatDate, checkDateTerm } from '../utils';
import ListGroup from 'react-bootstrap/ListGroup';

export default function CompetitionList(props) {
  const { data, renderFunction, ...restProps } = props;

  return (
    <ListGroup {...restProps}>
      {data &&
        data.map((c) => (
          <ListGroup.Item key={c._id}>
            <div>
              <a
                href={`/competitions/${c._id}`}
                target="_blank"
                rel="noreferrer"
              >
                <strong>{c.name}</strong>
              </a>
            </div>
            <div className="text-muted">
              <small>
                <span>📅 대회 날짜: {formatDate(c.date)}</span>
                <span className="mr-2"></span>
                <span
                  className={
                    checkDateTerm(Date.now(), c.regDateStart, c.regDateEnd)
                      ? 'text-success'
                      : ''
                  }
                >
                  ✒️ 접수 기간: {formatDate(c.regDateStart)}~
                  {formatDate(c.regDateEnd)}
                </span>
              </small>
            </div>
            <div className="float-right">
              {renderFunction && renderFunction(c)}
            </div>
          </ListGroup.Item>
        ))}
    </ListGroup>
  );
}
