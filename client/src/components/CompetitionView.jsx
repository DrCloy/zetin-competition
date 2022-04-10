import React, { useState } from 'react';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import moment from 'moment';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const md = new MarkdownIt();

function CompetitionView(props) {
  const { data } = props;
  const [ruleData, setRuleData] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const fieldWrapper = (field, component, title) => {
    if (field !== undefined && field !== '') {
      return (
        <>
          {title && <h4 className="font-weight-bold">{title}</h4>}
          {component}
        </>
      );
    }
    return null;
  };

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
      <h2 className="font-weight-bold">{name}</h2>
      {fieldWrapper(
        desc,
        <div dangerouslySetInnerHTML={{ __html: md.render(desc) }}></div>,
      )}
      {fieldWrapper(
        date,
        <p>{moment(date).format('YYYY년 MM월 DD일, A hh시 mm분')}</p>,
        '📅 일시',
      )}
      {fieldWrapper(
        place,
        <p>
          {place + ' '}
          {fieldWrapper(
            googleMap,
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
            </>,
          )}
        </p>,
        '🗺️ 장소',
      )}
      {fieldWrapper(organizer, <p>{organizer}</p>, '🎈 주최 및 주관')}
      {fieldWrapper(sponser, <p>{sponser}</p>, '💎 후원')}
      {fieldWrapper(
        prize,
        <div dangerouslySetInnerHTML={{ __html: md.render(prize) }}></div>,
        '🏆 시상 내역',
      )}
      {fieldWrapper(
        rule,
        <p>
          <Button
            variant="link"
            onClick={async () => {
              const res = await axios.get(`/api/rules/${rule}`);
              setRuleData(res.data);
            }}
          >
            자세히 보기
          </Button>
        </p>,
        '⚖️ 대회 규정',
      )}
      {fieldWrapper(
        moreInfo,
        <div dangerouslySetInnerHTML={{ __html: md.render(moreInfo) }}></div>,
        '📜 추가 정보',
      )}
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

export default CompetitionView;
