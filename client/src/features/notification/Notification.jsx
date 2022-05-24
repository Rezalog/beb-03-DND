import React from "react";

import { useDispatch, useSelector } from "react-redux";
import Loading from "../loading/Loading";

import { NotificationCard } from "../../styles/Notification.styled";
import { pendingNoti } from "./notifiactionSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const { isPending, isSuccess, isFail, msg } = useSelector(
    (state) => state.notification
  );

  if (isPending) {
    return (
      <NotificationCard>
        <Loading size={"3px"} />
        <p> 트랜잭션 처리중...</p>
      </NotificationCard>
    );
  }
  if (isSuccess) {
    return (
      <NotificationCard style={{ backgroundColor: "#45CAB8", color: "black" }}>
        <p>{msg}</p>
      </NotificationCard>
    );
  }
  if (isFail) {
    return (
      <NotificationCard style={{ backgroundColor: "#CA4550" }}>
        <p>트랜잭션 실패! 다시 시도해주세요!</p>
      </NotificationCard>
    );
  }
  return null;
};

export default Notification;
