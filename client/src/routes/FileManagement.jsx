import { useState, useEffect } from 'react';
import axios from 'axios';

import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

import FileTable from '../components/FileTable';
import FileUploadForm from '../forms/FileUploadForm';

export default function FileManagement() {
  const [files, setFiles] = useState(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadTarget, setUploadTarget] = useState(null);

  useEffect(() => {
    async function getFiles() {
      const res = await axios.get('/api/files');
      setFiles(res.data);
    }

    if (!files) {
      getFiles();
    }
  }, [files]);

  const showCopyIdDiaglog = (f) => {
    window.prompt(
      '선택한 파일의 ID입니다. Ctrl+C를 통해 ID를 복사하세요.',
      f._id,
    );
  };

  const showPatchDialog = (f) => {
    setUploadTarget(f);
    setShowUploadForm(true);
  };

  const showDeleteDialog = async (f) => {
    try {
      if (window.confirm(`정말로 '${f.name}' 파일을 삭제하시겠습니까?`)) {
        await axios.delete(`/api/files/${f._id}`);
        setFiles(null); // reload file list
      }
    } catch (err) {
      window.alert(err.response.data);
    }
  };

  return (
    <div>
      <h3>📁 포스터 및 파일 관리</h3>
      <p>
        포스터 이미지를 등록하거나 대회 페이지에 필요한 파일들을 보관할 수 있는
        곳입니다.
      </p>
      <Button
        className="mb-3"
        onClick={() => {
          setUploadTarget(null);
          setShowUploadForm(true);
        }}
      >
        파일 업로드
      </Button>
      <FileTable
        data={files}
        renderFunction={(f) => (
          <DropdownButton
            id="functions"
            title="..."
            variant="secondary"
            size="sm"
          >
            <Dropdown.Item as="button" onClick={() => showCopyIdDiaglog(f)}>
              파일 ID 복사
            </Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => showPatchDialog(f)}>
              수정
            </Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => showDeleteDialog(f)}>
              삭제
            </Dropdown.Item>
          </DropdownButton>
        )}
      />
      <Modal
        show={showUploadForm}
        onHide={() => setShowUploadForm(false)}
        backdrop="static"
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {uploadTarget ? '파일 수정' : '파일 업로드'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FileUploadForm
            data={uploadTarget}
            onSubmitted={() => {
              setFiles(null); // reload
              setShowUploadForm(false); // close
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
}
