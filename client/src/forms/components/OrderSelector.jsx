import './OrderSelector.css';
import { useRef, useMemo, useEffect, createRef } from 'react';

export default function OrderSelector(props) {
  const { value, count, occupiedOrders, className, onClick, ...restProps } =
    props;
  const previousValue = useRef(-1);

  const [orders, refs] = useMemo(() => {
    // PREFORMANCE OPTIMIZATION
    // make order elements only once unless properties did not change
    // to prevent unnecessary re-rendering.
    const arrElem = [];
    const arrRef = [];

    const handleClick = (e) => {
      if (!onClick) return null;
      return () => onClick(e);
    };

    for (let i = 0; i < count; i++) {
      arrRef[i] = createRef();
      arrElem[i] = (
        <div
          className={'order' + (occupiedOrders?.[i] ? ' occupied' : '')}
          key={i}
          ref={arrRef[i]}
          onClick={handleClick(i + 1)}
        >
          {i + 1}
        </div>
      );
    }
    return [arrElem, arrRef];
  }, [count, occupiedOrders, onClick]);

  useEffect(() => {
    // PREFORMANCE OPTIMIZATION
    // remember previous value and remove 'selected' class
    // and add 'selected' class to current value
    const curr = value - 1;
    const prev = previousValue.current - 1;
    if (curr === prev) return;

    const currentRef = refs[curr];
    const previousRef = refs[prev];

    currentRef && currentRef.current.classList.add('selected');
    previousRef && previousRef.current.classList.remove('selected');

    previousValue.current = value;
  }, [value, refs]);

  return (
    <div className={'order-selector ' + className} {...restProps}>
      {orders}
    </div>
  );
}
