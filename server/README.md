# Server

## 패키지 설치

```bash
npm install
```

### 환경변수 설정

####HTTP Server
PORT=서버 접속 포트번호

####MongoURI
USER_NAME=Atlas cluster 계정
USER_PASSWORD=Atlas cluster 계정 비밀번호
CLOUD_NAME=Atlas cluster 이름
DATABASE_NAME=Atlas cluster에서 생성한 Database 이름


## HTTP Server 연결

```bash
npm start
```

## Server API

|Page|Type|Path|Description|
|------|----|----------||---------------|
|Main|GET|/|메인 홈페이지|
|User(가제)|POST|/users/singup|회원가입|
||POST|/users/singin|로그인|
||GET|/users/profile|사용자 프로필정보 확인|
