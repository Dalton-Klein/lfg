import "./profileGeneral.scss";
import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Tooltip } from "react-tooltip";
import { RootState } from "../../store/store";
import { updateGameSpecificInfoField, attemptPublishRustProfile } from "../../utils/rest";
import { Toast } from "primereact/toast";
import { updateUserThunk } from "../../store/userSlice";

type Props = {
  locationPath: string;
  changeBanner: any;
};

export default function ProfileRust(props: Props) {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.user);
  const toast: any = useRef({ current: "" });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isProfileDiscoverable, setisProfileDiscoverable] = useState<boolean>(false);
  const [rustHoursText, setRustHoursText] = useState<number>(0);
  const [availabilityTooltipString, setavailabilityTooltipString] = useState<string>("");
  const [serverType, setserverType] = useState<number>(0);
  const [wipeDay, setwipeDay] = useState<string>("");
  const [rustWeekday, setRustWeekday] = useState<string>("");
  const [rustWeekend, setRustWeekend] = useState<string>("");

  useEffect(() => {
    dispatch(updateUserThunk(userData.id));
    props.changeBanner("https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //Having this logic in the user state use effect means it will await the dispatch to get the latest info. It is otherwise hard to await the dispatch
    if (userData.email && userData.email !== "") {
      console.log("user data? ", `x ${userData.wipe_day_preference} x`, typeof userData.wipe_day_preference);
      setRustHoursText(userData.rust_hours === null ? "" : userData.rust_hours);
      setserverType(userData.rust_server_type_id === null ? "" : userData.rust_server_type_id);
      setwipeDay(userData.wipe_day_preference === null ? "" : userData.wipe_day_preference);
      setRustWeekday(userData.rust_weekdays === null ? "" : userData.rust_weekdays);
      setRustWeekend(userData.rust_weekends === null ? "" : userData.rust_weekends);
      setisProfileDiscoverable(
        !userData.rust_is_published || userData.rust_is_published === null ? false : userData.rust_is_published
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const changeServerType = (selection: number) => {
    if (serverType !== selection) setHasUnsavedChanges(true);
    setserverType(selection);
  };

  const changeWipeDay = (selection: string) => {
    if (wipeDay !== selection) setHasUnsavedChanges(true);
    setwipeDay(selection);
  };

  const changeRustWeekday = (selection: string) => {
    if (rustWeekday !== selection) setHasUnsavedChanges(true);
    setRustWeekday(selection);
  };

  const changeRustWeekend = (selection: string) => {
    if (rustWeekend !== selection) setHasUnsavedChanges(true);
    setRustWeekend(selection);
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
    const rustWeekdayIdValue = availabilityValues[rustWeekday];
    const rustWeekendIdValue = availabilityValues[rustWeekend];
    if (rustHoursText > 0 && userData.rust_hours !== rustHoursText) {
      await updateGameSpecificInfoField(userData.id, "user_rust_infos", "hours", rustHoursText);
    }
    if (serverType !== 0 && userData.rust_server_type_id !== serverType) {
      await updateGameSpecificInfoField(userData.id, "user_rust_infos", "server_type_id", serverType);
    }
    if (wipeDay !== "" && userData.wipe_day_preference !== wipeDay) {
      await updateGameSpecificInfoField(userData.id, "user_rust_infos", "wipe_day_preference", wipeDay);
    }
    if (rustWeekday !== "" && userData.rust_weekdays !== rustWeekday) {
      await updateGameSpecificInfoField(userData.id, "user_rust_infos", "weekdays", rustWeekdayIdValue);
    }
    if (rustWeekend !== "" && userData.rust_weekends !== rustWeekend) {
      await updateGameSpecificInfoField(userData.id, "user_rust_infos", "weekends", rustWeekendIdValue);
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
  const tryPublishRustProfile = async () => {
    if (!isProfileDiscoverable) {
      //execute http req
      const result = await attemptPublishRustProfile(userData.id, "");
      if (result.status === "success") {
        await updateGameSpecificInfoField(userData.id, "user_rust_infos", "is_published", true);
        setisProfileDiscoverable(true);
        toast.current?.clear();
        toast.current.show({
          severity: "success",
          summary: "rust profile published!",
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
      await updateGameSpecificInfoField(userData.id, "user_rust_infos", "is_published", false);
      setisProfileDiscoverable(false);
      toast.current?.clear();
      toast.current.show({
        severity: "success",
        summary: "rust profile now hidden!",
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
      {/* START RUST SETTINGS */}
      <div className="banner-container">
        <div className="prof-banner-detail-text" data-tip data-tooltip-id="publishTip">
          publish rust profile
        </div>
        <input
          checked={isProfileDiscoverable}
          onChange={() => {
            tryPublishRustProfile();
          }}
          className="react-switch-checkbox"
          id={`react-switch-rust-published`}
          type="checkbox"
        />
        <label className="react-switch-label" htmlFor={`react-switch-rust-published`}>
          <span className={`react-switch-button`} />
        </label>
      </div>
      <div className="gradient-bar"></div>
      {/* RUST HOURS */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">hours played</div>
        <input
          onChange={(event) => {
            setRustHoursText(parseInt(event.target.value));
            setHasUnsavedChanges(true);
          }}
          value={rustHoursText ? rustHoursText : ""}
          type="number"
          className="input-box"
          placeholder={userData.hours && userData.hours !== null && userData.hours !== "" ? userData.hours : "none"}
        ></input>
      </div>
      <div className="gradient-bar"></div>
      {/* END RUST HOURS */}
      {/* Server Type */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">server preference</div>
        <div className="gender-container">
          <div
            className={`gender-box ${serverType === 1 ? "box-selected" : ""}`}
            onClick={() => {
              changeServerType(1);
            }}
            onMouseEnter={() => setavailabilityTooltipString("0 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            vanilla
          </div>
          <div
            className={`gender-box ${serverType === 2 ? "box-selected" : ""}`}
            onClick={() => {
              changeServerType(2);
            }}
            onMouseEnter={() => setavailabilityTooltipString("0-2 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            2x
          </div>
          <div
            className={`gender-box ${serverType === 5 ? "box-selected" : ""}`}
            onClick={() => {
              changeServerType(5);
            }}
            onMouseEnter={() => setavailabilityTooltipString("2-6 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            5x
          </div>
          <div
            className={`gender-box ${serverType === 10 ? "box-selected" : ""}`}
            onClick={() => {
              changeServerType(10);
            }}
            onMouseEnter={() => setavailabilityTooltipString("6+ hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            10x
          </div>
        </div>
      </div>
      <div className="gradient-bar"></div>
      <div className="banner-container">
        <div className="prof-banner-detail-text">wipe day pref</div>
        <div className="gender-container">
          <div
            className={`gender-box ${wipeDay === "monday   " ? "box-selected" : ""}`}
            onClick={() => {
              changeWipeDay("monday   ");
            }}
          >
            mon
          </div>
          <div
            className={`gender-box ${wipeDay === "thursday " ? "box-selected" : ""}`}
            onClick={() => {
              changeWipeDay("thursday ");

              console.log("wipe?", wipeDay);
            }}
          >
            thurs
          </div>
        </div>
      </div>
      <div className="gradient-bar"></div>
      {/* END Availability- Weekends */}
      {/* Availability- Weekdays */}
      <div className="banner-container">
        <div className="prof-banner-detail-text">weekday availabilty</div>
        <div className="gender-container">
          <div
            className={`gender-box ${rustWeekday === "none" ? "box-selected" : ""}`}
            onClick={() => {
              changeRustWeekday("none");
            }}
            onMouseEnter={() => setavailabilityTooltipString("0 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            none
          </div>
          <div
            className={`gender-box ${rustWeekday === "some" ? "box-selected" : ""}`}
            onClick={() => {
              changeRustWeekday("some");
            }}
            onMouseEnter={() => setavailabilityTooltipString("0-2 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            some
          </div>
          <div
            className={`gender-box ${rustWeekday === "a lot" ? "box-selected" : ""}`}
            onClick={() => {
              changeRustWeekday("a lot");
            }}
            onMouseEnter={() => setavailabilityTooltipString("2-6 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            a lot
          </div>
          <div
            className={`gender-box ${rustWeekday === "all day" ? "box-selected" : ""}`}
            onClick={() => {
              changeRustWeekday("all day");
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
            className={`gender-box ${rustWeekend === "none" ? "box-selected" : ""}`}
            onClick={() => {
              changeRustWeekend("none");
            }}
            onMouseEnter={() => setavailabilityTooltipString("0 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            none
          </div>
          <div
            className={`gender-box ${rustWeekend === "some" ? "box-selected" : ""}`}
            onClick={() => {
              changeRustWeekend("some");
            }}
            onMouseEnter={() => setavailabilityTooltipString("0-2 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            some
          </div>
          <div
            className={`gender-box ${rustWeekend === "a lot" ? "box-selected" : ""}`}
            onClick={() => {
              changeRustWeekend("a lot");
            }}
            onMouseEnter={() => setavailabilityTooltipString("2-6 hours")}
            data-tip
            data-tooltip-id="availabilityTip"
          >
            a lot
          </div>
          <div
            className={`gender-box ${rustWeekend === "all day" ? "box-selected" : ""}`}
            onClick={() => {
              changeRustWeekend("all day");
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
      {/* END RUST SETTINGS */}
      <Tooltip id="availabilityTip" place="top">
        {availabilityTooltipString}
      </Tooltip>
    </div>
  );
}
