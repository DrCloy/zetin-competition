import { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import ReactModal from 'react-modal';
import { Form } from 'react-router-dom';
import Input from './input';

export default function EventInput({
  label,
  name,
  id,
  ...restProps
}: {
  label: string;
  name: string;
  id: string;
}) {
  const {
    register,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext();
  const { ref } = register(name, {
    minLength: 1,
  });
  const value = watch(name);
  const error = errors[name]?.message;

  const [showModal, setShowModal] = useState(false);
  const [targetEvent, setTargetEvent] = useState<{
    item: Object;
    index: number;
  } | null>(null);
  return (
    <div
      className="mb-4 after:content-end after:block after:clear-both"
      ref={ref}
    >
      {label && (
        <label className="inline-block mb-2" htmlFor={id}>
          {label}
        </label>
      )}
      <div className="flex flex-col pl-0 mb-0 border border-gray-300 rounded divide-y">
        {Array.isArray(value) && value.length > 0 ? (
          value.map((item, index) => (
            <div key={index} className="relative block px-5 py-3">
              <div>
                {item.name} ({item.limit})
              </div>
              <div className="text-gray-400 text-sm "></div>
              <div className="float-right">
                <button
                  className="border-0 px-2 py-1 text-sm rounded text-gray-500 inline-block text-center align-middle transition duration-150 ease-in-out
                cursor-pointer active:bg-gray-500 active:text-white hover:bg-gray-500 hover:text-white no-underline focus:shadow-[0_0_0_2px] focus:shadow-[rgba(108,117,125,.5)]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTargetEvent({ item, index });
                    setShowModal(true);
                  }}
                >
                  수정
                </button>
                <button
                  className="cursor-pointer ml-2 border-0 px-2 py-1 text-sm leading-normal rounded text-red-500 inline text-center align-middle transition duration-150 ease-in-out
                  active:bg-red-500 active:text-white hover:bg-red-500 hover:text-white no-underline focus:shadow-[0_0_0_2px] focus:shadow-[rgba(220,53,69,.5)]"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
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
                </button>
              </div>
            </div>
          ))
        ) : (
          <div
            className={`${
              error && 'border-red-600'
            } relative block py-3 px-5 bg-white  `}
          >
            없음
          </div>
        )}
      </div>
      <div
        className={`w-full mt-1 text-sm text-red-600 ${error ? '' : 'hidden'}`}
      >
        {error as string}
      </div>
      <button
        className="cursor-pointer mt-2 float-right px-2 py-1 text-sm leading-normal rounded text-white bg-gray-500 inline-block text-center align-middle border transition duration-150 ease-in-out active:text-white active:bg-gary-500 active:border-gray-500 hover:text-white hover:bg-gray-500 hover:border-gray-500 no-underline focus:shadow-[0_0_0_0.2rem] focus:shadow-[rgba(130,138,145,.5)]  focus:text-white focus:bg-gray-500 focus:border-gray-500"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setTargetEvent(null);
          setShowModal(true);
        }}
      >
        추가
      </button>
      <ReactModal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        overlayClassName="z-[1125] fixed top-0 left-0 bg-black bg-opacity-50 w-full h-full "
        className="max-w-full sm:max-w-md m-2 sm:mx-auto sm:my-7 relative w-auto pointer-events-none"
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
        closeTimeoutMS={200}
      >
        <EventAddition
          isShow={showModal}
          value={targetEvent?.item}
          onHide={() => {
            setShowModal(false);
          }}
          onSubmit={(values: Object) => {
            const arr = value.slice();
            if (targetEvent) {
              arr.splice(targetEvent.index, 1, { ...values });
            } else {
              arr.push({ ...values });
            }
            setValue(name, arr, { shouldValidate: true });
            setShowModal(false);
          }}
        />
      </ReactModal>
    </div>
  );
}

function EventAddition({
  isShow,
  value,
  onHide,
  onSubmit,
}: {
  isShow: boolean;
  value?: Object;
  onHide: () => void;
  onSubmit: (values: Object) => void;
}) {
  const defaultValues = useMemo(() => ({ name: '', desc: '', limit: 0 }), []);
  const form = useForm({ defaultValues });
  const { handleSubmit, reset, register } = form;
  const numbOption = {
    form: {
      min: {
        value: 3,
        message: '참가 인원을 입력해주세요.',
      },
    },
  };

  useEffect(() => {
    if (isShow) {
      reset({ ...defaultValues, ...value });
    }
  }, [defaultValues, isShow, reset, value]);

  return (
    <div className="relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding border border-opacity-20 border-white rounded-md outline-0">
      <div className="flex items-start justify-between p-4">
        <div className="mb-0 text-2xl">
          {value ? '경연 부문 수정' : '새 경연 부문'}
        </div>
        <button className="p-4 -my-4 -mr-4 ml-auto cursor-pointer float-right text-2xl font-bold text-black opacity-50 hover:opacity-75 focus:opacity-75">
          X
        </button>
      </div>
      <FormProvider {...form}>
        <Form
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            handleSubmit(onSubmit)();
          }}
        >
          <div className="relative p-4 box-border border-y border-gray-300">
            <Input
              type="text"
              label="이름"
              name="name"
              id="name"
              advice="경연 부문 이름를 입력해주세요"
            />
            <div className="mb-4">
              <label className="inline-block mb-2" htmlFor="desc">
                설명
              </label>
              <textarea
                id="desc"
                rows={4}
                className="block w-full px-3 py-2 border border-gray-300 rounded transition duration-150 ease-in-out bg-clip-padding 
              focus:text-gray-500 focus:border-blue-400 focus:outline-0 focus:shadow-[0px_0px_0px_0.2rem] focus:shadow-[rgba(0,123,255,.25)]"
                {...register('desc', {})}
              />
            </div>
            <Input
              type="number"
              label="참가 인원"
              name="limit"
              id="limit"
              advice="참가 인원을 입력해주세요."
              otherOption={numbOption}
            />
          </div>
          <div className="flex flex-wrap align-center justify-end p-3">
            <button
              className="cursor-pointer m-1 text-white bg-gray-500 border-gray-500 inline-block text-cneter align-middle border px-3 py-1 rounded transition duration-150 ease-in-out active:bg-gray-600 active:border-gray-600 hover:bg-gray-600 hover:border-gray-600 focus:shadow-[0px_0px_0px_0.2rem] focus:shadow-[rgba(130,138,145,.5)]"
              onClick={onHide}
            >
              취소
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleSubmit(onSubmit)();
              }}
              className="cursor-pointer m-1 text-white bg-blue-500 border-blue-500 inline-block text-center align-middle border px-3 py-1 rounded transition duration-150 ease-in-out active:bg-blue-600 active:border-blue-600 hover:bg-blue-600 hover:border-blue-600 focus:shadow-[0px_0px_0px_0.2rem] focus:shadow-[rgba(38,143,255,.5)]"
            >
              {value ? '수정' : '추가'}
            </button>
          </div>
        </Form>
      </FormProvider>
    </div>
  );
}
