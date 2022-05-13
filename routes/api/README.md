# API 명세

## 인증

## 라인트레이서 대회

## 파일

## 참가자

### `GET /api/participants`

#### 설명

데이터베이스에 등록된 모든 참가자의 간략한 정보를 가져옵니다. 이때 간략한 정보란, `competitionId`, `eventId`, `name`, `team`, `robotName`, `createAt` 필드를 말합니다.

#### 쿼리

- `competitionId`: 대회 ID 값에 해당하는 참가자만을 가져옵니다.
- `dateSort`: 해당 쿼리 값이 `1`일 경우 오름차순, `-1`일 경우 내림차순으로 대회 참가일을 정렬하여 가져옵니다.

### `GET /api/participants/:id`

#### 설명

참가자 id를 통해 해당 참가자의 상세 정보를 가져옵니다. 여기서 민감한 정보는 가려지며, 민감한 정보를 조회하려면 요청 `Authorization` 헤더에 참가자가 등록한 비밀번호를 평문으로 제공해야 합니다. 이때 민감한 정보란, `email` 필드를 말합니다.

### `POST /api/participants`

#### 설명

요청 본문에 JSON 형식의 참가자 정보를 담아 참가자를 대회에 참가시킵니다. 참가자 정보는 [`Participant` 모델](../../models/participant.js)을 참고하면 됩니다. 이때 JSON에 password 필드가 존재하여야 합니다. 이는 참가자의 인증 수단으로 사용되며 `Participant` 모델의 필드로 등록되지 않고, 따로 `Password` 모델에 정보가 저장됩니다.

#### 요청 본문

JSON 형식의 [`Participant` 모델](../../models/participant.js) 기반 문서

#### 응답 본문

- 성공 시 `200` HTTP Status Code를 동반한 참가자의 정보를 JSON 형태로 응답합니다.
- 실패 시 HTTP Error Status Code를 동반한 오류 내용이 Plain Text로 응답합니다.

### `PATCH /api/participants/:id`

#### 설명

`id`에 해당하는 참가자를 요청 본문의 JSON 형식의 참가자 정보로 갱신합니다. 이때 참가자의 비밀번호 인증을 위해 요청 `Authorization` 헤더에 참가자가 등록한 비밀번호를 평문으로 제공해야 합니다.

#### 요청 본문

JSON 형식의 [`Participant` 모델](../../models/participant.js) 기반 문서

#### 응답 본문

- 성공 시 `200` HTTP Status Code를 동반한 참가자의 정보를 JSON 형태로 응답합니다.
- 실패 시 HTTP Error Status Code를 동반한 오류 내용이 Plain Text로 응답합니다.

### `DELETE /api/participants/:id`

#### 설명

`id`에 해당하는 참가자를 참가 취소시킵니다. 이때 참가자의 비밀번호 인증을 위해 요청 `Authorization` 헤더에 참가자가 등록한 비밀번호를 평문으로 제공해야 합니다.

#### 응답 본문

- 성공 시 `200` HTTP Status Code를 동반한 참가자의 정보를 JSON 형태로 응답합니다.
- 실패 시 HTTP Error Status Code를 동반한 오류 내용이 Plain Text로 응답합니다.

### `OPTIONS /api/participants/:id`

#### 설명

`id`에 해당하는 참가자에 어떤 HTTP Method를 적용할 수 있는지 응답합니다. 이때 `Authorization` 요청 헤더에 참가자가 등록한 인증 비밀번호를 제공하면 더 많은 HTTP Method를 사용할 수 있음을 알려줍니다.

## 대회 규칙
