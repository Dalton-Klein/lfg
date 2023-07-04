import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  checkGeneralProfileCompletion,
  checkRocketLeagueProfileCompletion,
  checkRustProfileCompletion,
  checkBattleBitProfileCompletion,
} from "../../utils/rest";
import ProfileWidget from "./profileWidget";
import "./profileWidgetsContainer.scss";
import { Tooltip } from "react-tooltip";

const ProfileWidgetsContainer = () => {
  const userData = useSelector((state: RootState) => state.user.user);

  const [genProfileComplete, setgenProfileComplete] = useState<boolean>(false);
  const [rustProfileComplete, setrustProfileComplete] = useState<boolean>(false);
  const [rocketLeagueProfileComplete, setrocketLeagueProfileComplete] = useState<boolean>(false);
  const [battleBitProfileComplete, setbattleBitProfileComplete] = useState<boolean>(false);
  useEffect(() => {
    //Having this logic in the user state use effect means it will await the dispatch to get the latest info. It is otherwise hard to await the dispatch
    if (userData.email && userData.email !== "") {
      setCompletenessWidget();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const setCompletenessWidget = async () => {
    //Check general completion
    // ***NEW GAME EDIT
    let [generalResult, rustResult, rocketLeagueResult, battleBitResult] = await Promise.all([
      checkGeneralProfileCompletion(userData.id, ""),
      checkRustProfileCompletion(userData.id, ""),
      checkRocketLeagueProfileCompletion(userData.id, ""),
      checkBattleBitProfileCompletion(userData.id, ""),
    ]);
    if (generalResult.status === "error") {
      setgenProfileComplete(false);
    } else {
      setgenProfileComplete(true);
    }
    if (rustResult.status === "error") {
      setrustProfileComplete(false);
    } else {
      setrustProfileComplete(true);
    }
    if (rocketLeagueResult.status === "error") {
      setrocketLeagueProfileComplete(false);
    } else {
      setrocketLeagueProfileComplete(true);
    }
    if (battleBitResult.status === "error") {
      setbattleBitProfileComplete(false);
    } else {
      setbattleBitProfileComplete(true);
    }
  };

  return (
    <div className="widgets-container">
      <ProfileWidget
        value={genProfileComplete}
        label={"gen profile complete?"}
        tooltipName="genProfileTip"
      ></ProfileWidget>
      <ProfileWidget
        value={rustProfileComplete}
        label={"rust profile complete?"}
        tooltipName="gameProfileTip"
      ></ProfileWidget>
      <ProfileWidget
        value={rocketLeagueProfileComplete}
        label={"rocket league profile complete?"}
        tooltipName="gameProfileTip"
      ></ProfileWidget>
      <ProfileWidget
        value={battleBitProfileComplete}
        label={"battlebit profile complete?"}
        tooltipName="gameProfileTip"
      ></ProfileWidget>
      <Tooltip id="genProfileTip" place="bottom">
        general profile must be complete before any game profile can be published
      </Tooltip>
      <Tooltip id="gameProfileTip" place="bottom">
        when completed, publish this game profile to be discoverable by others
      </Tooltip>
    </div>
  );
};
export default ProfileWidgetsContainer;
