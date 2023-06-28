/* eslint-disable */
import "./profileGeneral.scss";
import React from "react";
import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { updateUserThunk } from "../../store/userSlice";
import { updateUserField } from "../../utils/rest";
import { Toast } from "primereact/toast";
import { Menu } from "primereact/menu";
import { Tooltip } from "react-tooltip";
import { loadSavedDevices } from "../../utils/helperFunctions";

type Props = {
  changeBanner: any;
};

export default function AccountSettings(props: Props) {
  const dispatch = useDispatch();
  const userState = useSelector((state: RootState) => state.user.user);

  // Devices Related
  const inputdevicesMenu: any = useRef(null);
  const outputDevicesMenu: any = useRef(null);
  const [currentInputDevice, setcurrentInputDevice] = useState<any>();
  const [currentOutputDevice, setcurrentOutputDevice] = useState<any>();
  //Profile Fields Form Tracking
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [isEmailNotifications, setIsEmailNotifications] = useState<boolean>(true);
  const [isEmailMarketing, setIsEmailMarketing] = useState<boolean>(true);
  //End Profile Fields Form Tracking

  const toast: any = useRef({ current: "" });

  useEffect(() => {
    loadSavedInfo();
    props.changeBanner("https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //Setup hook for when url changes to track what banner image should be
  const pathname = window.location.pathname;
  useEffect(() => {
    //Gen profile needs this block to manually set image for the gen profile page
    //Game profiles house seperate logic to change banner
    props.changeBanner("https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png");
  }, [pathname]);

  useEffect(() => {
    //Having this logic in the user state use effect means it will await the dispatch to get the latest info. It is otherwise hard to await the dispatch
    if (userState.email && userState.email !== "") {
      setIsEmailNotifications(userState.is_email_notifications);
      setIsEmailMarketing(userState.is_email_marketing);
    }
    loadDevices();
  }, [userState]);

  // BEGIN Logic to load saved values to ui
  const loadSavedInfo = () => {
    dispatch(updateUserThunk(userState.id));
  };
  // End Logic to load saved values to ui

  //NON-MODAL SAVE LOGIC
  const saveChanges = async () => {
    if (userState.is_email_notifications !== isEmailNotifications) {
      await updateUserField(userState.id, "is_email_notifications", isEmailNotifications);
    }
    if (userState.is_email_marketing !== isEmailMarketing) {
      await updateUserField(userState.id, "is_email_marketing", isEmailMarketing);
    }
    // After all data is comitted to db, get fresh copy of user object to update state
    dispatch(updateUserThunk(userState.id));
    setHasUnsavedChanges(false);
    toast.current?.clear();
    toast.current.show({
      severity: "success",
      summary: "changes saved!",
      detail: ``,
      sticky: false,
    });
  };

  const deleteAccount = () => {
    toast.current?.clear();
    toast.current.show({
      severity: "info",
      summary: "feature coming soon!",
      detail: ``,
      sticky: false,
    });
  };

  // DEVICES LOGIC
  const loadDevices = async () => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((currentStream) => {
      // getUserMedia is required to trigger browser to ask permissions
    });
    const devices = await navigator.mediaDevices.enumerateDevices();
    console.log("devices", devices);
    const savedDevices = loadSavedDevices(devices, userState);
    setcurrentInputDevice(savedDevices.input_device);
    setcurrentOutputDevice(savedDevices.output_device);
  };

  //START Audio Input
  const renderDeviceOptions = (isInput: boolean) => {
    let deviceLabels: any = [];
    navigator.mediaDevices.enumerateDevices().then((results: any) => {
      results.forEach((device) => {
        if (isInput) {
          if (device.kind === "audioinput") {
            deviceLabels.push({
              label: (
                <div
                  onClick={() => {
                    selectAudioDevice(device);
                  }}
                >
                  {device.label}
                </div>
              ),
            });
          }
        } else {
          if (device.kind === "audiooutput") {
            deviceLabels.push({
              label: (
                <div
                  onClick={() => {
                    selectAudioDevice(device);
                  }}
                >
                  {device.label}
                </div>
              ),
            });
          }
        }
      });
    });
    return deviceLabels as any;
  };

  const selectAudioDevice = async (device: any) => {
    if (device.kind === "audioinput") {
      setcurrentInputDevice(device);
      await updateUserField(userState.id, "input_device_id", device.deviceId);
      toast.current?.clear();
      toast.current.show({
        severity: "success",
        summary: "input device set!",
        detail: ``,
        sticky: false,
      });
    }
    if (device.kind === "audiooutput") {
      setcurrentOutputDevice(device);
      await updateUserField(userState.id, "output_device_id", device.deviceId);
      toast.current?.clear();
      toast.current.show({
        severity: "success",
        summary: "output device set!",
        detail: ``,
        sticky: false,
      });
    }
    dispatch(updateUserThunk(userState.id));
  };

  return (
    <div className="profile-master">
      <Toast ref={toast} />
      {/* START ACCOUNT SETTINGS */}
      <div className="settings-container">
        <div className="banner-container">
          <div className="prof-banner-detail-text">email notifications</div>
          <input
            checked={isEmailNotifications}
            onChange={() => {
              setIsEmailNotifications(!isEmailNotifications);
              setHasUnsavedChanges(true);
            }}
            className="react-switch-checkbox"
            id={`react-switch-emails-notifications`}
            type="checkbox"
          />
          <label className="react-switch-label" htmlFor={`react-switch-emails-notifications`}>
            <span className={`react-switch-button`} />
          </label>
        </div>
        <div className="banner-container">
          <div className="prof-banner-detail-text">email news/offers</div>

          <input
            checked={isEmailMarketing}
            onChange={() => {
              setIsEmailMarketing(!isEmailMarketing);
              setHasUnsavedChanges(true);
            }}
            className="react-switch-checkbox"
            id={`react-switch-emails-marketing`}
            type="checkbox"
          />
          <label className="react-switch-label" htmlFor={`react-switch-emails-marketing`}>
            <span className={`react-switch-button`} />
          </label>
        </div>
        {/* START SAVE BOX */}
        <div className="save-box">
          <button className="save-button" disabled={!hasUnsavedChanges} onClick={() => saveChanges()}>
            save
          </button>
        </div>
        {/* END SAVE BOX */}
        <div className="gradient-bar"></div>
        {/* PASSWORD */}
        {/* ***DISABLED UNTIL CODED PROPERLY */}
        {/* <div className='banner-container'>
					<div className='prof-banner-detail-text' data-tip data-for='passwordTip'>
						password
					</div>
					<div className='banner-change-box'>
						<button className='text-only-button' onClick={() => startEditingAvatar('password')}>
							<img className='edit-icon' src='/assets/editiconw.png' alt='edit password'></img>
						</button>
					</div>
				</div>
				<div className='gradient-bar'></div> */}
        {/* END PASSWORD */}

        {/* START DEVICE SETTINGS */}
        <div className="faq-content-container">
          <div className="faq-sub-title">input device</div>
          <div className="settings-box">
            <Menu model={renderDeviceOptions(true)} popup ref={inputdevicesMenu} id="popup_menu" />
            <div className="faq-paragraph">
              {" "}
              {` ${currentInputDevice ? currentInputDevice.label : "no device selected"}`}
            </div>
            <button onClick={(event) => inputdevicesMenu.current.toggle(event)}>select device</button>
          </div>
        </div>
        {/* Creating Account */}
        <div className="faq-content-container">
          <div className="faq-sub-title">output device</div>
          <div className="settings-box">
            <Menu model={renderDeviceOptions(false)} popup ref={outputDevicesMenu} id="popup_menu" />
            <div className="faq-paragraph">
              {" "}
              {` ${currentOutputDevice ? currentOutputDevice.label : "no device selected"}`}
            </div>
            <button onClick={(event) => outputDevicesMenu.current.toggle(event)}>select device</button>
          </div>
        </div>
        {/* END DEVICE SETTINGS */}
        {/* START Delete Account */}
        <div className="save-box">
          <button className="save-button" onClick={() => deleteAccount()}>
            delete account
          </button>
        </div>
        {/* END Delete Account */}
      </div>

      <Tooltip id="passwordTip" place="right">
        You can change your password here. No password edit is required to complete profile. Will have no affect on
        google auth accounts.
      </Tooltip>
    </div>
  );
}
