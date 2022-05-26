import { useState, useEffect, useCallback } from "react";
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
import Notification from "./features/notification/Notification";
import { startLoading } from "./features/loading/loadingSlice";
import {
  addAddress,
  addCharacterIndex,
  addNickname,
} from "./features/userinfo/userInfoSlice";
import { openMonsterFarmModal } from "./features/modal/monsterFarmModalSlice";
import Inventory from "./features/inventory/Inventory";
import { openMarketplaceModal } from "./features/modal/marketplaceModalSlice";
import Marketplace from "./features/marketplace/Marketplace";
import WeaponCompoundModal from "./features/weaponCompound/WeaponCompoundModal";
import { openWeaponCompoundModal } from "./features/modal/weaponCompoundModalSlice";
import MonsterFarm from "./features/monsterFarm/MonsterFarm";
import V2SwapModal from "./features/V2Swap/V2SwapModal";
import { openV2SwapModal } from "./features/modal/v2SwapModalSlice";
import { openV2DexModal } from "./features/modal/v2DexModalSlice";
import V2DexModal from "./features/v2dex/V2DexModal";
import UserInfo from "./features/userinfo/UserInfo";
import { updateBalance } from "./features/userinfo/userInfoSlice";
import { uruABI, uruAddress } from "./features/userinfo/TokenContract";

function App() {
  const { isOpen: isDexOpen } = useSelector((state) => state.dexModal);
  const { isOpen: isTokenSwapOpen } = useSelector(
    (state) => state.tokenSwapModal
  );
  const { isOpen: isSignUpOpen } = useSelector((state) => state.signUpModal);
  const { isOpen: isLpFarmOpen } = useSelector((state) => state.lpFarmModal);
  const { isOpen: isMarketplaceOpen } = useSelector(
    (state) => state.marketplaceModal
  );
  const { isOpen: isMonsterFarmOpen } = useSelector(
    (state) => state.monsterFarmModal
  );
  const { isOpen: isV2Open } = useSelector((state) => state.v2SwapModal);
  const { isOpen: isV2DexOpen } = useSelector((state) => state.v2DexModal);
  // const { isOpen: isInventoryOpen } = useSelector(
  //   (state) => state.inventoryModal
  // );
  const { isOpen: isWeaponCompoundOpen } = useSelector(
    (state) => state.weaponCompoundModal
  );
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const dispatch = useDispatch();
  const [isSignIn, setIsSignIn] = useState(false);

  const nickname = useSelector((state) => state.userInfo.nickname);
  const characterIndex = useSelector((state) => state.userInfo.characterIndex);
  const { address: account } = useSelector((state) => state.userInfo);
  // const [isRegisterd, setIsRegistered] = useState(false);

  const connectToWallet = async () => {
    if (typeof window.klaytn !== "undefined") {
      const provider = window["klaytn"];
      try {
        const accounts = await window.klaytn.enable();
        const account = window.klaytn.selectedAddress;

        const caver = new Caver(window.klaytn);
        const balance = await caver.klay.getBalance(account);
        console.log(balance);
        dispatch(
          addAddress({
            address: account,
          })
        );

        // 서버에 get요청을 보내 해당 어카운트가 있으면 접속(isSignIn = true)
        // get 요청을 통해 받아온 유저 닉네임과 이미지 받아와 적용하기
        // 없으면 signUp 모달창
        // signUp 이 완료되면 isSignIn = true 상태로 바꾸어 접속
        await axios
          .get(`http://localhost:8080/users/signin/${account}`, {
            withCredentials: true,
          })
          .then((res) => {
            if (res.status === 200) {
              axios
                .get("http://localhost:8080/users/profile", {
                  withCredentials: true, // 없으면 요청(req)헤더에 쿠키 없음
                })
                .then((res) => {
                  setIsSignIn(true);
                  dispatch(
                    addNickname({ nickname: res.data.profile.user_nickname })
                  );
                  dispatch(
                    addCharacterIndex({
                      characterIndex: res.data.profile.character_index,
                    })
                  );
                  console.log(
                    "Your nickname is",
                    res.data.profile.user_nickname
                  );
                  console.log(
                    "Your character index is",
                    res.data.profile.character_index
                  );

                  // emit 이벤트
                  // 두번째 인자값에 캐릭터 이미지 파일 이름이 들어가면된다.
                  game.events.emit("start", res.data.profile.character_index);
                });
            }
          });
      } catch (err) {
        console.log(err);
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
      dispatch(startLoading());
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
        case "4": {
          dispatch(openMarketplaceModal());
          break;
        }
        case "5": {
          dispatch(openMonsterFarmModal());
          break;
        }
        case "6": {
          dispatch(openWeaponCompoundModal());
          break;
        }
        case "7": {
          dispatch(openV2SwapModal());
          break;
        }
        case "8": {
          dispatch(openV2DexModal());
          break;
        }

        default: {
          break;
        }
      }
    });
  }, []);

  const handleUserKeyPress = (event) => {
    if (event.key.toLowerCase() === "i") {
      dispatch(startLoading());
      setIsInventoryOpen((prev) => !prev);
    }
  };

  const getUruBalance = async () => {
    const caver = new Caver(window.klaytn);
    const token = new caver.klay.Contract(uruABI, uruAddress);
    console.log(account);
    const balance = await token.methods.balanceOf(account).call();
    const locked = await token.methods.getLockedTokenAmount(account).call();
    dispatch(
      updateBalance({
        uru: parseFloat(Number(caver.utils.fromPeb(balance)).toFixed(2)),
        locked: parseFloat(Number(caver.utils.fromPeb(locked)).toFixed(2)),
      })
    );
  };

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);

    return () => window.removeEventListener("keydown", handleUserKeyPress);
  }, []);

  useEffect(() => {
    if (account) getUruBalance();
  }, [nickname]);

  return (
    <div className='App'>
      {isSignIn ? (
        <UserInfo />
      ) : (
        <div>
          <h1>Dungeon & Defi</h1>
          <button onClick={connectToWallet}>지갑 연결</button>
        </div>
      )}

      {isDexOpen && <DexModal />}
      {isTokenSwapOpen && <TokenSwapModal />}
      {isLpFarmOpen && <LPFarmModal />}
      {isSignUpOpen && <SignUpModal />}
      {isMarketplaceOpen && <Marketplace />}
      {isMonsterFarmOpen && <MonsterFarm />}
      {isInventoryOpen && <Inventory />}
      {isWeaponCompoundOpen && <WeaponCompoundModal />}
      {isV2Open && <V2SwapModal />}
      {isV2DexOpen && <V2DexModal />}
      <Notification />
    </div>
  );
}

export default App;
