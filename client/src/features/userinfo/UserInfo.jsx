import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";

import {
  UserInfoConatiner,
  UruBalance,
  LockedUruBalance,
  ProfileImage,
} from "../../styles/UserInfo.styled";

const UserInfo = () => {
  const { uru, lockedUru, characterIndex } = useSelector(
    (state) => state.userInfo,
    shallowEqual
  );

  useEffect(() => {
    console.log(uru, lockedUru);
  }, [uru, lockedUru]);
  return (
    <UserInfoConatiner>
      <UruBalance>{uru}</UruBalance>
      <LockedUruBalance>{lockedUru}</LockedUruBalance>
    </UserInfoConatiner>
  );
};

export default UserInfo;
