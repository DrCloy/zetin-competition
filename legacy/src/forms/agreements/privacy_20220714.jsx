import Table from 'react-bootstrap/Table';

const privacy = {
  detail: (
    <div>
      <h3>개인정보 수집·이용 동의 안내</h3>
      <p>
        서울시립대학교 중앙동아리 ZETIN(이하 제틴)은 라인트레이서 대회 운영을
        위해 아래와 같이 개인정보를 수집·이용하고자 합니다.
      </p>
      <h5>개인정보 수집·이용 내역</h5>
      <Table size="sm">
        <colgroup>
          <col style={{ width: '25%' }} />
          <col style={{ width: '45%' }} />
          <col style={{ width: '30%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>항목</th>
            <th>수집·이용 목적</th>
            <th>보유·이용기간</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>이름, 소속</td>
            <td>
              대회 페이지 관리(유지보수,{' '}
              <u>
                <b>해당 개인 정보 온라인 게시</b>
              </u>
              ) 및 대회 집행
            </td>
            <td>참가 신청 취소 또는 개인정보 제공자의 삭제 요청시까지</td>
          </tr>
          <tr>
            <td>이메일</td>
            <td>대회 변경 사항 안내</td>
            <td>참가 신청 취소 또는 개인정보 제공자의 삭제 요청시까지</td>
          </tr>
        </tbody>
      </Table>
      <p>
        <small>
          ※ 로봇 이름 및 CPU, ROM과 같은 로봇의 정보는 개인을 특정할 수 있는
          정보가 아니기에 개인정보 제공자의 동의 없이 수집됩니다.
        </small>
        <br />
        <small>
          ※ 개인정보 삭제 요청 및 관련 문의를 위한 연락처는 서울시립대학교 ZETIN
          홈페이지 하단에 있습니다.
        </small>
        <br />
        <small>
          ※ 위의 개인정보 수집·이용 동의를 거부할 경우, 라인트레이서 대회에
          참가할 수 없습니다.
        </small>
      </p>
    </div>
  ),
  content: '만14세 이상이며, 위와 같이 개인정보를 수집·이용하는데 동의합니다.',
};

export default privacy;
