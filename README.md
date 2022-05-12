# ZETIN Competition

## 개요

기존 CGI 기반의 ZETIN 라인트레이서 대회 참가 신청 페이지를 MERN(Mongodb, Express, React, Node.js) Stack을 이용하여 새롭게 리뉴얼한 프로젝트입니다.

## 방향성

- 유지보수 접근성이 쉽도록 많이 사용하고 대중적인 프레임워크 및 라이브러리 활용
- 기존 ZETIN 홈페이지에 iframe으로 해당 어플리케이션을 보여줄 수 있도록 UI/UX 설계

## 환경 변수

`.env` 파일이나 시스템 환경 변수에 다음의 환경 변수를 설정해야 제대로 동작할 수 있습니다.

- `PATH_FILES`: 업로드된 파일들을 보관하는 디렉터리를 지정합니다.
- `ADMIN_AUTH_PUBLIC_PEM`: 관리자 인증을 위한 공개키 PEM 파일을 지정합니다.
- `ADMIN_ID`: 관리자 계정을 지정합니다. 띄어쓰기로 여러 명을 지정할 수 있습니다.

다음은 필수는 아니나 사용자에 맞게 설정할 수 있는 환경변수입니다.

- `PORT`: 서버 포트를 지정합니다. (기본값: `8000`)
- `MONGODB_NAME`: mongodb 데이터베이스 이름을 지정합니다. (기본값: `zetin-competition`)
- `MONGODB_HOST`: mongodb 서버 호스트를 지정합니다. (기본값: `mongodb://localhost:27017/`)

## 동작 환경

- Node.js v14.18.3
- Mongodb v5.0.6

## 개발 환경

1. 해당 프로젝트를 내려받는다.
1. 환경 변수 항목을 참고하여 환경 변수를 설정한다.
1. 프로젝트 최상단 디렉터리에서 `npm run dev` 명령어를 실행한다.
   - express 서버와 CRA(Create-React-App) 개발 서버가 동시에 실행된다.

## 개발 문서

- API 명세: 준비중

## 배포

Docker 기반의 배포 시스템 구축 준비중
