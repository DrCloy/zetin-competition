import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import moment from 'moment';

import Button from 'react-bootstrap/Button';

import { markdown as md, formatDatetime } from '../utils';

function Field({ field, title, transform, markdown, children }) {
  if (!field) return null;
  if (transform) field = transform(field);
  return (
    <div>
      {title && <h4 className="font-weight-bold">{title}</h4>}
      {markdown ? (
        <div dangerouslySetInnerHTML={{ __html: md.render(field) }}></div>
      ) : (
        <p>{field}</p>
      )}
      {children}
    </div>
  );
}

export default function CompetitionView(props) {
  const [showMap, setShowMap] = useState(false);
  const outletContext = useOutletContext(); // get competition data from Outlet of parent element

  const data =
    props.data || (outletContext && outletContext.competition) || null;
  if (!data) return null;

  const {
    name,
    desc,
    date,
    regDateStart,
    regDateEnd,
    place,
    googleMap,
    organizer,
    sponser,
    prize,
    rule,
    moreInfo,
  } = data;

  return (
    <div>
      {props.hideTitle ? null : (
        <h2 className="font-weight-bold" style={{ wordBreak: 'keep-all' }}>
          {name}
        </h2>
      )}
      <Field field={desc} markdown />
      <Field title="📅 일시" field={formatDatetime(date)} />
      <Field
        title="✏️ 참가 신청 기간"
        field={
          formatDatetime(regDateStart) + ' ~ ' + formatDatetime(regDateEnd)
        }
      />
      <Field
        title="🗺️ 장소"
        field={place}
        transform={(field) => (
          <>
            {field}
            {googleMap && (
              <>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => setShowMap(!showMap)}
                >
                  {showMap ? '지도 가리기' : '지도 보기'}
                </Button>
                {showMap ? (
                  <iframe
                    title="place"
                    className="mb-2 rounded w-100 border-0"
                    src={googleMap}
                    style={{ height: '450px' }}
                    loading="lazy"
                  ></iframe>
                ) : null}
              </>
            )}
          </>
        )}
      />
      <Field title="🎈 주최 및 주관" field={organizer} />
      <Field title="💎 후원" field={sponser} />
      <Field title="🏆 시상 내역" field={prize} markdown />
      <Field
        title="⚖️ 대회 규정"
        field={rule}
        transform={(field) => (
          <Button
            as="a"
            variant="link"
            href={`/api/files/${field}`}
            target="_blank"
            rel="noreferrer"
          >
            자세히 보기
          </Button>
        )}
      />
      <Field title="📜 추가 정보" field={moreInfo} markdown />
    </div>
  );
}
