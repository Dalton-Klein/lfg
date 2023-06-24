import React, { useState, useEffect } from "react";
import "./steamSignUp.scss";
import { SignUpForm, VerificationForm } from "../../utils/interfaces";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getSteamData } from "../../utils/rest";

const SteamSignUpPage = () => {
  const locationPath: string = useLocation().pathname;
  const navigate = useNavigate();
  const initialSignUpForm: SignUpForm = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    ageChecked: false,
  };
  const [steamData, setsteamData] = useState<any>({});
  const [namePlaceholder, setnamePlaceholder] = useState<string>("display name");
  const [createAccountForm, setCreateAccountFormState] = useState(initialSignUpForm);
  const [ageChecked, setageChecked] = useState<boolean>(false);
  const [formError, setFormError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("something went wrong...");

  useEffect(() => {
    console.log("id? ", locationPath.substring(14, 200));
    grabSteamData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPath]);

  const grabSteamData = async () => {
    const rez = await getSteamData(locationPath.substring(14, 200));
    console.log("ers? ", rez[0][0]);
    setsteamData(rez[0][0]);
    let formCopy = { ...createAccountForm };
    formCopy.name = rez[0][0].name;
    setCreateAccountFormState(formCopy);
    setnamePlaceholder(rez[0][0].name);
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
    // const validationResult = validateCredentials(createAccountForm, ageChecked, isGoogleSignUp);
    // if (validationResult.success) {
    //   if (isGoogleSignUp) {
    //     // Skip straight to account creation for google sign up (no email verification needed)
    //     const accountCreationResult: any = await dispatch(
    //       createUserInState(googleSuccessResponse.profileObj.email, "google", createAccountForm.name, "google")
    //     );
    //     if (accountCreationResult.data) {
    //       dispatch(updateUserThunk(accountCreationResult.data.id));
    //       navigate("/");
    //     } else {
    //       createError(`${accountCreationResult.error}`);
    //     }
    //   } else if (isSteamSignUp) {
    //     //Steam logic will go here
    //   } else {
    //     // Continue with email verification for email sign up
    //     const signupResult = await createUser(createAccountForm);
    //     if (signupResult.data) {
    //       clearError();
    //       loginPanelVerifyAnim();
    //     } else {
    //       createError(`${signupResult.error}`);
    //     }
    //   }
    // } else {
    //   createError(`${validationResult.error}`);
    // }
  };
  const clearError = () => {
    setFormError(false);
    setErrorMessage("");
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
      <div className="steam-form-container">
        <form onSubmit={createNewUser} onChange={signUpFormStateChange}>
          <h2>create account through steam</h2>
          <div className="login-inputs">
            {/* Input Boxes */}
            <input name="username" type="text" placeholder="display name" value={namePlaceholder} />
            {/* Bottom three fields dependent on if signing up w/ google */}
            <input name="email" type="email" placeholder="email" />
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
    </div>
  );
};

export default SteamSignUpPage;
