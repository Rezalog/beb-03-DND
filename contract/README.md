# 스마트 컨트랙트

## 환경변수 설정

PRIVATE_KEY=배포할 kaikas 계정의 개인 키
TOKEN_CONTRACT=배포한 kip-7 주소

## 사용법

```bash
npm install
```

패키지 설치

```bash
truffle deploy --network baobab
```

으로 컨트랙트 배포

```bash
truffle console --network baobab
```

으로 배포한 컨트랙트에 접근 가능

### 주의사항

Exchange.sol에서 토큰 컨트랙트 주소를 인자로 받고 있으므로<br>
Token.sol을 먼저 배포하여 환경변수 설정을 한 후 Exchange.sol을 배포합니다.
