import React, { useState, useEffect, useRef } from "react";
import "./authenticationPage.scss";
import { SignUpForm, SignInForm, VerificationForm, PasswordResetForm } from "../../utils/interfaces";
import { createUser, googleSignIn, requestPasswordReset } from "../../utils/rest";
import {
  validateCredentials,
  validateEmail,
  validatePasswordResetForm,
  validatevKey,
} from "../../utils/helperFunctions";
import {
  loginPanelSignUpAnim,
  loginPanelSignInAnim,
  loginPanelVerifyAnim,
  loginErrorAnim,
  setUpAnim,
  loginPanelForgotPasswordAnim,
  loginPanelPasswordResetAnim,
  avatarFormOut,
  avatarFormIn,
} from "../../utils/animations";
import { signInUserThunk, createUserInState, resetPasswordInState, updateUserThunk } from "../../store/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
// ***ELECTRON Next 3 LINES modify
// import { IpcRenderer } from "electron";
// const ipcRenderer: IpcRenderer = window.require("electron").ipcRenderer;
const isElectron = false;

const LoginPage = () => {
  const navigate = useNavigate();
  const scrollToSection = (ref: any) => {
    ref.current?.scrollIntoView();
  };
  const topOfPageRef: any = useRef(null);
  const initialSignUpForm: SignUpForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    ageChecked: false,
  };
  const initialSignInForm: SignInForm = {
    email: "",
    password: "",
  };
  const initialVerificationForm: VerificationForm = {
    vKey: "",
    email: "",
  };
  const initialForgotPasswordForm: { email: string } = {
    email: "",
  };
  const initialPasswordResetForm: PasswordResetForm = {
    vKey: "",
    password: "",
    confirmPassword: "",
  };
  const dispatch = useDispatch();
  const [createAccountForm, setCreateAccountFormState] = useState(initialSignUpForm);
  const [signInForm, setSignInFormState] = useState(initialSignInForm);
  const [vKeyForm, setvKeyFormState] = useState(initialVerificationForm);
  const [forgotPasswordForm, setForgotPasswordFormState] = useState(initialForgotPasswordForm);
  const [passwordResetForm, setPasswordResetFormState] = useState(initialPasswordResetForm);
  const [formError, setFormError] = useState(false);
  const [isSteamPopup, setisSteamPopup] = useState<boolean>(false);
  const [isGoogleSignUp, setisGoogleSignUp] = useState<boolean>(false);
  const [googleSuccessResponse, setgoogleSuccessResponse] = useState<any>({});
  const [ageChecked, setageChecked] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState("something went wrong...");
  let isPerformingAnim = false;

  useEffect(() => {
    setUpAnim();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const performingAnim = async (legthOfAnim: number) => {
    isPerformingAnim = true;
    setTimeout(function () {
      isPerformingAnim = false;
    }, legthOfAnim);
  };

  const signUpFormStateChange = (event: React.FormEvent<HTMLFormElement>) => {
    clearError();
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    let formCopy = { ...createAccountForm };
    switch (name) {
      case "username":
        formCopy.name = value;
        break;
      case "email":
        formCopy.email = value;
        break;
      case "password":
        formCopy.password = value;
        break;
      case "confirmPassword":
        formCopy.confirmPassword = value;
        break;
    }
    setCreateAccountFormState(formCopy);
  };

  const createNewUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validateCredentials(createAccountForm, ageChecked, isGoogleSignUp);
    if (validationResult.success) {
      if (isGoogleSignUp) {
        // Skip straight to account creation for google sign up (no email verification needed)
        const accountCreationResult: any = await dispatch(
          createUserInState(googleSuccessResponse.profileObj.email, "google", createAccountForm.name, "google")
        );
        if (accountCreationResult.data) {
          dispatch(updateUserThunk(accountCreationResult.data.id));
          navigate("/");
        } else {
          createError(`${accountCreationResult.error}`);
        }
      } else {
        // Continue with email verification for email sign up
        const signupResult = await createUser(createAccountForm);
        if (signupResult.data) {
          clearError();
          loginPanelVerifyAnim();
        } else {
          createError(`${signupResult.error}`);
        }
      }
    } else {
      createError(`${validationResult.error}`);
    }
  };

  const signInFormStateChange = (event: React.FormEvent<HTMLFormElement>) => {
    clearError();
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    let signInFormCopy = { ...signInForm };
    switch (name) {
      case "email":
        signInFormCopy.email = value;
        break;
      case "password":
        signInFormCopy.password = value;
        break;
      default:
        return;
    }
    setSignInFormState(signInFormCopy);
  };

  //START Google Logic
  const onGoogleFailure = (res: any) => {
    console.log("google failed to login");
  };

  const onGoogleSuccess = async (res: any) => {
    //Check if account with google email exists
    const googleCheckResult = await googleSignIn(res.profileObj.email);
    //Either sign in or sign up user based on result above
    if (googleCheckResult.token) {
      // Account found, proceed with signin
      const result: any = await dispatch(signInUserThunk({ email: res.profileObj.email, password: "" }, true));
      if ("error" in result) {
        createError(result.error);
      } else {
        clearError();
        navigate("/");
      }
    } else if (googleCheckResult.error) {
      // No account found, create one for this google account
      // Take user to signup and modify account form for google
      setgoogleSuccessResponse(res);
      changeMenu(4);
    }
  };
  //END Google Logic

  const signInUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result: any = await dispatch(signInUserThunk(signInForm, false));
    if (!result || "error" in result) {
      createError(!result ? "failed to sign in" : result.error);
    } else {
      clearError();
      navigate("/");
    }
  };

  const vKeyFormStateChange = (event: React.FormEvent<HTMLFormElement>) => {
    clearError();
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    let formCopy = { ...initialVerificationForm };
    if (name === "vKey") {
      formCopy.vKey = value;
      setvKeyFormState(formCopy);
    }
  };

  const submitVerificationKey = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validatevKey(vKeyForm);
    if (validationResult.success) {
      clearError();
      const accountCreationResult: any = await dispatch(
        createUserInState(createAccountForm.email, vKeyForm.vKey, createAccountForm.name, createAccountForm.password)
      );
      if (accountCreationResult.data) {
        dispatch(updateUserThunk(accountCreationResult.data.id));
        navigate("/");
      } else {
        createError(`${accountCreationResult.error}`);
      }
    } else {
      createError(`${validationResult.error}`);
    }
  };
  const forgotPasswordFormStateChange = (event: React.FormEvent<HTMLFormElement>) => {
    clearError();
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    let formCopy = { ...initialForgotPasswordForm };
    if (name === "email") {
      formCopy.email = value;
      setForgotPasswordFormState(formCopy);
    }
  };

  const submitForgotPassword = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validateEmail(forgotPasswordForm.email);
    if (validationResult.success) {
      const forgotPasswordResult = await requestPasswordReset(forgotPasswordForm.email);
      if (forgotPasswordResult.data) {
        clearError();
        loginPanelPasswordResetAnim();
      } else {
        createError(`${forgotPasswordResult.error}`);
      }
    } else {
      createError(`${validationResult.error}`);
    }
  };

  const passwordResetFormStateChange = (event: React.FormEvent<HTMLFormElement>) => {
    clearError();
    const target = event.target as HTMLInputElement;
    const name = target.name;
    const value = target.value;
    let formCopy = { ...passwordResetForm };
    switch (name) {
      case "vKey":
        formCopy.vKey = value;
        break;
      case "password":
        formCopy.password = value;
        break;
      case "confirmPassword":
        formCopy.confirmPassword = value;
        break;
    }
    setPasswordResetFormState(formCopy);
  };

  const submitPasswordReset = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validatePasswordResetForm(passwordResetForm);
    if (validationResult.success) {
      clearError();
      const accountCreationResult: any = await dispatch(
        resetPasswordInState(forgotPasswordForm.email, passwordResetForm.vKey, passwordResetForm.password)
      );
      if (accountCreationResult.data) {
        navigate("/");
      } else {
        createError(`${accountCreationResult.error}`);
      }
    } else {
      createError(`${validationResult.error}`);
    }
  };

  const createError = (errorMessage: string) => {
    setErrorMessage(errorMessage);
    setFormError(true);
    if (!isPerformingAnim) {
      loginErrorAnim();
      performingAnim(1000);
    }
  };

  const clearError = () => {
    setFormError(false);
    setErrorMessage("");
  };

  const changeMenu = (number: number) => {
    const menus: any = {
      1: () => {
        loginPanelSignInAnim();
      },
      2: () => {
        setisGoogleSignUp(false);
        loginPanelSignUpAnim();
      },
      3: () => {
        loginPanelForgotPasswordAnim();
      },
      4: () => {
        setisGoogleSignUp(true);
        loginPanelSignUpAnim();
      },
    };
    clearError();
    menus[number]();
    return;
  };

  const trySteamLogin = async () => {
    // Hit api and get redirected to steam
    // ***PROD CHANGE
    window.location.href = "https://www.gangs.gg/steam"; //"http://localhost:3010/steam";
  };

  const openGangsInBrowser = async () => {
    const url = "https://www.gangs.gg/#/login";
    // ***ELECTRON DISABLE
    // ipcRenderer.send("openWebPage", url);
  };

  const openSteamPopup = async () => {
    setisSteamPopup(true);
    avatarFormIn();
    scrollToSection(topOfPageRef);
    return;
  };
  const closeSteamPopup = () => {
    avatarFormOut();
    setisSteamPopup(false);
    return;
  };

  const conditionalSteamModalClass = isSteamPopup ? "conditionalZ2" : "conditionalZ1";
  return (
    <div className="login-container" ref={topOfPageRef}>
      {/* Steam Electron Sign Up MODAL */}
      <div className={`edit-profile-form ${conditionalSteamModalClass}`}>
        <p>
          Steam sign up must be done in a web browser. Please visit the gangs website, and create your account through
          steam.{" "}
        </p>
        <p>Once your account is created, you can return to the gangs desktop app and login!</p>
        <div className="upload-form-btns">
          <button onClick={openGangsInBrowser} className="visit-website-btn">
            open gangs in web browser
          </button>
          <button onClick={closeSteamPopup}>close</button>
        </div>
      </div>
      {/* Title */}
      <div className="login-banner">
        <img
          className="large-logo"
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1663653269/logo-v2-gangs.gg-transparent-white_mqcq3z.png"
          alt="gangs-logo-large"
          onClick={() => navigate(`/`)}
        />
      </div>
      <div className="panel-container">
        {/* Confirm Verification Key Form */}
        <div className="form-container verification-container">
          <form onSubmit={submitVerificationKey} onChange={vKeyFormStateChange}>
            <h2>verify account</h2>
            <h5 className="vKey-message">{"*check your email for a verification code*"}</h5>
            <div className="login-inputs">
              {/* Input Box */}
              <input name="vKey" type="vKey" placeholder="verification code" />
              {formError ? <div className="error-mssg">{errorMessage}</div> : <div className="error-mssg"> </div>}
            </div>
            <button type="submit">verify</button>
            <h4>or</h4>
            <button type="button" onClick={loginPanelSignUpAnim} className="alt-button">
              back
            </button>
          </form>
        </div>
        {/* End Confirm Verification Key Form */}

        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={createNewUser} onChange={signUpFormStateChange}>
            <h2>create account</h2>
            <div className="login-inputs">
              {/* Input Boxes */}
              <button
                type="button"
                className="alt-button steam-button"
                onClick={() => {
                  if (isElectron) {
                    openSteamPopup();
                  } else {
                    trySteamLogin();
                  }
                }}
              >
                <img
                  src="https://res.cloudinary.com/kultured-dev/image/upload/v1686792786/Steam-Logo_bcn4qj.png"
                  alt="steam-logo-signin"
                  className="steam-logo"
                ></img>{" "}
                steam signup
              </button>
              <div className="google-signup-container" style={{ display: !isGoogleSignUp ? "inline-block" : "none" }}>
                <div className="seperator-text">or</div>
              </div>
              <input name="username" type="text" placeholder="display name" />
              {/* Bottom three fields dependent on if signing up w/ google */}
              <input
                name="email"
                type="email"
                placeholder="email"
                style={{ display: !isGoogleSignUp ? "inline-block" : "none" }}
              />
              <input
                name="password"
                type="password"
                placeholder="password"
                style={{ display: !isGoogleSignUp ? "inline-block" : "none" }}
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="confirm password"
                style={{ display: !isGoogleSignUp ? "inline-block" : "none" }}
              />
              <div className="checkbox-field">
                <input
                  name="ageChecked"
                  type="checkbox"
                  className="age-checkbox"
                  onChange={(e) => {
                    setageChecked(e.target.checked);
                  }}
                />
                <div className="checkbox-label">
                  i am at least 13 years of age, and have read and agreed to the{" "}
                  <Link to="/terms-of-service" className="link-text">
                    {" "}
                    terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="link-text">
                    {" "}
                    privacy policy
                  </Link>
                </div>
              </div>
              {formError ? <div className="error-mssg">{errorMessage}</div> : <div className="error-mssg"> </div>}
            </div>
            <button type="submit">create account</button>
            <button type="button" onClick={() => changeMenu(1)} className="alt-button">
              sign in
            </button>
          </form>
        </div>
        {/* End Sign Up Form */}

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={signInUser} onChange={signInFormStateChange}>
            <h2>sign in</h2>
            {/* Input Boxes */}
            <div className="login-inputs">
              <div className="email-signin-box">
                <input name="email" type="text" placeholder="username, email, or steam id" />
                <input name="password" type="password" placeholder="password" />
                {formError ? <div className="error-mssg">{errorMessage}</div> : <div className="error-mssg"> </div>}
                <button type="submit">login</button>
              </div>
              <div className="seperator-text">no account?</div>
            </div>
            <button type="button" onClick={() => changeMenu(2)} className="alt-button">
              create account
            </button>
            <button type="button" onClick={() => changeMenu(3)} className="text-only-button">
              forgot password
            </button>
          </form>
        </div>
        {/* End Sign In Form */}

        {/* Forgot Password Form */}
        <div className="form-container forgot-password-container">
          <form onSubmit={submitForgotPassword} onChange={forgotPasswordFormStateChange}>
            <h2>forgot password</h2>
            {/* Input Boxes */}
            <div className="login-inputs">
              <input name="email" type="email" placeholder="email" />
              {formError ? <div className="error-mssg">{errorMessage}</div> : <div className="error-mssg"> </div>}
            </div>
            <button type="submit">submit</button>
            <button type="button" onClick={() => changeMenu(1)} className="alt-button">
              back
            </button>
          </form>
        </div>
        {/* End Forgot Password Form */}

        {/* Password Reset Form */}
        <div className="form-container password-reset-container">
          <form onSubmit={submitPasswordReset} onChange={passwordResetFormStateChange}>
            <h2>reset password</h2>
            {/* Input Boxes */}
            <h5 className="vKey-message">{"*check your email for a verification code*"}</h5>
            <div className="login-inputs">
              <input name="vKey" type="vKey" placeholder="verification code" />
              <input name="password" type="password" placeholder="new password" />
              <input name="confirmPassword" type="password" placeholder="confirm new password" />
              {formError ? <div className="error-mssg">{errorMessage}</div> : <div className="error-mssg"> </div>}
            </div>
            <button type="submit">change password</button>
            <button type="button" onClick={() => changeMenu(3)} className="alt-button">
              back
            </button>
          </form>
        </div>
        {/* End Password Reset Form */}
      </div>
    </div>
  );
};

export default LoginPage;
