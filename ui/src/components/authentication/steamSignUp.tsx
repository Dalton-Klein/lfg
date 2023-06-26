import React, { useState, useEffect } from "react";
import "./steamSignUp.scss";
import { SignUpForm, VerificationForm } from "../../utils/interfaces";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createUser, getSteamData } from "../../utils/rest";
import { loginErrorAnim, loginPanelSignUpAnim, loginPanelVerifyAnim } from "../../utils/animations";
import { validateCredentials, validatevKey } from "../../utils/helperFunctions";
import { createUserInState, updateUserThunk } from "../../store/userSlice";
import { useDispatch } from "react-redux";

const SteamSignUpPage = () => {
  const locationPath: string = useLocation().pathname;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const initialSignUpForm: SignUpForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    ageChecked: false,
  };
  const initialVerificationForm: VerificationForm = {
    vKey: "",
    email: "",
  };
  const [steamData, setsteamData] = useState<any>({});
  const [namePlaceholder, setnamePlaceholder] = useState<string>("display name");
  const [createAccountForm, setCreateAccountFormState] = useState(initialSignUpForm);
  const [vKeyForm, setvKeyFormState] = useState(initialVerificationForm);
  const [ageChecked, setageChecked] = useState<boolean>(false);
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("something went wrong...");
  let isPerformingAnim = false;

  useEffect(() => {
    grabSteamData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPath]);

  const grabSteamData = async () => {
    const rez = await getSteamData(locationPath.substring(14, 200));
    setsteamData(rez);
    let formCopy = { ...createAccountForm };
    formCopy.name = rez.name;
    setCreateAccountFormState(formCopy);
    setnamePlaceholder(rez.name);
  };

  const handleNameChange = (event: any) => {
    setnamePlaceholder(event.target.value);
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
    const validationResult = validateCredentials(createAccountForm, ageChecked, false);
    if (validationResult.success) {
      // Continue with email verification for email sign up
      const signupResult = await createUser(createAccountForm);
      if (signupResult.data) {
        clearError();
        loginPanelVerifyAnim();
      } else {
        createError(`${signupResult.error}`);
      }
    } else {
      createError(`${validationResult.error}`);
    }
  };

  //Verification
  const submitVerificationKey = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationResult = validatevKey(vKeyForm);
    if (validationResult.success) {
      clearError();
      const accountCreationResult: any = await dispatch(
        createUserInState(
          createAccountForm.email,
          vKeyForm.vKey,
          createAccountForm.name,
          createAccountForm.password,
          steamData.steam_id
        )
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

  //Error handling and anims
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
  const performingAnim = async (legthOfAnim: number) => {
    isPerformingAnim = true;
    setTimeout(function () {
      isPerformingAnim = false;
    }, legthOfAnim);
  };

  return (
    <div className="login-container">
      <div className="login-banner">
        <img
          className="large-logo"
          src="https://res.cloudinary.com/kultured-dev/image/upload/v1663653269/logo-v2-gangs.gg-transparent-white_mqcq3z.png"
          alt="gangs-logo-large"
          onClick={() => navigate(`/`)}
        />
      </div>
      <div className="panel-container">
        {/* START Steam Sign Up Form */}
        <div className="steam-form-container steam-sign-up-container">
          <form onSubmit={createNewUser} onChange={signUpFormStateChange}>
            <h2>create account through steam</h2>
            <div className="login-inputs">
              {/* Input Boxes */}
              <input
                name="username"
                type="text"
                placeholder="display name"
                value={namePlaceholder}
                onChange={handleNameChange}
              />
              {/* Bottom three fields dependent on if signing up w/ google */}
              <input name="email" type="email" placeholder="email" />
              <input name="password" type="password" placeholder="password" />
              <input name="confirmPassword" type="password" placeholder="confirm password" />
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
            <button type="submit" className="steam-submit-button">
              {" "}
              <img
                src="https://res.cloudinary.com/kultured-dev/image/upload/v1686792786/Steam-Logo_bcn4qj.png"
                alt="steam-logo-signin"
                className="steam-logo"
              ></img>{" "}
              create account
            </button>
            <button type="button" onClick={() => navigate(`/login`)} className="alt-button">
              back
            </button>
          </form>
        </div>
        {/* END Steam Sign Up Form */}
        {/* Confirm Verification Key Form */}
        <div className="steam-form-container steam-verify-container">
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
      </div>
    </div>
  );
};

export default SteamSignUpPage;
