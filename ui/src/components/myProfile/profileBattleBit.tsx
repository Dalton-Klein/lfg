import "./profileGeneral.scss";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip } from "react-tooltip";
import { RootState } from "../../store/store";
import { updateGameSpecificInfoField, attemptPublishBattleBitProfile } from "../../utils/rest";
import { Toast } from "primereact/toast";
import { updateUserThunk } from "../../store/userSlice";
import SelectComponent from "./selectComponent";

type Props = {
  locationPath: string;
  changeBanner: any;
};

export default function ProfileBattleBit(props: Props) {
  const classOptions = [
    {
      label: (
        <img
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1688413506/battle-bit-classes-squad-leader_oeskw6.png"
          alt="battlebit squad leader class"
          style={{ maxHeight: "5vh", maxWidth: "5vh", minHeight: "5vh", minWidth: "5vh" }}
        ></img>
      ),
      type: "rank",
      value: 1,
      id: "1",
    },
    {
      label: (
        <img
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1688413554/battle-bit-classes-assault_k8mydg.png"
          alt="battlebit assault class"
          style={{ maxHeight: "5vh", maxWidth: "5vh", minHeight: "5vh", minWidth: "5vh" }}
        ></img>
      ),
      type: "rank",
      value: 2,
      id: "2",
    },
    {
      label: (
        <img
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1688413506/battle-bit-classes-medic_muxa1d.png"
          alt="battlebit medic class"
          style={{ maxHeight: "5vh", maxWidth: "5vh", minHeight: "5vh", minWidth: "5vh" }}
        ></img>
      ),
      type: "rank",
      value: 3,
      id: "3",
    },
    {
      label: (
        <img
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1688413506/battle-bit-classes-engineer_qcxbvi.png"
          alt="battlebit engineer class"
          style={{ maxHeight: "5vh", maxWidth: "5vh", minHeight: "5vh", minWidth: "5vh" }}
        ></img>
      ),
      type: "rank",
      value: 4,
      id: "4",
    },
    {
      label: (
        <img
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1688413506/battle-bit-classes-support_nqoqth.png"
          alt="battlebit support class"
          style={{ maxHeight: "5vh", maxWidth: "5vh", minHeight: "5vh", minWidth: "5vh" }}
        ></img>
      ),
      type: "rank",
      value: 5,
      id: "5",
    },
    {
      label: (
        <img
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1688413506/battle-bit-classes-recon_hjvxjs.png"
          alt="battlebit recon class"
          style={{ maxHeight: "5vh", maxWidth: "5vh", minHeight: "5vh", minWidth: "5vh" }}
        ></img>
      ),
      type: "rank",
      value: 6,
      id: "6",
    },
  ];
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.user);
  const toast: any = useRef({ current: "" });
  const rankRef: any = useRef({ current: "" });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isProfileDiscoverable, setisProfileDiscoverable] = useState<boolean>(false);
  const [battleBitPlaylist, setbattleBitPlaylist] = useState<number>(0);
  const [battleBitClass, setbattleBitClass] = useState<any>({ label: "rank" });
  const [battleBitRankText, setbattleBitRankText] = useState<number>(0);
  const [battleBitHoursText, setbattleBitHoursText] = useState<number>(0);
  const [battleBitTooltipString, setbattleBitTooltipString] = useState<string>("");
  const [battleBitWeekday, setbattleBitWeekday] = useState<string>("");
  const [battleBitWeekend, setbattleBitWeekend] = useState<string>("");

  useEffect(() => {
    dispatch(updateUserThunk(userData.id));
    props.changeBanner(
      "https://res.cloudinary.com/kultured-dev/image/upload/v1688412709/nouveau-cod-battlebit-remastered-devient-jeu-plus-vendu-steam_b8swv5.jpg"
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    rankRef.current.detectChangeFromParent(battleBitClass);
  }, [battleBitClass]);

  useEffect(() => {
    //Having this logic in the user state use effect means it will await the dispatch to get the latest info. It is otherwise hard to await the dispatch
    if (userData.email && userData.email !== "") {
      setbattleBitPlaylist(userData.battle_bit_playlist === null ? "" : userData.battle_bit_playlist);
      setbattleBitClass(
        !userData.battle_bit_class || userData.battle_bit_class === null
          ? { label: "class" }
          : { label: classOptions[userData.battle_bit_class - 1].label, value: userData.battle_bit_rank }
      );
      setbattleBitRankText(userData.battle_bit_rank === null ? 0 : userData.battle_bit_rank);
      setbattleBitHoursText(userData.battle_bit_hours === null ? 0 : userData.battle_bit_hours);
      setbattleBitWeekday(userData.battle_bit_weekdays === null ? "" : userData.battle_bit_weekdays);
      setbattleBitWeekend(userData.battle_bit_weekends === null ? "" : userData.battle_bit_weekends);
      setisProfileDiscoverable(
        !userData.battle_bit_is_published || userData.battle_bit_is_published === null
          ? false
          : userData.battle_bit_is_published
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const changeRocketLeaguePlaylist = (selection: number) => {
    if (battleBitPlaylist !== selection) setHasUnsavedChanges(true);
    setbattleBitPlaylist(selection);
  };

  const changeClass = (selection: any) => {
    if (!battleBitClass || battleBitClass.value !== selection.value) setHasUnsavedChanges(true);
    setbattleBitClass(selection);
    console.log("selection:", selection);
    return;
  };

  const changeBattleBitWeekday = (selection: string) => {
    if (battleBitWeekday !== selection) setHasUnsavedChanges(true);
    setbattleBitWeekday(selection);
  };

  const changeBattleBitWeekend = (selection: string) => {
    if (battleBitWeekend !== selection) setHasUnsavedChanges(true);
    setbattleBitWeekend(selection);
  };

  // BEGIN SAVE
  //NON-MODAL SAVE LOGIC
  const saveChanges = async () => {
    const availabilityValues: any = {
      none: 1,
      some: 2,
      "a lot": 3,
      "all day": 4,
    };
    const battleBitWeekdayIdValue = availabilityValues[battleBitWeekday];
    const battleBitWeekendIdValue = availabilityValues[battleBitWeekend];
    if (battleBitClass.value !== "" && userData.battle_bit_rank !== battleBitClass.value) {
      await updateGameSpecificInfoField(userData.id, "user_battle_bit_infos", "preferred_class", battleBitClass.value);
    }
    if (battleBitPlaylist !== 0 && userData.battle_bit_playlist !== battleBitPlaylist) {
      await updateGameSpecificInfoField(userData.id, "user_battle_bit_infos", "preferred_playlist", battleBitPlaylist);
    }
    if (battleBitRankText > 0 && userData.battle_bit_rank !== battleBitRankText) {
      await updateGameSpecificInfoField(userData.id, "user_battle_bit_infos", "rank", battleBitRankText);
    }
    if (battleBitHoursText > 0 && userData.battle_bit_hours !== battleBitHoursText) {
      await updateGameSpecificInfoField(userData.id, "user_battle_bit_infos", "hours", battleBitHoursText);
    }
    if (battleBitWeekday !== "" && userData.battle_bit_weekdays !== battleBitWeekday) {
      await updateGameSpecificInfoField(userData.id, "user_battle_bit_infos", "weekdays", battleBitWeekdayIdValue);
    }
    if (battleBitWeekend !== "" && userData.battle_bit_weekends !== battleBitWeekend) {
      await updateGameSpecificInfoField(userData.id, "user_battle_bit_infos", "weekends", battleBitWeekendIdValue);
    }
    // After all data is comitted to db, get fresh copy of user object to update state
    dispatch(updateUserThunk(userData.id));
    setHasUnsavedChanges(false);
    toast.current?.clear();
    toast.current.show({
      severity: "success",
      summary: "changes saved!",
      detail: ``,
      sticky: false,
    });
  };
  // END SAVE

  // BEGIN PUBLISH
  const tryPublishBattleBitProfile = async () => {
    if (!isProfileDiscoverable) {
      //execute http req
      const result = await attemptPublishBattleBitProfile(userData.id, "");
      if (result.status === "success") {
        await updateGameSpecificInfoField(userData.id, "user_battle_bit_infos", "is_published", true);
        setisProfileDiscoverable(true);
        toast.current?.clear();
        toast.current.show({
          severity: "success",
          summary: "battlebit profile published!",
          detail: ``,
          sticky: false,
        });
      } else if (result.data.length) {
        let fieldsString = "";
        result.data.forEach((field: any) => {
          fieldsString += `${field},  `;
        });
        fieldsString = fieldsString.slice(0, -3);
        //error handling here
        toast.current?.clear();
        toast.current.show({
          severity: "warn",
          summary: "missing profile fields: ",
          detail: `${fieldsString}`,
          sticky: true,
        });
      }
    } else {
      await updateGameSpecificInfoField(userData.id, "user_rocket_league_infos", "is_published", false);
      setisProfileDiscoverable(false);
      toast.current?.clear();
      toast.current.show({
        severity: "success",
        summary: "rocket league profile now hidden!",
        detail: ``,
        sticky: false,
      });
    }
    // After all data is comitted to db, get fresh copy of user object to update state
    dispatch(updateUserThunk(userData.id));
  };
  // END PUBLISH

  return (
    <div className="profile-master">
      <Toast ref={toast} />
      {/* START BATTLE BIT SETTINGS */}
      <div className="banner-container">
        <div className="prof-banner-detail-text" data-tip data-tooltip-id="publishTip">
          publish battlebit profile
        </div>
        <input
          checked={isProfileDiscoverable}
          onChange={() => {
            tryPublishBattleBitProfile();
          }}
          className="react-switch-checkbox"
          id={`react-switch-rocket_league-published`}
          type="checkbox"
        />
        <label className="react-switch-label" htmlFor={`react-switch-rocket_league-published`}>
          <span className={`react-switch-button`} />
        </label>
      </div>
      <div className="gradient-bar"></div>
      {/* BATTLE BIT CLASS */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">favorite class</div>
        <div className="select-container">
          <SelectComponent
            publicMethods={rankRef}
            title="rank"
            options={classOptions}
            multi={false}
            setSelection={changeClass}
            selection={battleBitClass}
          ></SelectComponent>
        </div>
      </div>
      <div className="gradient-bar"></div>
      {/* END BATTLE BIT CLASS */}
      {/* BATTLE BIT PLAYLIST */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">playlist</div>
        <div className="gender-container">
          <div
            className={`gender-box ${battleBitPlaylist === 1 ? "box-selected" : ""}`}
            onClick={() => {
              changeRocketLeaguePlaylist(1);
            }}
            onMouseEnter={() => setbattleBitTooltipString("127 vs 127")}
            data-tip
            data-tooltip-id="battleBitPlaylistTip"
          >
            127's
          </div>
          <div
            className={`gender-box ${battleBitPlaylist === 2 ? "box-selected" : ""}`}
            onClick={() => {
              changeRocketLeaguePlaylist(2);
            }}
            onMouseEnter={() => setbattleBitTooltipString("64 vs 64")}
            data-tip
            data-tooltip-id="battleBitPlaylistTip"
          >
            64's
          </div>
          <div
            className={`gender-box ${battleBitPlaylist === 3 ? "box-selected" : ""}`}
            onClick={() => {
              changeRocketLeaguePlaylist(3);
            }}
            onMouseEnter={() => setbattleBitTooltipString("32 vs 32")}
            data-tip
            data-tooltip-id="battleBitPlaylistTip"
          >
            32's
          </div>
        </div>
      </div>
      <div className="gradient-bar"></div>
      {/* END BATTLE BIT PLAYLIST */}
      {/* BATTLE BIT RANK */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">rank (level)</div>
        <input
          onChange={(event) => {
            setbattleBitRankText(parseInt(event.target.value));
            setHasUnsavedChanges(true);
          }}
          value={battleBitRankText ? battleBitRankText : ""}
          type="number"
          className="input-box"
          placeholder={
            userData.battle_bit_hours && userData.battle_bit_hours !== null && userData.battle_bit_hours !== ""
              ? userData.battle_bit_hours
              : "1"
          }
        ></input>
      </div>
      <div className="gradient-bar"></div>
      {/* END BATTLE BIT RANK */}
      {/* BATTLE BIT HOURS */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">hours played</div>
        <input
          onChange={(event) => {
            setbattleBitHoursText(parseInt(event.target.value));
            setHasUnsavedChanges(true);
          }}
          value={battleBitHoursText ? battleBitHoursText : ""}
          type="number"
          className="input-box"
          placeholder={userData.hours && userData.hours !== null && userData.hours !== "" ? userData.hours : "none"}
        ></input>
      </div>
      <div className="gradient-bar"></div>
      {/* END BATTLE BIT HOURS */}
      {/* Availability- Weekdays */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">weekday availabilty</div>
        <div className="gender-container">
          <div
            className={`gender-box ${battleBitWeekday === "none" ? "box-selected" : ""}`}
            onClick={() => {
              changeBattleBitWeekday("none");
            }}
            onMouseEnter={() => setbattleBitTooltipString("0 hours")}
            data-tip
            data-tooltip-id="battleBitPlaylistTip"
          >
            none
          </div>
          <div
            className={`gender-box ${battleBitWeekday === "some" ? "box-selected" : ""}`}
            onClick={() => {
              changeBattleBitWeekday("some");
            }}
            onMouseEnter={() => setbattleBitTooltipString("0-2 hours")}
            data-tip
            data-tooltip-id="battleBitPlaylistTip"
          >
            some
          </div>
          <div
            className={`gender-box ${battleBitWeekday === "a lot" ? "box-selected" : ""}`}
            onClick={() => {
              changeBattleBitWeekday("a lot");
            }}
            onMouseEnter={() => setbattleBitTooltipString("2-6 hours")}
            data-tip
            data-tooltip-id="battleBitPlaylistTip"
          >
            a lot
          </div>
          <div
            className={`gender-box ${battleBitWeekday === "all day" ? "box-selected" : ""}`}
            onClick={() => {
              changeBattleBitWeekday("all day");
            }}
            onMouseEnter={() => setbattleBitTooltipString("6+ hours")}
            data-tip
            data-tooltip-id="battleBitPlaylistTip"
          >
            all day
          </div>
        </div>
      </div>
      <div className="gradient-bar"></div>
      {/* END Availability- Weekdays */}
      {/* Availability- Weekends */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">weekend availability</div>
        <div className="gender-container">
          <div
            className={`gender-box ${battleBitWeekend === "none" ? "box-selected" : ""}`}
            onClick={() => {
              changeBattleBitWeekend("none");
            }}
            onMouseEnter={() => setbattleBitTooltipString("0 hours")}
            data-tip
            data-tooltip-id="battleBitPlaylistTip"
          >
            none
          </div>
          <div
            className={`gender-box ${battleBitWeekend === "some" ? "box-selected" : ""}`}
            onClick={() => {
              changeBattleBitWeekend("some");
            }}
            onMouseEnter={() => setbattleBitTooltipString("0-2 hours")}
            data-tip
            data-tooltip-id="battleBitPlaylistTip"
          >
            some
          </div>
          <div
            className={`gender-box ${battleBitWeekend === "a lot" ? "box-selected" : ""}`}
            onClick={() => {
              changeBattleBitWeekend("a lot");
            }}
            onMouseEnter={() => setbattleBitTooltipString("2-6 hours")}
            data-tip
            data-tooltip-id="battleBitPlaylistTip"
          >
            a lot
          </div>
          <div
            className={`gender-box ${battleBitWeekend === "all day" ? "box-selected" : ""}`}
            onClick={() => {
              changeBattleBitWeekend("all day");
            }}
            onMouseEnter={() => setbattleBitTooltipString("6+ hours")}
            data-tip
            data-tooltip-id="battleBitPlaylistTip"
          >
            all day
          </div>
        </div>
      </div>
      <div className="gradient-bar"></div>
      {/* END Availability- Weekends */}
      {/* START SAVE BOX */}
      <div className="save-box">
        <button className="save-button" disabled={!hasUnsavedChanges} onClick={() => saveChanges()}>
          save
        </button>
      </div>
      {/* END SAVE BOX */}
      {/* END BATTLE BIT SETTINGS */}
      <Tooltip id="battleBitPlaylistTip" place="top">
        {battleBitTooltipString}
      </Tooltip>
    </div>
  );
}
