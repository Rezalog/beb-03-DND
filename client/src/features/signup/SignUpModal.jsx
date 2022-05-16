import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSignUpModal } from "../modal/signUpModalSlice";
import styled from "styled-components";
import axios from "axios";
import { addCharacterIndex, addNickname } from "../userinfo/userInfoSlice";
import game from "../../PhaserGame";

const SignUpModal = () => {
  const dispatch = useDispatch();
  const account = window.klaytn.selectedAddress;
  const nickname = useSelector((state) => state.userInfo.nickname);
  const characterIndex = useSelector((state) => state.userInfo.characterIndex);
  // const closeSignUpModal = useSelector((state) => state.signUpModal);

  const signUp = async (event) => {
    // form 제출버튼 클릭시 페이지 자동 새로고침 방지
    event.preventDefault();

    // 테스트넷 네크워크인지 확인
    let networkId = await window.klaytn.networkVersion;
    if (networkId !== 1001) {
      // Baobab(TestNet) newworkId = 1001
      // Cypress(MainNet) networkId = 8217
      alert("Please Connect Baobab TestNet");
      return;
    }

    try {
      await axios
        .post(
          `http://localhost:8080/users/signup/${account}`,
          {
            user_address: account,
            user_nickname: nickname,
            character_index: characterIndex,
          },
          {
            withCredentials: true,
          }
        )
        .then((res) => {
          console.log(res);
          dispatch(closeSignUpModal());
          game.events.emit("start", characterIndex); // 맞는지 확인 필요
        });
    } catch (err) {
      // 에러 발생시, 해당 내용 팝업 알림
      if (err.response.data === "nickname already exists") {
        alert("이미 등록된 닉네임입니다");
      }
      if (err.response.data === "wallet not found") {
        alert("지갑 연결을 확인해주세요");
      }
      if (err.response.data === "Bad Request") {
        alert("닉네임 입력과 캐릭터 선택을 모두 완료해주세요");
      }
      console.log(err);
    }
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "150vh",
        backgroundColor: "black",
        zIndex: 10,
        color: "white",
      }}
    >
      Sign Up
      <div>
        <form onSubmit={signUp}>
          <div>Input Nickname</div>
          <input
            value={nickname}
            onChange={(event) =>
              dispatch(addNickname({ nickname: event.target.value }))
            }
            required
          />
          <div>Choose your Character</div>
          <div className="characterGroup">
            <input
              type="radio"
              name="choice"
              id="choose-1"
              value="1"
              required
              onClick={() =>
                dispatch(addCharacterIndex({ characterIndex: "1" }))
              }
            />
            <label htmlFor="choose-1">
              <img
                src="assets/1.gif"
                alt="elf_f"
                width="40"
                onClick={() =>
                  dispatch(addCharacterIndex({ characterIndex: "1" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-2"
              value="2"
              required
              onClick={() =>
                dispatch(addCharacterIndex({ characterIndex: "2" }))
              }
            />
            <label htmlFor="choose-2">
              <img
                src="assets/2.gif"
                alt="elf_m"
                width="40"
                onClick={() =>
                  dispatch(addCharacterIndex({ characterIndex: "2" }))
                }
              />
            </label>

            <input
              type="radio"
              name="choice"
              id="choose-3"
              value="3"
              required
              onClick={() =>
                dispatch(addCharacterIndex({ characterIndex: "3" }))
              }
            />
            <label htmlFor="choose-3">
              <img
                src="assets/3.gif"
                alt="knight"
                width="40"
                onClick={() =>
                  dispatch(addCharacterIndex({ characterIndex: "3" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-4"
              value="4"
              required
              onClick={() =>
                dispatch(addCharacterIndex({ characterIndex: "4" }))
              }
            />
            <label htmlFor="choose-4">
              <img
                src="assets/4.gif"
                alt="dragon"
                width="40"
                onClick={() =>
                  dispatch(addCharacterIndex({ characterIndex: "4" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-5"
              value="5"
              required
              onClick={() =>
                dispatch(addCharacterIndex({ characterIndex: "5" }))
              }
            />
            <label htmlFor="choose-5">
              <img
                src="assets/5.gif"
                alt="dark_mage"
                width="40"
                onClick={() =>
                  dispatch(addCharacterIndex({ characterIndex: "5" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-6"
              value="6"
              required
              onClick={() =>
                dispatch(addCharacterIndex({ characterIndex: "6" }))
              }
            />
            <label htmlFor="choose-6">
              <img
                src="assets/6.gif"
                alt="wizard"
                width="40"
                onClick={() =>
                  dispatch(addCharacterIndex({ characterIndex: "6" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-7"
              value="7"
              required
              onClick={() =>
                dispatch(addCharacterIndex({ characterIndex: "7" }))
              }
            />
            <label htmlFor="choose-7">
              <img
                src="assets/7.gif"
                alt="archer"
                width="40"
                onClick={() =>
                  dispatch(addCharacterIndex({ characterIndex: "7" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-8"
              value="8"
              required
              onClick={() =>
                dispatch(addCharacterIndex({ characterIndex: "8" }))
              }
            />
            <label htmlFor="choose-8">
              <img
                src="assets/8.gif"
                alt="theif"
                width="40"
                onClick={() =>
                  dispatch(addCharacterIndex({ characterIndex: "8" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-9"
              value="9"
              required
              onClick={() =>
                dispatch(addCharacterIndex({ characterIndex: "9" }))
              }
            />
            <label htmlFor="choose-9">
              <img
                src="assets/9.gif"
                alt="mage"
                width="40"
                onClick={() =>
                  dispatch(addCharacterIndex({ characterIndex: "9" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-10"
              value="10"
              required
              onClick={() =>
                dispatch(addCharacterIndex({ characterIndex: "10" }))
              }
            />
            <label htmlFor="choose-10">
              <img
                src="assets/10.gif"
                alt="blacksmith"
                width="40"
                onClick={() =>
                  dispatch(addCharacterIndex({ characterIndex: "10" }))
                }
              />
            </label>
          </div>
          <button type="submit" onClick={() => signUp}>
            Sign Up
          </button>
        </form>

        <button
          onClick={() => {
            console.log(account);
            console.log(nickname);
            console.log(characterIndex);
          }}
        >
          check
        </button>
      </div>
      {/* <button onClick={() => dispatch(closeSignUpModal())}>X</button> */}
    </div>
  );
};

export default SignUpModal;
