import { CompetitionItem } from 'core/model';
import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { md } from 'service/main';

function Field({
  field,
  title,
  transform,
  markdown = false,
}: {
  field: JSX.Element | string;
  title?: string;
  transform?: (value: string) => JSX.Element;
  markdown?: boolean;
}) {
  if (!field) {
    return null;
  }
  if (transform) {
    field = transform(field as string);
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      {title && <h4 className="font-bold text-2xl">{title}</h4>}
      {markdown ? (
        md.render(field as string)
      ) : (
        <div className="flex flex-wrap gap-2">{field}</div>
      )}
    </div>
  );
}

export default function CompetitionView(props: { hideTitle?: boolean }) {
  const [showMap, setShowMap] = useState(false);
  const { competition }: { competition: CompetitionItem } = useOutletContext();

  const data = competition || (null as CompetitionItem | null);
  if (!data) {
    return null;
  }

  const {
    name,
    description,
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
    <div className="grid grid-cols-1 gap-5">
      {props.hideTitle ? null : (
        <h2 className="font-bold mb-3 flex text-3xl">{name}</h2>
      )}
      <Field field={description} markdown />
      <Field field={date.toLocaleString()} title="📅 일시" />
      <Field
        field={
          regDateStart.toLocaleString() + '~' + regDateEnd.toLocaleString()
        }
        title="✏️ 참가 신청 기간"
      />
      <Field
        field={place}
        title="🗺️ 장소"
        transform={(field) => (
          <>
            {field}
            {googleMap && (
              <>
                <button
                  onClick={() => setShowMap(!showMap)}
                  className="bg-uos-blue-mist no-underline text-white text- rounded p-0.5"
                >
                  {showMap ? '지도 숨기기' : '지도 보기'}
                </button>
                {showMap ? (
                  <iframe
                    title="place"
                    src={googleMap}
                    width="600"
                    height="450"
                    loading="lazy"
                  ></iframe>
                ) : null}
              </>
            )}
          </>
        )}
      />
      <Field field={organizer} title="🎈 주최 및 주관" />
      <Field field={sponser} title="💎 후원" />
      <Field field={prize} title="🏆 시상 내역" markdown />
      <Field
        field={rule}
        title="⚖️ 대회 규정"
        transform={(field) => (
          <button
            onClick={() => window.open(`/api/files/${field}`, '_blank')}
            className="bg-uos-blue-mist no-underline text-white text- rounded p-0.5"
          >
            자세히 보기
          </button>
        )}
      />
      <Field title="📜 추가 정보" field={moreInfo} markdown />
    </div>
  );
}
