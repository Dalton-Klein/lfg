import FooterComponent from "../nav/footerComponent";
import HeaderComponent from "../nav/headerComponent";
import "./settingsPage.scss";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BannerTitle from "../nav/banner-title";
import { Menu } from "primereact/menu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { updateUserField } from "../../utils/rest";
import { updateUserThunk } from "../../store/userSlice";
import { Toast } from "primereact/toast";

export default function SettingsPage() {
  const navigate = useNavigate();
  const userState = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const toast: any = useRef({ current: "" });

  const inputdevicesMenu: any = useRef(null);
  const outputDevicesMenu: any = useRef(null);
  const [currentInputDevice, setcurrentInputDevice] = useState<any>();
  const [currentOutputDevice, setcurrentOutputDevice] = useState<any>();
  // START Auto Scroll Logic
  const voiceVideoRef: any = useRef(null);
  const createAccountRef: any = useRef(null);
  const scrollToSection = (ref: any) => {
    ref.current?.scrollIntoView();
  };
  // END Auto Scroll Logic

  useEffect(() => {
    loadSavedDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userState]);

  const loadSavedDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    if (userState.input_device_id && userState.input_device_id.length) {
      const foundDevice = devices.find(({ deviceId }) => deviceId === userState.input_device_id);
      setcurrentInputDevice(foundDevice);
    }
    if (userState.output_device_id && userState.output_device_id.length) {
      const foundDevice = devices.find(({ deviceId }) => deviceId === userState.output_device_id);
      setcurrentOutputDevice(foundDevice);
    }
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
      toast.current.clear();
      toast.current.show({
        severity: "success",
        summary: "input device set!",
        detail: ``,
        sticky: false,
      });
    } else if (device.kind === "audiooutput") {
      setcurrentOutputDevice(device);
      await updateUserField(userState.id, "output_device_id", device.deviceId);
      toast.current.clear();
      toast.current.show({
        severity: "success",
        summary: "output device set!",
        detail: ``,
        sticky: false,
      });
    }
    dispatch(updateUserThunk(userState.id));
  };
  //END Audio Input

  return (
    <div>
      <HeaderComponent></HeaderComponent>
      <Toast ref={toast} />
      <div className="faq-master-container">
        <BannerTitle
          title={"user settings"}
          imageLink={"https://res.cloudinary.com/kultured-dev/image/upload/v1663566897/rust-tile-image_uaygce.png"}
        ></BannerTitle>
        {/* Contents */}
        <div className="faq-content-container">
          <div className="faq-sub-title">index</div>
          <div className="index-container">
            <div className="faq-list">
              <div
                onClick={() => {
                  scrollToSection(voiceVideoRef);
                }}
              >
                input device
              </div>
              <div
                onClick={() => {
                  scrollToSection(createAccountRef);
                }}
              >
                output device
              </div>
            </div>
          </div>
        </div>
        {/* Welcome */}
        <div className="faq-content-container" ref={voiceVideoRef}>
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
        <div className="faq-content-container" ref={createAccountRef}>
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
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
