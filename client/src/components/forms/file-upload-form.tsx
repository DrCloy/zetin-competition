import { FileData, FileInput } from 'core/model';
import { repo } from 'di';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Form } from 'react-router-dom';
import Input from './components/input';

export default function FileUploadForm({
  data,
  onSubmitted,
}: {
  data: FileData | null;
  onSubmitted: (response: FileData) => void;
}): JSX.Element {
  const form = useForm<FileInput>({
    defaultValues: {
      name: data?.name || '',
      description: data?.description || '',
      file: {} as FileList,
      private: data?.private || false,
    },
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const error = errors.file?.message;
  const file = watch('file');

  //   const [fileName, setFileName] = useState<string>('');

  const onSubmit = async (values: FileInput) => {
    try {
      let response = null;
      const submitData = {
        ...values,
        id: data?.id,
      };

      if (data) {
        response = await repo.fileManager.updateFile(submitData);
      } else {
        response = await repo.fileManager.uploadFile(submitData);
      }

      onSubmitted && onSubmitted(response);
    } catch (error: any) {
      alert(error.response?.data);
    }
  };

  useEffect(() => {
    reset({
      name: data?.name || '',
      description: data?.description || '',
      file: {} as FileList,
      private: data?.private || false,
    });
  }, [reset, data]);

  return (
    <FormProvider {...form}>
      <Form
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
          }
        }}
      >
        <div className="relative flex-auto p-4">
          <div className="mb-4 box-border block">
            <label className="inline-block mb-2">파일 업로드</label>
            <div className="relative w-full h-[38px] inline-block mb-0 box-border">
              <input
                type="file"
                id="file"
                className="z-[2] overflow-hidden opacity-0 relative h-full w-full"
                {...register('file', {
                  validate: (value) =>
                    data || value.length > 0 ? true : '파일을 선택해주세요.',
                })}
              />
              <label
                htmlFor="file"
                className={`h-full absolute top-0 right-0 px-3 py-1.5 text-gray-700 left-0 z-[1] overflow-hidden bg-white border border-gray-300 rounded inline-block mb-2 box-border transition duration-150 ease-in-out after:content-['Browse'] after:z-[3] after:block after:h-full after:bg-gray-200 after:text-gray-700 after:px-3 after:py-1.5 after:absolute after:top-0 after:right-0 after:box-border ${
                  !error
                    ? ''
                    : 'border-red-500 focus:shadow-[0px_0px_0px_0.2rem] focus:shadow-[rgba(220,53,69,.25)] bg-[right_calc(0.375em+0.1875rem)_center] bg-[length:calc(0.75em+0.375rem)_calc(0.75em+0.375rem)]'
                }`}
              >
                {file.length > 0 ? file[0].name : ''}
              </label>
              <div className="w-full mt-1 text-sm text-red-600">
                {error as string}
              </div>
            </div>
          </div>
          <div className="mb-4 block box-border relative">
            <input type="checkbox" id="private" {...register('private')} />
            <label htmlFor="private" className="ml-2">
              파일 비공개(관리자 외 접근 불가)
            </label>
          </div>
          <Input
            type="text"
            label="파일 이름"
            name="name"
            id="name"
            advice="파일 이름을 입력해주세요."
          />
          <Input
            type="text"
            label="파일 설명"
            name="description"
            id="description"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer text-white bg-blue-500 border-blue-500 inline-block text-center align-middle border px-3 py-1 rounded transition duration-150 ease-in-out no-underline active:bg-blue-600 active:border-blue-600 hover:bg-blue-600 hover:border-blue-600 focus:outline-0 focus:shadow-[0_0_0_0_0.2rem] focus:shadow-[rgba(38,143,255,.5)]"
          >
            제출
          </button>
        </div>
      </Form>
    </FormProvider>
  );
}
