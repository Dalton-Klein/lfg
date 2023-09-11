import {
  addChannelFormIn,
  addChannelFormOut,
  avatarFormIn,
  avatarFormOut,
  memberSearchFormIn,
  memberSearchFormOut,
} from "../../utils/animations";
import "./gangsMgmt.scss";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useLocation, useNavigate } from "react-router-dom";
import {
  createNewGang,
  getGangActivity,
  updateGangField,
  getGangRequests,
  acceptGangConnectionRequest,
  uploadAvatarCloud,
  requestToJoinGang,
  searchUserByUsername,
  requestKickMember,
  requestRemoveChannel,
  requestCreateChannel,
  updateGangChannelField,
  updateGangRole,
  requestCreateGangRequirement,
  updateGangRequirementField,
  requestRemoveRequirement,
} from "../../utils/rest";
import { Toast } from "primereact/toast";
import { Tooltip } from "react-tooltip";
import BannerAlt from "../nav/banner-alt";
import SelectComponent from "../myProfile/selectComponent";
import { roleOptions } from "../../utils/selectOptions";
import ConnectionTile from "../tiles/connectionTile";
import Confetti from "react-confetti";
import { updateUserThunk } from "../../store/userSlice";
import { SelectButton } from "primereact/selectbutton";

const requirementPriorityOptions: any[] = [1, 2, 3, 4, 5];
const voiceFormOptions: string[] = ["text", "voice"];
export default function GangsMgmt() {
  const dispatch = useDispatch();
  const locationPath: string = useLocation().pathname;
  const hiddenFileInput: any = React.useRef(null);
  const userState = useSelector((state: RootState) => state.user.user);
  const toast: any = useRef({ current: "" });
  const topOfPageRef: any = useRef(null);
  const scrollToSection = (ref: any) => {
    ref.current?.scrollIntoView();
  };
  const navigate = useNavigate();

  const [isConfetti, setIsConfetti] = useState<any>(false);
  // Requests Mgmt
  const [requests, setrequests] = useState<any>([]);
  const [requestTiles, setrequestTiles] = useState<any>();
  // Basic Editing
  const [loadedGangInfo, setloadedGangInfo] = useState<any>({});
  const [hasCompletedForm, sethasCompletedForm] = useState<boolean>(false);
  const [hasUnsavedChanges, sethasUnsavedChanges] = useState<boolean>(false);
  const [isUploadFormShown, setisUploadFormShown] = useState<boolean>(false);
  const [photoFile, setphotoFile] = useState<File>({ name: "" } as File);
  const [gangAvatarUrl, setgangAvatarUrl] = useState<string>("");
  const [nameText, setnameText] = useState<string>("");
  const [aboutText, setaboutText] = useState<string>("");
  const [chatPlatform, setchatPlatform] = useState<number>(0);
  const [game, setgame] = useState<number>(0);
  const [isPublic, setisPublic] = useState<boolean>(true);
  //Requirement Editing
  const [isAddRequirementFormShown, setisAddRequirementFormShown] = useState<boolean>(false);
  const [requirementTiles, setrequirementTiles] = useState<any>();
  const [requirementDescriptionText, setrequirementDescriptionText] = useState<string>("");
  const [temporaryRequirementNames, settemporaryRequirementNames] = useState<any>({});
  const [temporaryPriorityLevels, settemporaryPriorityLevels] = useState<any>({});
  //Channel Editing
  const [isAddChannelFormShown, setisAddChannelFormShown] = useState<boolean>(false);
  const [channelTiles, setchannelTiles] = useState<any>();
  const [temporaryChannelNames, settemporaryChannelNames] = useState<any>({});
  const [requirementPriorityValue, setrequirementPriorityValue] = useState<number>(1);
  //Member Editing
  const [isAddMembersFormShown, setisAddMembersFormShown] = useState<boolean>(false);
  const [memberTiles, setmemberTiles] = useState<any>();
  const [temporaryRoles, settemporaryRoles] = useState<any>({});
  const rolesRef: any = useRef([{ current: "" }]);
  // Adding Gang Memebers
  const [usernameSearchText, setusernameSearchText] = useState<string>("");
  const [channelNameText, setchannelNameText] = useState<string>("");
  const [channelIsVoiceValue, setchannelIsVoiceValue] = useState<string>("text");
  useEffect(() => {
    if (locationPath[13] && parseInt(locationPath[13]) > 0) {
      //Get gang info to manage the gang
      loadGangInfos(parseInt(locationPath.slice(13, 55)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    checkIfFormComplete();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [game, chatPlatform]);

  //Used to render initial tiles, unfiltered
  useEffect(() => {
    const tempChannels: any = [];
    const tempPriorities: any = [];
    const tempRequirementDescriptions: any = [];
    if (loadedGangInfo && loadedGangInfo.channels && loadedGangInfo.channels.length) {
      loadedGangInfo.channels.forEach((channel) => {
        tempChannels[channel.id] = channel.name;
      });
      settemporaryChannelNames(tempChannels);
      loadedGangInfo.requirements.forEach((requirement) => {
        tempRequirementDescriptions[requirement.id] = requirement.description;
        tempPriorities[requirement.id] = requirement.priority_level;
      });
      settemporaryPriorityLevels(tempPriorities);
      settemporaryRequirementNames(tempRequirementDescriptions);
    } else {
      createChannelTiles();
      createRequirementTiles();
    }
    createMemberTiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedGangInfo]);

  useEffect(() => {
    createChannelTiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temporaryChannelNames]);

  useEffect(() => {
    createRequirementTiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temporaryPriorityLevels, temporaryRequirementNames]);

  useEffect(() => {
    createRequestTiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requests]);

  // START Loading UI
  const loadGangInfos = async (id: number) => {
    const gangResult = await getGangActivity(id, userState.id, "");
    const formattedMembers: any = [];
    gangResult.basicInfo.members.forEach((member) => {
      formattedMembers.push({ label: member.role_name, value: member.role_id });
    });
    settemporaryRoles(formattedMembers);
    if (gangResult.role.role_id === 1) {
      setloadedGangInfo(gangResult);
      setnameText(gangResult.basicInfo.name);
      setaboutText(gangResult.basicInfo.about);
      setgangAvatarUrl(gangResult.basicInfo.avatar_url);
      setchatPlatform(gangResult.basicInfo.chat_platform_id);
      setgame(gangResult.basicInfo.game_platform_id);
      setisPublic(gangResult.basicInfo.is_public);
    } else {
      setloadedGangInfo(gangResult);
      //TODO prevent non-owner from managing gang
    }
    loadGangRequests(id);
  };

  const loadGangRequests = async (id: number) => {
    const requestsResult = await getGangRequests(id, false, "");
    setrequests(requestsResult);
  };
  const createRequirementTiles = () => {
    const tempRequirementTiles: any = [];
    tempRequirementTiles.push(
      <div key={0} className="channels-mgmt-tile">
        <div className="channels-mgmt-naming">
          <button
            onClick={() => {
              showAddRequirementModal();
            }}
          >
            add requirement
          </button>
        </div>
      </div>
    );
    const actualRequirements = loadedGangInfo.requirements?.map((tile: any) => (
      <div key={tile.id} className="channels-mgmt-tile">
        <input
          onChange={(event) => {
            updateRequirementDescriptionText(tile, event.target.value);
          }}
          value={temporaryRequirementNames[tile.id]}
          type="text"
          className="channels-mgmt-input-box"
          placeholder={tile.description}
        ></input>
        <div className="priority-selector-title">requirement priority level</div>
        <SelectButton
          value={temporaryPriorityLevels[tile.id]}
          onChange={(e) => updateRequirementPriorityLevel(tile, e.target.value)}
          options={requirementPriorityOptions}
          className="priority-selector-input"
        />
        <div className="channels-mgmt-naming">
          <button
            onClick={() => {
              saveRequirementUpdate(tile.id);
            }}
          >
            save
          </button>
          <button
            onClick={() => {
              removeRequirement(tile);
            }}
          >
            <i className="pi pi-trash" />
          </button>
        </div>
      </div>
    ));
    const preppedRequirements = tempRequirementTiles.concat(actualRequirements);
    setrequirementTiles(preppedRequirements);
  };
  const createChannelTiles = () => {
    const tempChannelTiles: any = [];
    tempChannelTiles.push(
      <div key={0} className="channels-mgmt-tile">
        <div className="channels-mgmt-naming">
          <button
            onClick={() => {
              showAddChannelModal();
            }}
          >
            add channel
          </button>
        </div>
      </div>
    );
    const actualChannels = loadedGangInfo.channels?.map((tile: any) => (
      <div key={tile.id} className="channels-mgmt-tile">
        <input
          onChange={(event) => {
            updateChannelNameText(tile, event.target.value);
          }}
          value={temporaryChannelNames[tile.id]}
          type="text"
          className="channels-mgmt-input-box"
          placeholder={tile.name}
        ></input>
        <div className="channels-mgmt-naming">
          <button
            onClick={() => {
              saveNewChannelName(tile.id);
            }}
          >
            save
          </button>
          <button
            onClick={() => {
              removeChannel(tile);
            }}
          >
            <i className="pi pi-trash" />
          </button>
        </div>
      </div>
    ));
    const preppedChannels = tempChannelTiles.concat(actualChannels);
    setchannelTiles(preppedChannels);
  };
  const createMemberTiles = () => {
    setmemberTiles([]);
    const tempMemberTiles: any = [];
    tempMemberTiles.push(
      <div key={0 - (Math.floor(Math.random() * 6000) + 1)} className="channels-mgmt-tile">
        <div className="channels-mgmt-naming">
          <button
            onClick={() => {
              showPlayerSearchModal();
            }}
          >
            add members
          </button>
        </div>
      </div>
    );
    const mappedTiles = loadedGangInfo.basicInfo?.members?.map((tile: any) => (
      <div key={tile.id + (Math.floor(Math.random() * 60000) + 1)} className="channels-mgmt-tile">
        <div className="channels-mgmt-naming">
          {tile.username}
          <SelectComponent
            publicMethods={rolesRef}
            title="role"
            options={roleOptions}
            multi={false}
            setSelection={(selectedValue: any) => {
              changeRole(selectedValue, tile);
            }}
            selection={temporaryRoles.find(({ value }) => value === tile.role_id)}
          ></SelectComponent>
          <button
            onClick={() => {
              kickMember(tile);
            }}
            disabled={tile.role_id === 1}
          >
            kick
          </button>
        </div>
      </div>
    ));
    const updatedMemberTiles = tempMemberTiles.concat(mappedTiles);
    setmemberTiles(updatedMemberTiles);
  };

  const photoSubmitHandler = async (e: any) => {
    avatarFormOut();
    setisUploadFormShown(false);
    const avatar = document.querySelector(".avatar-input");
    const url: string = await uploadAvatarCloud(avatar);
    if (locationPath === "/create-gang") {
      //If creating gang, store url until ready to submit entire form
    } else {
      //If managing gang, we can update the db with the new url
      updateGangField(loadedGangInfo.basicInfo.id, "avatar_url", url!);
      setphotoFile({ name: "" } as File);
      let copyOfGang = Object.assign({}, loadedGangInfo);
      copyOfGang.basicInfo.avatar_url = url;
      setloadedGangInfo(copyOfGang);
    }
    setgangAvatarUrl(url);
  };

  const createRequestTiles = () => {
    //Make property for game image
    let copyOfRequests = requests;
    if (requests.length) {
      copyOfRequests.forEach((request) => {
        request.platform = loadedGangInfo.basicInfo.game_platform_id;
      });
      setrequestTiles(
        copyOfRequests.map((tile: any) => (
          <ConnectionTile
            key={tile.id}
            {...tile}
            type={3}
            callAcceptRequest={(requestId: number) => {
              acceptRequest(tile.id);
            }}
          ></ConnectionTile>
        ))
      );
    } else {
      setrequestTiles(<div className="nothing-pending">no pending requests!</div>);
    }
  };
  //END Loading UI

  //START Gang Gen Editing
  const checkIfFormComplete = () => {
    if (nameText && nameText.length >= 3 && aboutText && aboutText.length >= 3 && chatPlatform > 0 && game > 0) {
      sethasCompletedForm(true);
    } else {
      sethasCompletedForm(false);
    }
    return;
  };
  const changeSelectedPlatform = (selection: number) => {
    if (chatPlatform !== selection) sethasUnsavedChanges(true);
    setchatPlatform(selection);
    return;
  };
  const changeSelectedGame = (selection: number) => {
    if (game !== selection) sethasUnsavedChanges(true);
    setgame(selection);
    return;
  };
  //END Gang Gen Editing

  //START Modal EDIT LOGIC
  const chooseFileHandler = (event: any) => {
    if (hiddenFileInput.current !== null) {
      hiddenFileInput.current!.click();
    }
    return;
  };
  const handleFileUpload = (event: any) => {
    setphotoFile(event.target.files[0]);
    return;
  };
  const closeAvatar = () => {
    avatarFormOut();
    memberSearchFormOut();
    addChannelFormOut();
    setisUploadFormShown(false);
    setisAddMembersFormShown(false);
    return;
  };
  const startEditingAvatar = async (field: string) => {
    if (userState.id === 0) alert("You must be logged in to edit this field");
    setisUploadFormShown(true);
    avatarFormIn();
    scrollToSection(topOfPageRef);
    return;
  };
  const showPlayerSearchModal = () => {
    if (userState.id === 0) alert("You must be logged in to add a member");
    setisAddMembersFormShown(true);
    memberSearchFormIn();
    scrollToSection(topOfPageRef);
    return;
  };
  const showAddRequirementModal = () => {
    if (userState.id === 0) alert("You must be logged in to add a requirement");
    setisAddRequirementFormShown(true);
    addChannelFormIn();
    scrollToSection(topOfPageRef);
    return;
  };
  const showAddChannelModal = () => {
    if (userState.id === 0) alert("You must be logged in to add a channel");
    setisAddChannelFormShown(true);
    addChannelFormIn();
    scrollToSection(topOfPageRef);
    return;
  };

  const trySendInvite = async () => {
    const searchResult = await searchUserByUsername(usernameSearchText, "");
    if (searchResult.data?.id) {
      const inviteResult = await requestToJoinGang(loadedGangInfo.basicInfo.id, searchResult.data.id, false, "");
      if (inviteResult && inviteResult[0] && inviteResult[0].id) {
        toast.current?.clear();
        toast.current.show({
          severity: "success",
          summary: "invite sent!",
          detail: ``,
          sticky: false,
        });
      } else if (inviteResult && inviteResult.error) {
        toast.current?.clear();
        toast.current.show({
          severity: "warn",
          summary: `${inviteResult.error}`,
          detail: ``,
          sticky: false,
        });
      } else {
        toast.current?.clear();
        toast.current.show({
          severity: "warn",
          summary: "error sending request!",
          detail: ``,
          sticky: false,
        });
      }
    } else {
      toast.current?.clear();
      toast.current.show({
        severity: "warn",
        summary: "no user exists with that name!",
        detail: ``,
        sticky: false,
      });
    }
  };
  //END Modal EDIT LOGIC

  //START NON-MODAL SAVE LOGIC
  const saveChanges = async () => {
    if (loadedGangInfo.basicInfo.name !== nameText) {
      await updateGangField(loadedGangInfo.basicInfo.id, "name", nameText);
    }
    if (loadedGangInfo.basicInfo.about !== aboutText) {
      await updateGangField(loadedGangInfo.basicInfo.id, "about", aboutText);
    }
    if (loadedGangInfo.basicInfo.chat_platform_id !== chatPlatform) {
      await updateGangField(loadedGangInfo.basicInfo.id, "chat_platform_id", chatPlatform);
    }
    if (loadedGangInfo.basicInfo.game_platform_id !== game) {
      await updateGangField(loadedGangInfo.basicInfo.id, "game_platform_id", game);
    }
    if (loadedGangInfo.basicInfo.is_public !== isPublic) {
      await updateGangField(loadedGangInfo.basicInfo.id, "is_public", isPublic);
    }
    loadGangInfos(loadedGangInfo.basicInfo.id);
    sethasUnsavedChanges(false);
    toast.current?.clear();
    toast.current.show({
      severity: "success",
      summary: "changes saved!",
      detail: ``,
      sticky: false,
    });
  };
  const tryCreateGang = async () => {
    const createResult = await createNewGang(userState.id, {
      name: nameText,
      avatar_url: gangAvatarUrl,
      about: aboutText,
      chat_platform_id: chatPlatform,
      game_platform_id: game,
      is_public: isPublic,
    });
    if (createResult && createResult.success) {
      dispatch(updateUserThunk(userState.id));
      navigate(`/gang/${createResult.gangId}`);
    } else {
      // TODO Handle error when creating gang
    }
  };
  //END NON-MODAL SAVE LOGIC

  //Start Requirements Edit Logic
  const switchRequirementPriorityForm = (e: any) => {
    //this is for the new requirement modal
    setrequirementPriorityValue(e.value);
  };
  const tryCreateRequirement = async () => {
    const createResult = await requestCreateGangRequirement(
      parseInt(locationPath.slice(13, 55)),
      userState.id,
      requirementDescriptionText,
      requirementPriorityValue,
      ""
    );
    toast.current?.clear();
    toast.current.show({
      severity: "success",
      summary: `requirement created!`,
      detail: ``,
      sticky: false,
    });
    closeAvatar();
    loadGangInfos(parseInt(locationPath.slice(13, 55)));
  };
  const updateRequirementDescriptionText = (tile: { id: string | number }, text: any) => {
    let copyOfNames = [...temporaryRequirementNames];
    copyOfNames[tile.id] = text;
    settemporaryRequirementNames(copyOfNames);
  };
  const updateRequirementPriorityLevel = (tile: { id: string | number }, priority: any) => {
    //this is for loaded tiles
    let copyOfPriorities = [...temporaryPriorityLevels];
    copyOfPriorities[tile.id] = priority;
    settemporaryPriorityLevels(copyOfPriorities);
  };
  const saveRequirementUpdate = async (id: number) => {
    const description = temporaryRequirementNames[id];
    const priorityLevel = temporaryPriorityLevels[id];
    const result: any = await updateGangRequirementField(id, "description", description);
    const priorityResult: any = await updateGangRequirementField(id, "priority_level", priorityLevel);
    if (result && priorityResult) {
      toast.current?.clear();
      toast.current.show({
        severity: "info",
        summary: "requirement updated!",
        detail: ``,
        sticky: false,
      });
      loadGangInfos(parseInt(locationPath.slice(13, 55)));
    } else {
      toast.current?.clear();
      toast.current.show({
        severity: "info",
        summary: "failed to update description!",
        detail: ``,
        sticky: false,
      });
    }
  };
  const removeRequirement = async (tile) => {
    await requestRemoveRequirement(tile.id, "");
    loadGangInfos(parseInt(locationPath.slice(13, 55)));
    toast.current?.clear();
    toast.current.show({
      severity: "success",
      summary: "removed channel!",
      detail: ``,
      sticky: false,
    });
  };
  //Start Channel Edit LOGIC
  const tryCreateChannel = async () => {
    const isVoice = channelIsVoiceValue === "text" ? false : true;
    const createResult = await requestCreateChannel(parseInt(locationPath.slice(13, 55)), channelNameText, isVoice, "");
    toast.current?.clear();
    toast.current.show({
      severity: "success",
      summary: `channel created!`,
      detail: ``,
      sticky: false,
    });
    closeAvatar();
    loadGangInfos(parseInt(locationPath.slice(13, 55)));
  };
  const toggleIsVoiceForm = (e: any) => {
    setchannelIsVoiceValue(e.value);
  };
  const removeChannel = async (tile) => {
    let numberOfTextChannels = 0;
    loadedGangInfo.channels.forEach((channel) => {
      if (channel.is_voice === false) numberOfTextChannels++;
    });
    if (numberOfTextChannels < 2) {
      toast.current?.clear();
      toast.current.show({
        severity: "info",
        summary: "you need to keep at least one channel!",
        detail: ``,
        sticky: false,
      });
    } else {
      await requestRemoveChannel(tile.id, "");
      loadGangInfos(parseInt(locationPath.slice(13, 55)));
      toast.current?.clear();
      toast.current.show({
        severity: "success",
        summary: "removed channel!",
        detail: ``,
        sticky: false,
      });
    }
  };
  const updateChannelNameText = (tile, text) => {
    let copyOfNames = [...temporaryChannelNames];
    copyOfNames[tile.id] = text;
    settemporaryChannelNames(copyOfNames);
  };

  const saveNewChannelName = async (id: number) => {
    const name = temporaryChannelNames[id];
    const result: any = await updateGangChannelField(id, "name", name);
    if (result) {
      toast.current?.clear();
      toast.current.show({
        severity: "info",
        summary: "channel updated!",
        detail: ``,
        sticky: false,
      });
      loadGangInfos(parseInt(locationPath.slice(13, 55)));
    } else {
      toast.current?.clear();
      toast.current.show({
        severity: "info",
        summary: "failed to update name!",
        detail: ``,
        sticky: false,
      });
    }
  };
  //END Channel Edit LOGIC

  //START Member Edit Logic
  const changeRole = async (selection: any, tile: any) => {
    const copyOfTemp = [...temporaryRoles];
    copyOfTemp[selection.id] = selection;
    settemporaryRoles(copyOfTemp);
    const acceptResult = await updateGangRole(loadedGangInfo.basicInfo.id, tile.id, selection.id);
    if (acceptResult) {
      toast.current?.clear();
      toast.current.show({
        severity: "info",
        summary: "role updated!",
        detail: ``,
        sticky: false,
      });
      loadGangInfos(parseInt(locationPath.slice(13, 55)));
    } else {
      toast.current?.clear();
      toast.current.show({
        severity: "info",
        summary: "error updating role!",
        detail: ``,
        sticky: false,
      });
    }
    return;
  };
  const acceptRequest = async (requestId: number) => {
    const acceptResult = await acceptGangConnectionRequest(requestId, "");
    const blastConfetti = async () => {
      setTimeout(function () {
        setIsConfetti(false);
      }, 4000);
    };
    if (acceptResult && acceptResult.length) {
      setIsConfetti(true);
      await blastConfetti();
      loadGangRequests(parseInt(locationPath.slice(13, 55)));
    }
  };
  const kickMember = async (tile: any) => {
    await requestKickMember(parseInt(locationPath.slice(13, 55)), tile.id, "");
    toast.current?.clear();
    toast.current.show({
      severity: "success",
      summary: `${tile.username} has been kicked!`,
      detail: ``,
      sticky: false,
    });
    loadGangInfos(parseInt(locationPath.slice(13, 55)));
  };
  //END Member Edit Logic
  const conditionalAddRequirementClass = isAddRequirementFormShown ? "conditionalZ2" : "conditionalZ1";
  const conditionalUploadFormClass = isUploadFormShown ? "conditionalZ2" : "conditionalZ1";
  const conditionalAddMembersClass = isAddMembersFormShown ? "conditionalZ2" : "conditionalZ1";
  const conditionalAddChannelClass = isAddChannelFormShown ? "conditionalZ2" : "conditionalZ1";
  const width = 1920;
  const height = 1080;
  return (
    <div>
      <Toast ref={toast} />
      {isConfetti ? (
        <Confetti
          numberOfPieces={isConfetti ? 500 : 0}
          recycle={false}
          width={width}
          height={height}
          tweenDuration={1000}
        />
      ) : (
        <></>
      )}
      {/* Show stuff only if creating gang, or after existing gang info is loaded */}
      {locationPath === "/create-gang" || loadedGangInfo.basicInfo?.id ? (
        <BannerAlt
          title={locationPath === "/create-gang" ? "create gang" : "manage gang"}
          buttonText={locationPath === "/create-gang" ? "cancel" : "back to gang"}
          buttonLink={locationPath === "/create-gang" ? "/dashboard" : `/gang/${loadedGangInfo.basicInfo?.id}`}
        ></BannerAlt>
      ) : (
        <></>
      )}
      {locationPath !== "/create-gang" ? (
        <div className="gang-mgmt-master">
          <div className="gang-mgmt-container">
            <div className="gang-mgmt-title" ref={topOfPageRef}>
              based on your role of
              <span className="link-text"> {loadedGangInfo.role?.role_name}</span> you can...
            </div>
            <div className="gang-mgmt-perms-box">
              <div className="gang-mgmt-perms-col">
                <div>
                  {loadedGangInfo.role?.role_id === 1 ? (
                    <i className="pi pi-check"></i>
                  ) : (
                    <i className="pi pi-times"></i>
                  )}
                  manage basics
                </div>
                <div>
                  {loadedGangInfo.role?.role_id === 1 ? (
                    <i className="pi pi-check"></i>
                  ) : (
                    <i className="pi pi-times"></i>
                  )}
                  manage members
                </div>
                <div>
                  {[1, 2].includes(loadedGangInfo.role?.role_id) ? (
                    <i className="pi pi-check"></i>
                  ) : (
                    <i className="pi pi-times"></i>
                  )}
                  manage channels
                </div>
              </div>
              <div className="gang-mgmt-perms-col">
                <div>
                  {loadedGangInfo.role?.role_id === 1 ? (
                    <i className="pi pi-check"></i>
                  ) : (
                    <i className="pi pi-times"></i>
                  )}
                  manage roles
                </div>
                <div>
                  {[1, 2, 3].includes(loadedGangInfo.role?.role_id) ? (
                    <i className="pi pi-check"></i>
                  ) : (
                    <i className="pi pi-times"></i>
                  )}
                  manage requests
                </div>
                <div>
                  {[1, 2, 3, 4].includes(loadedGangInfo.role?.role_id) ? (
                    <i className="pi pi-check"></i>
                  ) : (
                    <i className="pi pi-times"></i>
                  )}
                  manage messages
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      {locationPath !== "/create-gang" ? (
        <div className="gang-mgmt-master">
          <div className="gang-mgmt-container">
            <div className="gang-mgmt-title">requests to join</div>
            {requestTiles}
          </div>
        </div>
      ) : (
        <></>
      )}
      {/* Show stuff only if creating gang, or after existing gang info is loaded */}
      {locationPath === "/create-gang" || loadedGangInfo.basicInfo?.id ? (
        <div className="gang-mgmt-master">
          <div className="gang-mgmt-container">
            <div className="gang-mgmt-title">{locationPath === "/create-gang" ? "create gang" : "manage basics"}</div>
            <div className="gradient-bar"></div>
            {/* AVATAR PHTO */}
            <div className="gang-container-top">
              {!gangAvatarUrl ||
              gangAvatarUrl ===
                "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png" ? (
                <div
                  className="dynamic-avatar-bg"
                  onClick={() => startEditingAvatar("avatar_url")}
                  data-tip
                  data-tooltip-id="avatarTip"
                >
                  <div className="dynamic-avatar-text">
                    {nameText
                      ? nameText
                          .split(" ")
                          .map((word: string) => word[0])
                          .join("")
                          .slice(0, 2)
                          .toLowerCase()
                      : "gg"}
                  </div>
                </div>
              ) : (
                <img
                  className="gang-avatar"
                  src={gangAvatarUrl}
                  alt="my-avatar"
                  onClick={() => startEditingAvatar("avatar_url")}
                  data-tip
                  data-tooltip-id="avatarTip"
                ></img>
              )}
            </div>
            <div className="gradient-bar"></div>
            {/* DISPLAY NAME */}
            <div className="gang-container">
              <div className="gang-about-text" data-tip data-tooltip-id="gang-name-tooltip">
                gang name
              </div>
              <input
                onChange={(event) => {
                  setnameText(event.target.value);
                  sethasUnsavedChanges(true);
                  checkIfFormComplete();
                }}
                value={nameText ? nameText : ""}
                type="text"
                className="input-box"
                placeholder={locationPath === "/create-gang" ? "name..." : "name..."}
              ></input>
            </div>
            <div className="gradient-bar"></div>
            {/* ABOUT */}
            <div className="gang-container">
              <div className="gang-about-text" data-tip data-tooltip-id="gang-name-tooltip">
                about
              </div>
              <input
                onChange={(event) => {
                  setaboutText(event.target.value);
                  sethasUnsavedChanges(true);
                  checkIfFormComplete();
                }}
                value={aboutText ? aboutText : ""}
                type="text"
                className="input-box"
                placeholder={locationPath === "create-gang" ? "about..." : "about..."}
              ></input>
            </div>
            <div className="gradient-bar"></div>
            {/* END ABOUT */}
            {/* CHAT PLATFROM */}
            <div className="gang-container">
              <div className="gang-about-text" data-tip data-tooltip-id="must-select-tooltip">
                chat platform
              </div>
              <div className="gender-container">
                <div
                  className={`gender-box ${chatPlatform === 1 ? "box-selected" : ""}`}
                  onClick={() => {
                    changeSelectedPlatform(1);
                  }}
                >
                  <img
                    className="gender-icon"
                    src={"https://res.cloudinary.com/kultured-dev/image/upload/v1685814273/logoWhiteSmall_i1lvgo.png"}
                    alt="gangs selector"
                  ></img>
                </div>
                <div
                  className={`gender-box ${chatPlatform === 2 ? "box-selected" : ""}`}
                  onClick={() => {
                    changeSelectedPlatform(2);
                  }}
                >
                  <img
                    className="gender-icon"
                    src={"https://res.cloudinary.com/kultured-dev/image/upload/v1685814624/psn-logo-small_nbgzwa.png"}
                    alt="psn selector"
                  ></img>
                </div>
                <div
                  className={`gender-box ${chatPlatform === 3 ? "box-selected" : ""}`}
                  onClick={() => {
                    changeSelectedPlatform(3);
                  }}
                >
                  <img
                    className="gender-icon"
                    src={"https://res.cloudinary.com/kultured-dev/image/upload/v1685814627/xbox-logo-small_e8sqjw.png"}
                    alt="xbox selector"
                  ></img>
                </div>
              </div>
            </div>
            <div className="gradient-bar"></div>
            {/* END CHAT PLATFROM */}
            {/* GAME PLATFROM */}
            <div className="gang-container">
              <div className="gang-about-text" data-tip data-tooltip-id="must-select-tooltip">
                primary game
              </div>
              {/* ***NEW GAME MODIFY */}
              <div className="gender-container">
                <div
                  className={`gender-box ${game === 1 ? "box-selected" : ""}`}
                  onClick={() => {
                    changeSelectedGame(1);
                  }}
                >
                  <img
                    className="gender-icon"
                    src={"https://res.cloudinary.com/kultured-dev/image/upload/v1663786762/rust-logo-small_uarsze.png"}
                    alt="rust selector"
                  ></img>
                </div>
                <div
                  className={`gender-box ${game === 2 ? "box-selected" : ""}`}
                  onClick={() => {
                    changeSelectedGame(2);
                  }}
                >
                  <img
                    className="gender-icon"
                    src={
                      "https://res.cloudinary.com/kultured-dev/image/upload/v1665620519/RocketLeagueResized_loqz1h.png"
                    }
                    alt="rocket league selector"
                  ></img>
                </div>
                <div
                  className={`gender-box ${game === 4 ? "box-selected" : ""}`}
                  onClick={() => {
                    changeSelectedGame(4);
                  }}
                >
                  <img
                    className="gender-icon"
                    src={"https://res.cloudinary.com/kultured-dev/image/upload/v1688414978/battle-bit-logo_ctgigq.jpg"}
                    alt="rocket league selector"
                  ></img>
                </div>
              </div>
            </div>
            <div className="gradient-bar"></div>
            {/* END GAME PLATFROM */}
            {/* IS PUBLIC */}
            <div className="gang-container">
              <div className="gang-about-text">is public</div>
              <input
                checked={isPublic}
                onChange={() => {
                  setisPublic(!isPublic);
                  sethasUnsavedChanges(true);
                }}
                className="react-switch-checkbox"
                id={`react-switch-emails-marketing`}
                type="checkbox"
              />
              <label className="react-switch-label" htmlFor={`react-switch-emails-marketing`}>
                <span className={`react-switch-button`} />
              </label>
            </div>
            <div className="gradient-bar"></div>
            {/* END IS PUBLIC */}
            {/* START SAVE BOX */}
            <div className="save-box">
              <button
                className="save-button"
                disabled={locationPath === "/create-gang" ? !hasCompletedForm : !hasUnsavedChanges}
                onClick={() => {
                  if (locationPath === "/create-gang") {
                    tryCreateGang();
                  } else {
                    saveChanges();
                  }
                }}
              >
                {locationPath === "/create-gang" ? "create" : "save"}
              </button>
            </div>
            {/* END SAVE BOX */}
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Show requirement mgmt only if not creating gang and gang info is loaded */}
      {locationPath !== "/create-gang" && loadedGangInfo.basicInfo?.id && loadedGangInfo.role?.role_id === 1 ? (
        <div className="gang-mgmt-master">
          <div className="channels-mgmt-container">
            <div className="channels-mgmt-title">manage member requirements</div>
            <div className="gradient-bar"></div>
            {requirementTiles}
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Show channel mgmt only if not creating gang and gang info is loaded */}
      {locationPath !== "/create-gang" && loadedGangInfo.basicInfo?.id && loadedGangInfo.role?.role_id === 1 ? (
        <div className="gang-mgmt-master">
          <div className="channels-mgmt-container">
            <div className="channels-mgmt-title">manage channels</div>
            <div className="gradient-bar"></div>
            {channelTiles}
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Show member mgmt only if not creating gang and gang info is loaded */}
      {locationPath !== "/create-gang" && loadedGangInfo.basicInfo?.id && loadedGangInfo.role?.role_id === 1 ? (
        <div className="gang-mgmt-master">
          <div className="member-mgmt-container">
            <div className="member-mgmt-title">manage members</div>
            <div className="gradient-bar"></div>
            {memberTiles}
          </div>
        </div>
      ) : (
        <></>
      )}
      {/* EDIT PHOTO MODAL */}
      <div className={`edit-profile-form ${conditionalUploadFormClass}`}>
        <p>{"upload avatar"}</p>
        {
          <div className="avatar-upload-form">
            <input
              className="avatar-input"
              type="file"
              ref={hiddenFileInput}
              style={{ display: "none" }}
              onChange={handleFileUpload}
            ></input>
            <button onClick={chooseFileHandler} className="upload-form-btns">
              choose photo
            </button>
            <div className="photo-label">{photoFile ? photoFile.name : ""}</div>
          </div>
        }
        <div className="upload-form-btns">
          <button onClick={photoSubmitHandler}>save</button>
          <button onClick={closeAvatar}>close</button>
        </div>
      </div>
      {/* Add Requirements MODAL */}
      <div className={`add-channel-form ${conditionalAddRequirementClass}`}>
        <p>{"add requirement"}</p>
        {
          <div className="avatar-upload-form">
            <input
              onChange={(event) => {
                setrequirementDescriptionText(event.target.value);
              }}
              value={requirementDescriptionText}
              type="text"
              className="channel-name-input"
              placeholder={"requirement description..."}
            ></input>
            <div className="modal-subheading">requirement priority level</div>
            <SelectButton
              value={requirementPriorityValue}
              onChange={(e) => switchRequirementPriorityForm(e)}
              options={requirementPriorityOptions}
              className="channel-selector-input"
            />
            <div className="upload-form-btns">
              <button onClick={tryCreateRequirement}>create requirement</button>
            </div>
          </div>
        }
        <div className="upload-form-btns">
          <button onClick={closeAvatar}>close</button>
        </div>
      </div>
      {/* Add Members MODAL */}
      <div className={`member-search-form ${conditionalAddMembersClass}`}>
        <p>{"add gang members"}</p>
        {
          <div className="avatar-upload-form">
            <input
              onChange={(event) => {
                setusernameSearchText(event.target.value);
              }}
              value={usernameSearchText}
              type="text"
              className="search-member-input"
              placeholder={"username must be exact..."}
            ></input>
            <button onClick={trySendInvite} className="upload-form-btns">
              send request
            </button>
          </div>
        }
        <div className="upload-form-btns">
          <button onClick={closeAvatar}>close</button>
        </div>
      </div>
      {/* Add Channels MODAL */}
      <div className={`add-channel-form ${conditionalAddChannelClass}`}>
        <p>{"add channel"}</p>
        {
          <div className="avatar-upload-form">
            <input
              onChange={(event) => {
                setchannelNameText(event.target.value);
              }}
              value={channelNameText}
              type="text"
              className="channel-name-input"
              placeholder={"channel name..."}
            ></input>
            <SelectButton
              value={channelIsVoiceValue}
              onChange={(e) => toggleIsVoiceForm(e)}
              options={voiceFormOptions}
              className="channel-selector-input"
            />
            <div className="upload-form-btns">
              <button onClick={tryCreateChannel}>create channel</button>
            </div>
          </div>
        }
        <div className="upload-form-btns">
          <button onClick={closeAvatar}>close</button>
        </div>
      </div>
      <Tooltip id="gang-name-tooltip" place="right">
        must be 3 or more characters
      </Tooltip>
      <Tooltip id="must-select-tooltip" place="right">
        must make a selection
      </Tooltip>
    </div>
  );
}
