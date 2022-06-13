# ZETIN Competition

## 개요

기존 CGI 기반의 ZETIN 라인트레이서 대회 참가 신청 페이지를 MERN(Mongodb, Express, React, Node.js) Stack을 이용하여 새롭게 리뉴얼한 프로젝트입니다.

## 방향성

- 유지보수 접근성이 쉽도록 많이 사용하고 대중적인 프레임워크 및 라이브러리 활용
- 기존 ZETIN 홈페이지에 iframe으로 해당 어플리케이션을 보여줄 수 있도록 UI/UX 설계 ([iframe 높이 자동 변경 라이브러리](https://github.com/davidjbradshaw/iframe-resizer))

## 환경 변수

`.env` 파일이나 시스템 환경 변수에 다음의 환경 변수를 설정해야 제대로 동작할 수 있습니다.

- `PATH_FILES`: 업로드된 파일들을 보관하는 디렉터리를 지정합니다.
- `ADMIN_AUTH_PUBLIC_PEM`: 관리자 인증을 위한 공개키 PEM 파일을 지정합니다.
- `ADMIN_ID`: 관리자 계정을 지정합니다. 띄어쓰기로 여러 명을 지정할 수 있습니다.

다음은 필수는 아니나 사용자에 맞게 설정할 수 있는 환경변수입니다.

- `PORT`: 서버 포트를 지정합니다. (기본값: `8000`)
- `MONGODB_NAME`: mongodb 데이터베이스 이름을 지정합니다. (기본값: `zetin-competition`)
- `MONGODB_HOST`: mongodb 서버 호스트를 지정합니다. (기본값: `localhost`)
- `MONGODB_PORT`: mongodb 서버 포트를 지정합니다. (기본값: `27017`)
- `ZETIN_AUTH_HOST`: ZETIN 인증 서버 호스트를 지정합니다. (기본값: [여기서 확인](./routes/api/auth.js))

## 동작 환경

- Node.js v14.18.3
- Mongodb v5.0.6

## 개발 환경

1. 해당 프로젝트를 내려받는다.
1. [환경 변수](#환경-변수) 항목을 참고하여 환경 변수를 설정한다.
1. 프로젝트 최상단 디렉터리 및 client 디렉터리에서 각각 `npm install` 명령어를 실행한다.
1. 프로젝트 최상단 디렉터리에서 `npm run dev` 명령어를 실행한다.
   - express 서버와 CRA(Create-React-App) 개발 서버가 동시에 실행된다.

## 개발 문서

- [API 명세](./routes/api/README.md)

## 배포

다음 docker-compose를 참고하여 프론트엔드/백엔드 프로젝트와 mongodb를 연동하여 서비스를 운용하면 된다.

```
version: "3.0"
services:
  zetin-competition:
    build: {dockerfile 부모 경로}
    image: zetin-competition
    volumes:
      - {ZETIN 인증 서버 공개키 경로}:/zetin-competition/zetin.pem
      - {파일을 저장할 경로}:/zetin-competition/files
    environment:
      - PATH_FILES=/zetin-competition/files
      - ADMIN_AUTH_PUBLIC_PEM=/zetin-competition/zetin.pem
      - ADMIN_ID={관리자로 사용할 ZETIN 계정}
      - MONGODB_HOST=zetin-competition-db
    links:
      - zetin-competition-db
    ports:
      - "8080:8000"

  zetin-competition-db:
    image: mongo
    volumes:
      - {db를 저장할 경로}:/data/db

```
