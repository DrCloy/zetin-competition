import { useEffect, useState, useMemo } from 'react';
import { useForm, useFormContext, FormProvider } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import Modal from 'react-bootstrap/Modal';

import Input from './Input';

export default function EventInput(props) {
  const { id, label, name, className, ...restProps } = props;

  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { ref } = register(name);
  const value = watch(name);
  const error = errors[name]?.message;

  const [showModal, setShowModal] = useState(false);
  const [targetEvent, setTargetEvent] = useState(null); // Object: { item: Object, index: Number }

  return (
    <Form.Group
      ref={ref}
      tabIndex={-1} // for focusing by script
      controlId={id}
      className={'clearfix' + (className ? ` ${className}` : '')}
      {...restProps}
    >
      {label && <Form.Label>{label}</Form.Label>}
      <ListGroup className={error && 'is-invalid'}>
        {Array.isArray(value) && value.length ? (
          value.map((item, index) => (
            <ListGroup.Item key={item.name}>
              <div>
                {item.name} ({item.numb})
              </div>
              <div className="text-muted small">{item.desc}</div>
              <div className="float-right">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="border-0"
                  onClick={() => {
                    setTargetEvent({ item, index });
                    setShowModal(true);
                  }}
                >
                  수정
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="border-0 ml-2"
                  onClick={() => {
                    if (
                      window.confirm(
                        `정말로 '${item.name}' 경연 부문을 삭제하시겠습니까?`,
                      )
                    ) {
                      const arr = value.slice();
                      arr.splice(index, 1);
                      setValue(name, arr, { shouldValidate: true });
                    }
                  }}
                >
                  삭제
                </Button>
              </div>
            </ListGroup.Item>
          ))
        ) : (
          <ListGroup.Item className={error && 'border-danger'}>
            없음
          </ListGroup.Item>
        )}
      </ListGroup>
      <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      <Button
        variant="secondary"
        size="sm"
        className="float-right mt-2"
        onClick={() => {
          setTargetEvent(null);
          setShowModal(true);
        }}
      >
        추가
      </Button>
      <EventModal
        show={showModal}
        value={targetEvent?.item}
        resolver={yupResolver(
          yup.object({
            name: yup.string().required('경연 부문 이름을 입력해주세요.'),
            numb: yup
              .number()
              .min(1, '참가 인원은 1명 이상이어야 합니다.')
              .required('참가 인원을 입력해주세요.'),
          }),
        )}
        onHide={() => setShowModal(false)}
        onSubmit={(values) => {
          const arr = value.slice();
          if (targetEvent) {
            arr.splice(targetEvent.index, 1, { ...values }); // modify
          } else {
            arr.push({ ...values }); // add
          }
          setValue(name, arr, { shouldValidate: true });
          setShowModal(false);
        }}
      />
    </Form.Group>
  );
}

function EventModal(props) {
  const { show, value, resolver, onHide, onSubmit } = props;

  const defaultValues = useMemo(() => ({ name: '', desc: '', numb: 0 }), []);
  const form = useForm({ defaultValues, resolver });
  const { handleSubmit, reset } = form;

  useEffect(() => {
    if (show) {
      reset({ ...defaultValues, ...value });
    }
  }, [show, reset, defaultValues, value]);

  return (
    <Modal show={!!show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>{value ? '경연 부문 수정' : '새 경연 부문'}</Modal.Title>
      </Modal.Header>
      <FormProvider {...form}>
        <Form noValidate>
          <Modal.Body>
            <Input type="text" label="이름" name="name" id="eventName" />
            <Input
              as="textarea"
              label="설명"
              name="desc"
              rows={4}
              id="eventDesc"
            />
            <Input
              type="number"
              label="참가 인원"
              name="numb"
              min="0"
              id="eventNumb"
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={onHide}>
              취소
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              {value ? '수정' : '추가'}
            </Button>
          </Modal.Footer>
        </Form>
      </FormProvider>
    </Modal>
  );
}
