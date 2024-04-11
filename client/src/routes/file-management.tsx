import DropdownButton from 'components/dropdown-button';
import FileUploadForm from 'components/forms/file-upload-form';
import { FileData } from 'core/model';
import { repo } from 'di';
import { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { Link } from 'react-router-dom';
import { formatBytes } from 'utils';

export default function FileManagement() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadTarget, setUploadTarget] = useState<FileData | null>(null);

  useEffect(() => {
    async function getFiles() {
      const files = await repo.fileManager.getFiles();
      setFiles(files);
    }

    if (files.length === 0) {
      getFiles();
    }
  }, [files]);

  const showCopyIdDialog = (file: FileData) => {
    window.prompt(
      '선택한 파일의 ID입니다. Ctrl+C를 통해 ID를 복사하세요.',
      file.id,
    );
  };

  const showPatchDialog = (file: FileData) => {
    setUploadTarget(file);
    setShowUploadForm(true);
  };

  const showDeleteDialog = async (file: FileData) => {
    try {
      if (window.confirm(`정말로 ${file.name} 파일을 삭제하시겠습니까?`)) {
        await repo.fileManager.deleteFile(file.id);
        setFiles([]);
      }
    } catch (error: any) {
      window.alert(error.response?.data);
    }
  };

  return (
    <>
      <h3 className="text-3xl mb-2">📁 포스터 및 파일 관리</h3>
      <p className="mb-4">
        포스터 이미지를 등록하거나 대회 페이지에 필요한 파일들을 보관할 수 있는
        곳입니다.
      </p>
      <button
        className="cursor-pointer mb-4 px-3 py-1.5 text-white bg-blue-500 border-blue-500 inline-block text-center align-middle border rounded transition duration-150 ease-in-out
      active:bg-blue-600 active:border-blue-600 hover:bg-blue-600 hover:border-blue-600 hover:no-underline focus:outline-0 focus:shadow-[0_0_0_0_0.2rem] focus:shadow-[rgba(38,143,255,.5)]"
        onClick={() => {
          setUploadTarget(null);
          setShowUploadForm(true);
        }}
      >
        파일 업로드
      </button>
      <table className="w-full mb-4 text-black border-collapse box-border table-auto indent-[initial] border-spacing-0.5 border-gray-500 text-left">
        <colgroup>
          <col style={{ width: '30%' }} />
          <col style={{ width: '35%' }} />
          <col style={{ width: '5%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '5%' }} />
        </colgroup>
        <thead className="table-header-group align-middle border-b-2 border-t border-b-gray-300">
          <tr>
            <th className="align-bottom p-1.5 font-bold table-cell">이름</th>
            <th className="align-bottom p-1.5 font-bold table-cell">설명</th>
            <th className="align-bottom p-1.5 font-bold table-cell">🔒</th>
            <th className="align-bottom p-1.5 font-bold table-cell">형식</th>
            <th className="align-bottom p-1.5 font-bold table-cell">크기</th>
            <th className="align-bottom p-1.5 font-bold table-cell">기능</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-300 table-row-group align-middle border-spacing-0.5">
          {files &&
            files.map((file) => (
              <tr
                key={file.id}
                className="odd:bg-gray-200 odd:bg-opacity-50 even:bg-white "
              >
                <td className="p-2">
                  <Link
                    to={`/api/files/${file.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-500 no-underline hover:underline hover:text-blue-800"
                  >
                    {file.name}
                  </Link>
                </td>
                <td className="p-2 break-all">{file.description}</td>
                <td className="p-2 break-all">{file.private ? '✓' : ''}</td>
                <td className="p-2 break-all">{file.mimetype}</td>
                <td className="p-2 break-all">{formatBytes(file.size)}</td>
                <td className="p-2 break-all">
                  <DropdownButton
                    outerItem={
                      <>
                        ...
                        <svg
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                          className="-mr-1 h-4 w-4"
                        >
                          <path
                            clipRule="evenodd"
                            fillRule="evenodd"
                            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                          />
                        </svg>
                      </>
                    }
                    outerOptions={{
                      className:
                        'no-underline inline-flex text-center align-middle justify-center gap-x-1 w-full rounded border border-gray-500 px-2 py-1 bg-gray-500 text-sm font-normal text-white transision ease-in-out duration-150 active:bg-gray-600 active:border-gray-600 active:cursor-pointer focus:outline-0 focus:bg-gray-600 focus:border-gray-600 focus:shadow-[0_0_0_0_0.2rem] focus:shadow-[rgba(130,138,145,.5)]',
                    }}
                    innerItems={[
                      {
                        label: '파일 ID 복사',
                        onClick: () => showCopyIdDialog(file),
                      },
                      { label: '수정', onClick: () => showPatchDialog(file) },
                      { label: '삭제', onClick: () => showDeleteDialog(file) },
                    ]}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <ReactModal
        isOpen={showUploadForm}
        onRequestClose={() => setShowUploadForm(false)}
        overlayClassName="fixed top-0 left-0 bg-black bg-opacity-50 z-[1040] w-full h-full transition-opacity ease-linear overflow-y-auto"
        className="block box-border relative max-w-full md:max-w-3xl w-full mx-auto my-7 transition-transform ease-out duration-300 text-gray-800
        overflow-y-auto"
        bodyOpenClassName="overflow-hidden"
        shouldCloseOnOverlayClick={false}
        ariaHideApp={false}
        closeTimeoutMS={200}
      >
        <div
          className="relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding border border-black border-opacity-20 rounded outline-0
        divide-y divide-gray-300"
        >
          <div>
            <h3 className="text-2xl p-4">
              {uploadTarget ? '파일 수정' : '파일 업로드'}
            </h3>
            <button
              className="absolute top-4 right-4 text-2xl"
              onClick={() => setShowUploadForm(false)}
            >
              X
            </button>
          </div>
          <FileUploadForm
            data={uploadTarget}
            onSubmitted={(response) => {
              setFiles([]);
              setShowUploadForm(false);
            }}
          />
        </div>
      </ReactModal>
    </>
  );
}
