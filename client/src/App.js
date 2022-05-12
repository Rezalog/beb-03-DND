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
import axios from "axios";

function App() {
  const { isOpen: isDexOpen } = useSelector((state) => state.dexModal);
  const { isOpen: isTokenSwapOpen } = useSelector(
    (state) => state.tokenSwapModal
  );
  const { isOpen: isSignUpOpen } = useSelector((state) => state.signUpModal);
  const dispatch = useDispatch();
  const [isSignIn, setIsSignIn] = useState(false);
  const [nickname, setNickname] = useState("");
  const [characterIndex, setCharacterIndex] = useState("");

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
        axios
          .get("/user", {
            params: {
              user_address: account,
            },
          })
          .then((response) => {
            if (response.status === 200) {
              // 수정필요
              setNickname(response.nickname);
              setCharacterIndex(response.characterIndex);
              setIsSignIn(true);
            } else {
              {
                setIsSignIn(false);
                dispatch(openSignUpModal());
              }
            }
          });

        // emit 이벤트
        // 두번째 인자값에 캐릭터 이미지 파일 이름이 들어가면된다.
        game.events.emit("start", "dragon");
      } catch (err) {
        console.log(err);
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
      {isSignUpOpen && (
        <SignUpModal
          nickname={nickname}
          setNickname={setNickname}
          characterIndex={characterIndex}
          setCharacterIndex={setCharacterIndex}
        />
      )}
    </div>
  );
}

export default App;
