import FooterComponent from "../nav/footerComponent";
import HeaderComponent from "../nav/headerComponent";
import "./settingsPage.scss";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import BannerTitle from "../nav/banner-title";
import { Menu } from "primereact/menu";

export default function SettingsPage() {
  const navigate = useNavigate();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const selectAudioDevice = (device: any) => {
    console.log("tring to select device!", device);
    if (device.kind === "audioinput") {
      setcurrentInputDevice(device);
    } else {
      setcurrentOutputDevice(device);
    }
  };
  //END Audio Input

  return (
    <div>
      <HeaderComponent></HeaderComponent>
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
