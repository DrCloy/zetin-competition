import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import moment from 'moment';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const md = new MarkdownIt();
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
  const [ruleData, setRuleData] = useState(null);
  const [showMap, setShowMap] = useState(false);
  const outletContext = useOutletContext(); // get competition data from Outlet of parent element

  const data =
    props.data || (outletContext && outletContext.competition) || null;
  if (!data) return null;

  const {
    name,
    desc,
    date,
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
      <Field
        title="📅 일시"
        field={date}
        transform={(field) =>
          moment(field).format('YYYY년 MM월 DD일, A hh시 mm분')
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
            variant="link"
            onClick={async () => {
              const res = await axios.get(`/api/rules/${field}`);
              setRuleData(res.data);
            }}
          >
            자세히 보기
          </Button>
        )}
      />
      <Field title="📜 추가 정보" field={moreInfo} markdown />

      {/* Modal for Competition Rule */}
      <Modal
        size="lg"
        show={ruleData ? true : false}
        onHide={() => setRuleData(null)}
      >
        {ruleData && (
          <>
            <Modal.Header closeButton>
              <Modal.Title>{`${ruleData.name} (${ruleData.version})`}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div
                dangerouslySetInnerHTML={{
                  __html: md.render(ruleData.content),
                }}
              ></div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setRuleData(null)}>
                닫기
              </Button>
            </Modal.Footer>
          </>
        )}
      </Modal>
    </div>
  );
}
