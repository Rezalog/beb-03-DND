import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeSignUpModal } from "../modal/signUpModalSlice";
import styled from "styled-components";
import axios from "axios";
import { setCharacterIndex, setNickname } from "../userinfo/userInfoSlice";

const SignUpModal = ({}) => {
  const dispatch = useDispatch();
  const account = window.klaytn.selectedAddress;
  const nickname = useSelector((state) => state.userInfo.nickname);
  const characterIndex = useSelector((state) => state.userInfo.characterIndex);

  const signUp = async () => {
    let networkId = await window.klaytn.networkVersion;
    if (networkId !== 1001) {
      // Baobab(TestNet) newworkId = 1001
      // Cypress(MainNet) networkId = 8217
      alert("Please Connect Baobab TestNet");
      return;
    }
    // 닉네임 중복확인 구현 필요
    try {
      await axios
        .post("/user", {
          // 수정필요
          user_address: account,
          nickname: nickname,
          character_index: characterIndex,
        })
        .then((response) => {
          console.log(response);
          dispatch(closeSignUpModal());
        });
    } catch (error) {
      console.error(error);
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
        <form>
          <div>Input Nickname</div>
          <input
            value={nickname}
            onChange={(event) =>
              dispatch(setNickname({ nickname: event.target.value }))
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
            />
            <label for="choose-1">
              <img
                src="assets/1.gif"
                alt="elf_f"
                width="40"
                onClick={() =>
                  dispatch(setCharacterIndex({ characterIndex: "1" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-2"
              value="2"
              required
            />
            <label for="choose-2">
              <img
                src="assets/2.gif"
                alt="elf_m"
                width="40"
                onClick={() =>
                  dispatch(setCharacterIndex({ characterIndex: "2" }))
                }
              />
            </label>

            <input
              type="radio"
              name="choice"
              id="choose-3"
              value="3"
              required
            />
            <label for="choose-3">
              <img
                src="assets/3.gif"
                alt="knight"
                width="40"
                onClick={() =>
                  dispatch(setCharacterIndex({ characterIndex: "3" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-4"
              value="4"
              required
            />
            <label for="choose-4">
              <img
                src="assets/4.gif"
                alt="dragon"
                width="40"
                onClick={() =>
                  dispatch(setCharacterIndex({ characterIndex: "4" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-5"
              value="5"
              required
            />
            <label for="choose-5">
              <img
                src="assets/5.gif"
                alt="dark_mage"
                width="40"
                onClick={() =>
                  dispatch(setCharacterIndex({ characterIndex: "5" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-6"
              value="6"
              required
            />
            <label for="choose-6">
              <img
                src="assets/6.gif"
                alt="wizard"
                width="40"
                onClick={() =>
                  dispatch(setCharacterIndex({ characterIndex: "6" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-2"
              value="7"
              required
            />
            <label for="choose-7">
              <img
                src="assets/7.gif"
                alt="archer"
                width="40"
                onClick={() =>
                  dispatch(setCharacterIndex({ characterIndex: "7" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-8"
              value="8"
              required
            />
            <label for="choose-8">
              <img
                src="assets/8.gif"
                alt="theif"
                width="50"
                onClick={() =>
                  dispatch(setCharacterIndex({ characterIndex: "8" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-9"
              value="9"
              required
            />
            <label for="choose-9">
              <img
                src="assets/9.gif"
                alt="mage"
                width="40"
                onClick={() =>
                  dispatch(setCharacterIndex({ characterIndex: "9" }))
                }
              />
            </label>
            <input
              type="radio"
              name="choice"
              id="choose-10"
              value="10"
              required
            />
            <label for="choose-10">
              <img
                src="assets/10.gif"
                alt="blacksmith"
                width="40"
                onClick={() =>
                  dispatch(setCharacterIndex({ characterIndex: "10" }))
                }
              />
            </label>
          </div>
          <button onClick={() => signUp}>Sign Up</button>
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
