import React from "react";
import { shallowEqual, useSelector } from "react-redux";

import {
  UserInfoConatiner,
  UruBalance,
  LockedUruBalance,
} from "../../styles/UserInfo.styled";

const UserInfo = () => {
  const { uru, lockedUru } = useSelector(
    (state) => state.userInfo,
    shallowEqual
  );

  return (
    <UserInfoConatiner>
      <UruBalance>{uru}</UruBalance>
      <LockedUruBalance>{lockedUru}</LockedUruBalance>
    </UserInfoConatiner>
  );
};

export default UserInfo;
