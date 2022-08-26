import { useState } from 'react';
import axios from 'axios';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

export default function Counter() {
  const [command, setCommand] = useState('');

  const sendCommand = async (cmd) => {
    try {
      await axios.post('/api/counter', { command: cmd });
    } catch (err) {
      window.alert(err);
    }
  };

  return (
    <div>
      <h3>⏱ 계수기 관리</h3>
      <p>
        계수기 관리 API를 지원하는 계수기가 있는 경우, 계수기에 원하는 명령을 이
        페이지에서 전달할 수 있습니다.
      </p>
      <div>계수기 기능</div>
      {[
        'RESET_TOTAL',
        'RESET_LAP',
        'PAUSE_TOTAL',
        'PAUSE_LAP',
        'RESUME_TOTAL',
        'RESUME_LAP',
      ].map((cmd) => (
        <Button
          key={cmd}
          className="mr-1 mt-2"
          variant="secondary"
          onClick={() => sendCommand(cmd)}
        >
          {cmd}
        </Button>
      ))}
      <hr />
      <Form
        noValidate
        onSubmit={async (e) => {
          e.preventDefault();
          await sendCommand(command);
          setCommand('');
        }}
      >
        <Form.Group controlId="command">
          <Form.Label>명령어 입력</Form.Label>
          <Form.Control
            type="text"
            onChange={(e) => setCommand(e.target.value)}
            value={command}
          />
        </Form.Group>
        <div className="text-right">
          <Button
            variant="primary"
            onClick={async () => {
              await sendCommand(command);
              setCommand('');
            }}
          >
            보내기
          </Button>
        </div>
      </Form>
      <hr />
      <div className="mb-2">부가 기능</div>
      <Button
        variant="primary"
        onClick={async () => {
          try {
            const lookup = await axios.get('/api/counter/lookup');
            let result = '';
            lookup.data.forEach((value, index) => {
              result += `${index}: ${value.command}\r\n`;
            });
            window.alert(result);
          } catch (err) {
            window.alert(err);
          }
        }}
      >
        Queue 조회
      </Button>{' '}
      <Button
        variant="danger"
        onClick={async () => {
          try {
            await axios.delete('/api/counter/clear');
            window.alert('모든 계수기 명령어 입력을 초기화했습니다.');
          } catch (err) {
            window.alert(err);
          }
        }}
      >
        Queue 초기화
      </Button>
      <hr />
    </div>
  );
}
