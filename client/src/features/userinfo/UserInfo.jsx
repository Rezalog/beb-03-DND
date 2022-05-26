import React, { useEffect } from "react";
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
