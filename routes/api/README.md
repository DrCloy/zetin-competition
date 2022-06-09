# API 명세

## 인증

## 라인트레이서 대회

라인트레이서 대회 페이지를 관리하는 CRUD(Create, Read, Update, Delete) API입니다. '관리자 인증 필요' 문구가 있는 API에는 [인증](#인증) 항목을 통해 관리자 로그인을 하여 쿠키를 통한 JWT를 발급받은 후에야 접근할 수 있습니다.

- [Competition 모델](../../models/competition.js)
- [Competition 라우터 미들웨어](../api/competitions.js)

### `GET /api/competitions`

개설된 라인트레이서 대회를 전부 가져옵니다. 이때 Competition 모델 중 오직 `_id`, `name`, `date`, `regDateStart`, `regDateEnd`, `posterId`를 json으로 반환합니다.

### `GET /api/competitions/:id`

`id`에 해당하는 라인트레이서 대회 페이지 정보를 Competition 모델의 JSON 형태로 반환합니다.

#### 쿼리

- `projection`: Competition 모델 중 원하는 필드만 사영하여 가져올 수 있습니다. 여러 개의 `projection` 쿼리 또는 콤마(,)로 구분된 필드 이름을 사용하여 사영하고 싶은 형태를 지정할 수 있습니다. (예: `?projection=name&projection=desc` 또는 `?projection=name,desc`)

### `POST /api/competitions` (관리자 인증 필요)

Competition 모델의 JSON 형태의 요청 본문을 통해 새 라인트레이서 대회 페이지를 개설합니다.

### `PATCH /api/competitions/:id` (관리자 인증 필요)

부분적으로 수정할 Competition 모델의 JSON을 요청 본문으로 받아 해당(`id`) 라인트레이서 대회 페이지를 수정합니다. 이때, `events` 필드에 있는 대회 경연들 중 참가자가 있는 것은 삭제할 수 없으며 HTTP 에러 코드와 함께 수정이 되지 않은 채로 응답합니다.

### `DELETE /api/competition/:id` (관리자 인증 필요)

`id`에 해당하는 라인트레이서 대회 페이지를 삭제합니다.

## 파일

자체 파일 서버를 운영하여 필요한 파일들을 보관할 수 있도록 도와주는 API입니다. '관리자 인증 필요' 딱지가 붙어있는 API는 요청 `Authorization` 헤더에 관리자 JWT 정보가 필요합니다.

### `GET /api/files` (관리자 인증 필요)

#### 설명

업로드된 파일들의 모든 정보를 가져옵니다.

### `GET /api/files/:id`

#### 설명

`id`에 해당하는 파일을 가져옵니다. 이때 해당 파일의 `private` 속성이 걸려있다면, 요청 `Authorization` 헤더에 관리자 JWT 정보가 있어야만 파일을 가져올 수 있습니다.

#### 쿼리

- `thumbnail`: 이 값이 `true`이고 `id`에 해당하는 파일이 이미지일 경우 작은 이미지 파일로 변환하여 응답합니다.

### `GET /api/files/detail/:id`

#### 응답 본문

파일에 대한 상세 정보를 JSON 형태로 응답합니다. 자세한 내용은 [`File` 모델](../../models/file.js)을 참고해 주시길 바랍니다. 한편, 해당 파일의 `private` 속성이 걸려있다면, 요청 `Authorization` 헤더에 관리자 JWT 정보가 있어야만 파일을 가져올 수 있습니다.

### `POST /api/files` (관리자 인증 필요)

#### 설명

`multipart/form-data` 형식의 본문을 사용하며 다음 필드가 제공돼야 한다.

#### 요청 본문

- `name: String`: 파일의 별명, 이름
- `description: String`: 파일의 설명
- `private: Boolean`: 파일의 공개 유무
- `file: Blob`: 업로드할 파일의 이진 데이터

다음은 서버에서 자동으로 채워지는 값들입니다.

- `filename`: 자동으로 채워지는 값으로 로컬에 저장되는 파일의 이름
- `mimetype`: 자동으로 채워지는 값으로 파일의 형식
- `size`: 자동으로 채워지는 값으로 파일의 크기

### `PATCH /api/files/:id` (관리자 인증 필요)

#### 설명

`multipart/form-data` 형식의 본문을 바탕으로 `id`에 해당하는 파일 정보를 수정합니다. 해당 폼의 필드에 대한 정보는 `POST /api/files` 항목을 참고하여 주십시오.

### `DELETE /api/files/:id` (관리자 인증 필요)

#### 설명

`id`에 해당하는 파일을 삭제합니다.

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
