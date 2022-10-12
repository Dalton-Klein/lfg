import FooterComponent from "../nav/footerComponent";
import HeaderComponent from "../nav/headerComponent";
import "./faqPage.scss";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BannerTitle from "../nav/banner-title";
import { useDispatch, useSelector } from "react-redux";
import { setPreferences } from "../../store/userPreferencesSlice";
import { RootState } from "../../store/store";

export default function FAQPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const preferencesState = useSelector((state: RootState) => state.preferences);
  // START Auto Scroll Logic
  const welcomeRef: any = useRef(null);
  const createAccountRef: any = useRef(null);
  const manageProfileRef: any = useRef(null);
  const discoveringRef: any = useRef(null);
  const sendingRef: any = useRef(null);
  const acceptingRef: any = useRef(null);
  const messagingRef: any = useRef(null);
  const faqRef: any = useRef(null);
  const scrollToSection = (ref: any) => {
    ref.current?.scrollIntoView();
  };
  // END Auto Scroll Logic

  const changeSelection = (value: number) => {
    const menuLinkKey: any = {
      1: "profile",
      2: "profile",
      3: "profile",
      4: "profile",
      5: "profile",
      6: "profile",
      7: "profile",
      8: "discover",
      9: "login",
    };
    if (value < 8) {
      dispatch(
        setPreferences({
          ...preferencesState,
          lastProfileMenu: value,
        })
      );
    }
    navigate(`/${menuLinkKey[value]}`);
  };

  return (
    <div>
      <HeaderComponent></HeaderComponent>
      <div className="faq-master-container">
        <BannerTitle title={"help | faq"}></BannerTitle>
        {/* Contents */}
        <div className="faq-content-container">
          <div className="faq-sub-title">Index</div>
          <div className="index-container">
            <div className="faq-list">
              <div
                onClick={() => {
                  scrollToSection(welcomeRef);
                }}
              >
                Welcome
              </div>
              <div
                onClick={() => {
                  scrollToSection(createAccountRef);
                }}
              >
                Creating Account
              </div>
              <div
                onClick={() => {
                  scrollToSection(manageProfileRef);
                }}
              >
                Managing Profiles
              </div>
              <div
                onClick={() => {
                  scrollToSection(discoveringRef);
                }}
              >
                Discovering Players
              </div>
            </div>
            <div className="faq-list">
              <div
                onClick={() => {
                  scrollToSection(sendingRef);
                }}
              >
                Sending Requests
              </div>
              <div
                onClick={() => {
                  scrollToSection(acceptingRef);
                }}
              >
                Accepting Requests
              </div>
              <div
                onClick={() => {
                  scrollToSection(messagingRef);
                }}
              >
                Messaging
              </div>
              <div
                onClick={() => {
                  scrollToSection(faqRef);
                }}
              >
                FAQ
              </div>
            </div>
          </div>
        </div>
        {/* Welcome */}
        <div className="faq-content-container" ref={welcomeRef}>
          <div className="faq-sub-title">Welcome</div>
          <div className="faq-paragraph">
            Welcome to gangs, the most efficient place to find your gamer gang. In modern multiplayer games, it is
            imperative to form a high functioning squad to play with. gangs.gg was created to eliminate the effort and
            luck required to find compatible teammates. the mission is to get you signed up, quickly collect the
            important details, and get your future teammates in front of you quickly.
          </div>
          <div className="faq-paragraph">
            This page will go over how to use the major features, and how to navigate around the application. You can
            jump to any particular section by clicking on an item in the index.
          </div>
        </div>
        {/* Creating Account */}
        <div className="faq-content-container" ref={createAccountRef}>
          <div className="faq-sub-title">Creating Account</div>
          <div className="faq-paragraph">
            Creating an account is stress free. The easiest way to get signed up is through the google sign up. Navigate
            to the{" "}
            <text
              onClick={() => {
                changeSelection(9);
              }}
              className="link-text"
            >
              {" "}
              login
            </text>{" "}
            page or while not logged in, the upper right hand corner of the app will have a button to take you to the
            authentication page.
          </div>
          <div className="faq-sub-heading">Google Sign Up</div>
          <div className="faq-paragraph">
            When on the sign in or sign up{" "}
            <text
              onClick={() => {
                changeSelection(9);
              }}
              className="link-text"
            >
              {" "}
              menus
            </text>
            , press the google button to start the sign in or sign up process. The system will automatically detect if
            you have an account or not, and either sign you up or in accordingly. If you are making an account through
            the google sign up, you will have to fill out your desired display name, and agree to the account
            stipulations.
          </div>
          <div className="faq-sub-heading">Email Sign Up</div>
          <div className="faq-paragraph">
            If you do not want to sign up with a google account, you can sign up with any email account. After
            navigating to the login page, press create account and fill out the sign up form. You will need to use an
            email you have access to as verifcation is required. You will also need to agree to the account
            stipulations.{" "}
          </div>
          <div className="faq-paragraph">
            {" "}
            After pressing create account, an email will automatically be sent to you. Open the email, copy the code in
            the email, and paste it in the confirmation screen. Entering the correct code will finalize your account
            creation and take you to the home page!
          </div>
        </div>
        {/* Managing Profile */}
        <div className="faq-content-container" ref={manageProfileRef}>
          <div className="faq-sub-title">Managing Profiles</div>
          <div className="faq-paragraph">
            In orderto use the main features of gangs, you must complete your general profile and at least one game
            specific profile. To check if your profiles are complete, widgets at the top of your profile page will
            indicate if the fields are completely filled out or not.
          </div>
          <div className="faq-sub-heading">General Profile</div>
          <div className="faq-paragraph">
            To complete your general profile, navigate to your{" "}
            <text
              onClick={() => {
                changeSelection(1);
              }}
              className="link-text"
            >
              {" "}
              profile
            </text>{" "}
            by clicking your name or profile avavtar in the top right corner of the application. Once there, fill out
            every listed field as every field aside from the profile picture are required. Any additional details you
            want to include about yourself can be written in the about section. To save your edits, click the save
            button at the bottom of the page. If the save is successful, a toast message will pop up indicating a
            successful save.
          </div>
          <div className="faq-paragraph">
            To change your profile picture, click on the placeholder image on your general profile page to bring up the
            upload form. Select a picture from your device and press upload. Viola!
          </div>
          <div className="faq-sub-heading">Game Specific Profiles</div>
          <div className="faq-paragraph">
            Completing your game specific profile is also necessary to be discoverable and connect with other players.
            Similar to the general profile, you must fill out all fields to complete your profile for the game. To save
            your edits, click the save button at the bottom of the page. If the save is successful, a toast message will
            pop up indicating a successful save.
          </div>
          <div className="faq-sub-heading">Publishing/ Unpublishing Profiles</div>
          <div className="faq-paragraph">
            You have control on whether your game specific profile is disvoverable to others. Each game specific profile
            has a toggle switch to control if others can view your profile in the discover page. To publish your
            profile, both your general and game specific profiles must be completed. Upon switching your published
            status, a toast message will appear at the top of your screen confirming the change.
          </div>
        </div>
        {/* Discover */}
        <div className="faq-content-container" ref={discoveringRef}>
          <div className="faq-sub-title">Discovering Players</div>
          <div className="faq-sub-heading">Player Cards</div>
          <div className="faq-paragraph">
            The{" "}
            <text
              onClick={() => {
                changeSelection(8);
              }}
              className="link-text"
            >
              {" "}
              discover page
            </text>{" "}
            is populated with player cards. These cards display all the important details of that player's profile. On
            each player card, a view button can be pressed to bring up the detailed view of that player's profile.
          </div>{" "}
          <div className="faq-sub-heading">Filtering & Sorting</div>
          <div className="faq-paragraph">
            Above the player cards is a box title 'press to filter'. Press this box to view all of the available sorting
            and filtering dropdowns. You can mix and match filter selections to view the exact type of player you would
            enjoy playing with. If too few results are showing up, reduce or try a different filter. To clear the
            filters, press the 'clear all' button.
          </div>
        </div>
        {/* Sending Requests */}
        <div className="faq-content-container" ref={sendingRef}>
          <div className="faq-sub-title">Sending Requests</div>
          <div className="faq-paragraph">
            You connect with others from the{" "}
            <text
              onClick={() => {
                changeSelection(8);
              }}
              className="link-text"
            >
              {" "}
              discover page
            </text>{" "}
            . On each player card, a view button can be pressed to bring up the detailed view of that player's profile.
            At the bottom of this expanded view, fill out the message box and press connect. The message you type will
            appear for that user alongside your request. After pressing connect, your request will have been sent, and
            that player will be removed from your discover feed until they take action on your request.{" "}
          </div>
        </div>
        {/* Accepting Requests */}
        <div className="faq-content-container" ref={acceptingRef}>
          <div className="faq-sub-title">Accepting Requests</div>
          <div className="faq-paragraph">
            You connect with others from the{" "}
            <text
              onClick={() => {
                changeSelection(3);
              }}
              className="link-text"
            >
              {" "}
              incoming requests
            </text>{" "}
            page. Each incoming request will be listed here alongside a personal message from the sender. To accept the
            request simply press the accept button. After accepting, you can find a new conversation in the{" "}
            <text
              onClick={() => {
                changeSelection(2);
              }}
              className="link-text"
            >
              {" "}
              messaging
            </text>{" "}
            page. Be the first to send them a message!
          </div>
        </div>
        {/* Messaging */}
        <div className="faq-content-container" ref={messagingRef}>
          <div className="faq-sub-title">Messaging</div>
          <div className="faq-paragraph">
            {" "}
            To start messaging, first navigate to the{" "}
            <text
              onClick={() => {
                changeSelection(2);
              }}
              className="link-text"
            >
              {" "}
              messaging
            </text>{" "}
            page. You can immediately start in a public channel, or chat with an existing connection. You cannot private
            message until you are connected to the user.
          </div>
          <div className="faq-sub-heading">Conversation List</div>
          <div className="faq-paragraph">
            On the left hand side, there is a vertical menu that represents your conversations. The image with a red
            ring indicates the conversation that is currently loaded. To move between conversations, simply click the
            avatar logo for your desired location.
          </div>
          <div className="faq-sub-heading">Messages View</div>
          <div className="faq-paragraph">
            On the right hand side is a view of the currently loaded conversation. It will have a title bar with
            individual messages below. At the bottom is an input box where you can type new messages, and press then
            send button to commit your message.
          </div>
          <div className="faq-sub-heading">Conversation Types</div>
          <div className="faq-paragraph">
            There are public and private messaging rooms. The public rooms are listed at the top of your conversations
            list. The private conversations are listed below the horizontal seperator.{" "}
          </div>
        </div>
        {/* FAQ */}
        <div className="faq-content-container" ref={faqRef}>
          <div className="faq-sub-title">FAQ</div>
          <div className="faq-paragraph">Coming Soon!</div>
        </div>
      </div>
      <FooterComponent></FooterComponent>
    </div>
  );
}
