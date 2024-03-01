# Auth API

인증 관련 모듈 및 기능들을 모아놓은 인증 서버입니다.  
주로 Firebase OAuth 기반 인증을 처리하며, 다음과 같은 기능을 제공합니다.

- Firebase에서 제공하지 않는 Custom Provider(Kakao, NAVER 등)에 대해 Custom Token을 생성합니다.
- 각 유저의 Custom Claims를 조회/수정합니다.


## Environment

- Nest.js 10
- Firebase Admin
