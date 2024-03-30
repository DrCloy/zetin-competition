import { repo } from 'di';
import { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

export default function MarkdownTextArea({
  id,
  label,
  name,
  rows,
  ...restProps
}: {
  id: string;
  label: string;
  name: string;
  rows: number;
}) {
  const { register, getValues } = useFormContext();
  const [preview, setPreview] = useState(false);
  const [content, setContent] = useState<JSX.Element | string>('' as string);

  useEffect(() => {
    if (preview) {
      const value = getValues(name);
      if (value) {
        setContent(repo.md.render(value));
      } else {
        setContent(<span>미리 볼 내용이 없습니다.</span>);
      }
    }
  }, [preview, getValues, name]);

  return (
    <div className="mb-4">
      {label && (
        <label className="inline-block mb-2" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        className={`h-auto resize-y w-full px-3 py-1 border border-gray-300 rounded transition duration-150 ease-in-out bg-clip-padding focus:border-blue-400 focus:box-border focus:shadow-[0px_0px_0px_0.2rem] focus:shadow-[rgba(0,123,255,.25)] focus:outline-0 ${
          preview ? 'hidden' : ''
        }`}
        id={id}
        rows={rows}
        {...register(name, {})}
        {...restProps}
      />
      <div
        className={`border border-green-500 rounded px-4 py-2 ${
          preview ? '' : 'hidden'
        }`}
      >
        {content}
      </div>
      <div className="float-right mt-2">
        <small className="mr-3">Markdown 문법을 지원합니다.</small>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPreview(!preview);
          }}
          className="ml-2 px-2 py-2 text-sm leading-normal bg-gray-400 border-gray-400 text-white rounded"
        >
          {preview ? '수정' : '미리 보기'}
        </button>
      </div>
    </div>
  );
}
