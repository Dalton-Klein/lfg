import "./profileGeneral.scss";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip } from "react-tooltip";
import { RootState } from "../../store/store";
import { updateGameSpecificInfoField, attemptPublishRocketLeagueProfile } from "../../utils/rest";
import { Toast } from "primereact/toast";
import { updateUserThunk } from "../../store/userSlice";
import SelectComponent from "./selectComponent";

type Props = {
  locationPath: string;
  changeBanner: any;
};

export default function ProfileRocketLeague(props: Props) {
  const rankOptions = [
    {
      label: (
        <img
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1666570297/rl-bronze-transp_fw3ar3.png"
          alt="rocket league bronze rank"
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
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-silver-transp_ovmdbx.png"
          alt="rocket league silver rank"
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
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-gold-transp_vwr4dz.png"
          alt="rocket league gold rank"
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
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-plat-transp_rgbpdw.png"
          alt="rocket league platinum rank"
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
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-diamond-transp_j0vmlx.png"
          alt="rocket league diamond rank"
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
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1666570549/rl-champ-transp_v2xt1q.png"
          alt="rocket league champ rank"
          style={{ maxHeight: "5vh", maxWidth: "5vh", minHeight: "5vh", minWidth: "5vh" }}
        ></img>
      ),
      type: "rank",
      value: 6,
      id: "6",
    },
    {
      label: (
        <img
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1666570297/rl-grand-champ-transp_jflaeq.png"
          alt="rocket league grand champ rank"
          style={{ maxHeight: "5vh", maxWidth: "5vh", minHeight: "5vh", minWidth: "5vh" }}
        ></img>
      ),
      type: "rank",
      value: 7,
      id: "7",
    },
  ];
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.user);
  const toast: any = useRef({ current: "" });
  const rankRef: any = useRef({ current: "" });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isProfileDiscoverable, setisProfileDiscoverable] = useState<boolean>(false);
  const [rocketLeaguePlaylist, setrocketLeaguePlaylist] = useState<number>(0);
  const [rocketLeagueRank, setrocketLeagueRank] = useState<any>({ label: "rank" });
  const [rocketLeagueHoursText, setrocketLeagueHoursText] = useState<number>(0);
  const [availabilityTooltipString, setavailabilityTooltipString] = useState<string>("");
  const [rocketLeagueWeekday, setrocketLeagueWeekday] = useState<string>("");
  const [rocketLeagueWeekend, setrocketLeagueWeekend] = useState<string>("");

  useEffect(() => {
    dispatch(updateUserThunk(userData.id));
    props.changeBanner("https://res.cloudinary.com/kultured-dev/image/upload/v1665601538/rocket-league_fncx5c.jpg");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    rankRef.current.detectChangeFromParent(rocketLeagueRank);
  }, [rocketLeagueRank]);

  useEffect(() => {
    //Having this logic in the user state use effect means it will await the dispatch to get the latest info. It is otherwise hard to await the dispatch
    if (userData.email && userData.email !== "") {
      setrocketLeaguePlaylist(userData.rocket_league_playlist === null ? "" : userData.rocket_league_playlist);
      setrocketLeagueRank(
        !userData.rocket_league_rank || userData.rocket_league_rank === null
          ? { label: "rank" }
          : { label: rankOptions[userData.rocket_league_rank - 1].label, value: userData.rocket_league_rank }
      );
      setrocketLeagueHoursText(userData.rocket_league_hours === null ? 0 : userData.rocket_league_hours);
      setrocketLeagueWeekday(userData.rocket_league_weekdays === null ? "" : userData.rocket_league_weekdays);
      setrocketLeagueWeekend(userData.rocket_league_weekends === null ? "" : userData.rocket_league_weekends);
      setisProfileDiscoverable(
        !userData.rocket_league_is_published || userData.rocket_league_is_published === null
          ? false
          : userData.rocket_league_is_published
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const changeRocketLeaguePlaylist = (selection: number) => {
    if (rocketLeaguePlaylist !== selection) setHasUnsavedChanges(true);
    setrocketLeaguePlaylist(selection);
  };

  const changeRank = (selection: any) => {
    if (!rocketLeagueRank || rocketLeagueRank.value !== selection.value) setHasUnsavedChanges(true);
    setrocketLeagueRank(selection);
    console.log("selection:", selection);
    return;
  };

  const changeRocketLeagueWeekday = (selection: string) => {
    if (rocketLeagueWeekday !== selection) setHasUnsavedChanges(true);
    setrocketLeagueWeekday(selection);
  };

  const changeRocketLeagueWeekend = (selection: string) => {
    if (rocketLeagueWeekend !== selection) setHasUnsavedChanges(true);
    setrocketLeagueWeekend(selection);
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
    const rocketLeagueWeekdayIdValue = availabilityValues[rocketLeagueWeekday];
    const rocketLeagueWeekendIdValue = availabilityValues[rocketLeagueWeekend];
    if (rocketLeagueHoursText > 0 && userData.rocket_league_hours !== rocketLeagueHoursText) {
      await updateGameSpecificInfoField(userData.id, "user_rocket_league_infos", "hours", rocketLeagueHoursText);
    }
    if (rocketLeaguePlaylist !== 0 && userData.rocket_league_playlist !== rocketLeaguePlaylist) {
      await updateGameSpecificInfoField(
        userData.id,
        "user_rocket_league_infos",
        "preferred_playlist",
        rocketLeaguePlaylist
      );
    }
    if (rocketLeagueRank.value !== "" && userData.rocket_league_rank !== rocketLeagueRank.value) {
      await updateGameSpecificInfoField(userData.id, "user_rocket_league_infos", "rank", rocketLeagueRank.value);
    }
    if (rocketLeagueWeekday !== "" && userData.rocket_league_weekdays !== rocketLeagueWeekday) {
      await updateGameSpecificInfoField(
        userData.id,
        "user_rocket_league_infos",
        "weekdays",
        rocketLeagueWeekdayIdValue
      );
    }
    if (rocketLeagueWeekend !== "" && userData.rocket_league_weekends !== rocketLeagueWeekend) {
      await updateGameSpecificInfoField(
        userData.id,
        "user_rocket_league_infos",
        "weekends",
        rocketLeagueWeekendIdValue
      );
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
  const tryPublishRocketLeagueProfile = async () => {
    if (!isProfileDiscoverable) {
      //execute http req
      const result = await attemptPublishRocketLeagueProfile(userData.id, "");
      if (result.status === "success") {
        await updateGameSpecificInfoField(userData.id, "user_rocket_league_infos", "is_published", true);
        setisProfileDiscoverable(true);
        toast.current?.clear();
        toast.current.show({
          severity: "success",
          summary: "rocket league profile published!",
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
      {/* START ROCKET LEAGUE SETTINGS */}
      <div className="banner-container">
        <div className="prof-banner-detail-text" data-tip data-tooltip-id="publishTip">
          publish rocket league profile
        </div>
        <input
          checked={isProfileDiscoverable}
          onChange={() => {
            tryPublishRocketLeagueProfile();
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
      {/* ROCKET LEAGUE PLAYLIST */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">playlist</div>
        <div className="gender-container">
          <div
            className={`gender-box ${rocketLeaguePlaylist === 1 ? "box-selected" : ""}`}
            onClick={() => {
              changeRocketLeaguePlaylist(1);
            }}
            onMouseEnter={() => setavailabilityTooltipString("any non-ranked playlist")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            casual
          </div>
          <div
            className={`gender-box ${rocketLeaguePlaylist === 2 ? "box-selected" : ""}`}
            onClick={() => {
              changeRocketLeaguePlaylist(2);
            }}
            onMouseEnter={() => setavailabilityTooltipString("ranked 2v2")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            2's
          </div>
          <div
            className={`gender-box ${rocketLeaguePlaylist === 3 ? "box-selected" : ""}`}
            onClick={() => {
              changeRocketLeaguePlaylist(3);
            }}
            onMouseEnter={() => setavailabilityTooltipString("ranked 3v3")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            3's
          </div>
        </div>
      </div>
      <div className="gradient-bar"></div>
      {/* END ROCKET LEAGUE PLAYLIST */}
      {/* ROCKET LEAGUE RANK */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">rank</div>
        <div className="select-container">
          <SelectComponent
            publicMethods={rankRef}
            title="rank"
            options={rankOptions}
            multi={false}
            setSelection={changeRank}
            selection={rocketLeagueRank}
          ></SelectComponent>
        </div>
      </div>
      <div className="gradient-bar"></div>
      {/* END ROCKET LEAGUE RANK */}
      {/* ROCKET LEAGUE HOURS */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">hours played</div>
        <input
          onChange={(event) => {
            setrocketLeagueHoursText(parseInt(event.target.value));
            setHasUnsavedChanges(true);
          }}
          value={rocketLeagueHoursText ? rocketLeagueHoursText : ""}
          type="number"
          className="input-box"
          placeholder={userData.hours && userData.hours !== null && userData.hours !== "" ? userData.hours : "none"}
        ></input>
      </div>
      <div className="gradient-bar"></div>
      {/* END ROCKET LEAGUE HOURS */}
      {/* Availability- Weekdays */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">weekday availabilty</div>
        <div className="gender-container">
          <div
            className={`gender-box ${rocketLeagueWeekday === "none" ? "box-selected" : ""}`}
            onClick={() => {
              changeRocketLeagueWeekday("none");
            }}
            onMouseEnter={() => setavailabilityTooltipString("0 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            none
          </div>
          <div
            className={`gender-box ${rocketLeagueWeekday === "some" ? "box-selected" : ""}`}
            onClick={() => {
              changeRocketLeagueWeekday("some");
            }}
            onMouseEnter={() => setavailabilityTooltipString("0-2 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            some
          </div>
          <div
            className={`gender-box ${rocketLeagueWeekday === "a lot" ? "box-selected" : ""}`}
            onClick={() => {
              changeRocketLeagueWeekday("a lot");
            }}
            onMouseEnter={() => setavailabilityTooltipString("2-6 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            a lot
          </div>
          <div
            className={`gender-box ${rocketLeagueWeekday === "all day" ? "box-selected" : ""}`}
            onClick={() => {
              changeRocketLeagueWeekday("all day");
            }}
            onMouseEnter={() => setavailabilityTooltipString("6+ hours")}
            data-tip
            data-tooltip-id="availabilityTip"
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
            className={`gender-box ${rocketLeagueWeekend === "none" ? "box-selected" : ""}`}
            onClick={() => {
              changeRocketLeagueWeekend("none");
            }}
            onMouseEnter={() => setavailabilityTooltipString("0 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            none
          </div>
          <div
            className={`gender-box ${rocketLeagueWeekend === "some" ? "box-selected" : ""}`}
            onClick={() => {
              changeRocketLeagueWeekend("some");
            }}
            onMouseEnter={() => setavailabilityTooltipString("0-2 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            some
          </div>
          <div
            className={`gender-box ${rocketLeagueWeekend === "a lot" ? "box-selected" : ""}`}
            onClick={() => {
              changeRocketLeagueWeekend("a lot");
            }}
            onMouseEnter={() => setavailabilityTooltipString("2-6 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            a lot
          </div>
          <div
            className={`gender-box ${rocketLeagueWeekend === "all day" ? "box-selected" : ""}`}
            onClick={() => {
              changeRocketLeagueWeekend("all day");
            }}
            onMouseEnter={() => setavailabilityTooltipString("6+ hours")}
            data-tip
            data-tooltip-id="availabilityTip"
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
      {/* END ROCKET LEAGUE SETTINGS */}
      <Tooltip id="availabilityTip" place="top">
        {availabilityTooltipString}
      </Tooltip>
    </div>
  );
}
