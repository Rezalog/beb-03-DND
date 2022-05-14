import { useState, useEffect } from "react";
import "./App.css";
import game from "./PhaserGame";
import Caver from "caver-js";
import { useDispatch, useSelector } from "react-redux";
import DexModal from "./features/dex/DexModal";
import TokenSwapModal from "./features/tokenSwap/TokenSwapModal";
import { openDexModal } from "./features/modal/dexModalSlice";
import { openTokenSwapModal } from "./features/modal/tokenSwapModalSlice";
import SignUpModal from "./features/signup/SignUpModal";
import { openSignUpModal } from "./features/modal/signUpModalSlice";
import { openLpFarmModal } from "./features/modal/lpFarmingModalSlice";
import LPFarmModal from "./features/lpFarming/LPFarmModal";
import axios from "axios";
import Loading from "./features/loading/Loading";
import {
  setCharacterIndex,
  setNickname,
} from "./features/userinfo/userInfoSlice";

function App() {
  const { isOpen: isDexOpen } = useSelector((state) => state.dexModal);
  const { isOpen: isTokenSwapOpen } = useSelector(
    (state) => state.tokenSwapModal
  );
  const { isOpen: isSignUpOpen } = useSelector((state) => state.signUpModal);
  const { isOpen: isLpFarmOpen } = useSelector((state) => state.lpFarmModal);
  const { isLoading } = useSelector((state) => state.loading);
  const dispatch = useDispatch();
  const [isSignIn, setIsSignIn] = useState(false);

  const nickname = useSelector((state) => state.userInfo.nickname);
  const characterIndex = useSelector((state) => state.userInfo.characterIndex);

  const connectToWallet = async () => {
    if (typeof window.klaytn !== "undefined") {
      const provider = window["klaytn"];
      try {
        const accounts = await window.klaytn.enable();
        const account = window.klaytn.selectedAddress;

        const caver = new Caver(window.klaytn);
        const balance = await caver.klay.getBalance(account);
        console.log(balance);
        // dispatch(openSignUpModal());

        // 서버에 get요청을 보내 해당 어카운트가 있으면 접속(isSignIn = true)
        // get 요청을 통해 받아온 유저 닉네임과 이미지 받아와 적용하기
        // 없으면 signUp 모달창
        // signUp 이 완료되면 isSignIn = true 상태로 바꾸어 접속
        await axios
          .get(`http://localhost:8080/users/signin/${account}`, {
            // params: {
            //   user_address: account,
            // }, //params 를 보낼 때
          })
          .then((res) => {
            if (res.status === 200) {
              // 수정필요
              dispatch(setNickname({ nickname: res.nickname })); // 디스패치 활용 SetNickname 예시
              dispatch(
                setCharacterIndex({ characterIndex: res.characterIndex })
              );
              setIsSignIn(true);
              // emit 이벤트
              // 두번째 인자값에 캐릭터 이미지 파일 이름이 들어가면된다.
              game.events.emit("start", "dragon");
            }
          });
      } catch (err) {
        // 저장된 지갑주소가 없어서 HTTP 상태코드 400을 받으면 사인업 모달창을 연다.
        if (err.response.status === 400) {
          console.log("You have to sign up! ");
          setIsSignIn(true);
          dispatch(openSignUpModal());
        } else {
          console.log(err);
        }
      }
    }
  };

  useEffect(() => {
    game.events.on("enter", (event) => {
      console.log(event);
      switch (event) {
        case "1": {
          dispatch(openDexModal());
          break;
        }
        case "2": {
          dispatch(openTokenSwapModal());
          break;
        }
        case "3": {
          dispatch(openLpFarmModal());
          break;
        }
        default: {
          break;
        }
      }
    });
  }, []);

  return (
    <div className="App">
      {isSignIn ? null : (
        <div>
          <h1>Dungeon & Defi</h1>
          <button onClick={connectToWallet}>지갑 연결</button>
        </div>
      )}

      {isDexOpen && <DexModal />}
      {isTokenSwapOpen && <TokenSwapModal />}
      {isLpFarmOpen && <LPFarmModal />}
      {isSignUpOpen && <SignUpModal />}
      {/* <SignUpModal /> */}
      {isLoading && <Loading />}
    </div>
  );
}

export default App;
