# 스마트 컨트랙트

## 환경변수 설정

PRIVATE_KEY=배포할 kaikas 계정의 개인 키
TOKEN_CONTRACT=배포한 kip-7 주소

## 사용법
패키지 설치
```bash
npm install
```
컨트랙트 배포
```bash
truffle deploy --network baobab
```
배포한 컨트랙트에 트러플로 접근 가능
```bash
truffle console --network baobab
```
### 주의사항

다른 컨트랙트를 배포하기 전에 Token.sol과 NFT.sol을 먼저 배포하고<br>
환경변수 설정 후에 다른 컨트랙트를 배포해야 합니다.
