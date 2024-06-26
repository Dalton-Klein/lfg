import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "./store";
import { User, SignIn } from "./interfaces";
import { resetPassword, signInUser, verifyUser, fetchUserData } from "../utils/rest";
// ***NEW GAME EDIT
const initialState: any = {
  user: {
    token: "",
    id: 0,
    email: "",
    steam_id: "",
    avatar_url: "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png",
    is_email_notifications: false,
    is_email_nmarketing: false,
    username: "none",
    num_of_strikes: 0,
    about: "",
    age: 0,
    gender: 0,
    region: "",
    languages: [],
    preferred_platform: 0,
    discord: "",
    psn: "",
    xbox: "",
    last_seen: undefined,
    user_id: 0,
    rust_hours: 0,
    rust_weekdays: "",
    rust_weekends: "",
    rust_is_published: false,
    rocket_league_is_published: false,
    battle_bit_is_published: false,
    connection_count_sender: 0,
    connection_count_acceptor: 0,
    gangs: [],
    connections: [],
    input_device_id: "",
    output_device_id: "",
    rank: 0,
    created_at: undefined,
    updated_at: undefined,
    error: false,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, { payload }: PayloadAction<User>) {
      state.user = payload;
    },
    updateUserAvatarUrl(state, { payload }: PayloadAction<string | undefined>) {
      state.user.avatar_url = payload;
    },
    updateUserName(state, { payload }: PayloadAction<string | undefined>) {
      state.user.username = payload;
    },
    setUserError(state, action: PayloadAction<string>) {
      return state;
    },
  },
});

export const { setUser, setUserError, updateUserAvatarUrl, updateUserName } = userSlice.actions;
export default userSlice.reducer;

// THUNK / EPIC

// THUNK: Creating User
export const createUserInState =
  (email: string, vKey: string, name: string, password: string, steam_id: string = ""): AppThunk =>
  async (dispatch) => {
    try {
      let response: any;
      response = await verifyUser(email, vKey, name, password, steam_id);
      if (!response.error) {
        dispatch(setUser(response.data));
      }
      return response;
    } catch (err: any) {
      dispatch(setUserError(err.toString()));
    }
  };

// THUNK2: Sign In User
export const signInUserThunk =
  (signin: SignIn, isGoogleSignIn = false): AppThunk =>
  async (dispatch) => {
    try {
      let response: any;
      response = await signInUser(
        {
          email: signin.email,
          password: signin.password,
        },
        isGoogleSignIn
      );
      if (!response.error) {
        dispatch(setUser(response.data));
      }
      return response;
    } catch (err: any) {
      dispatch(setUserError(err.toString()));
    }
  };

// THUNK3: Update User
export const updateUserThunk =
  (userId: number): AppThunk =>
  async (dispatch) => {
    try {
      let response: any;
      response = await fetchUserData(userId);
      if (!response.error) {
        dispatch(setUser(response.data));
      }
      return response;
    } catch (err: any) {
      dispatch(setUserError(err.toString()));
    }
  };

// THUNK4: Logout User
export const logoutUser =
  (userId: number): AppThunk =>
  async (dispatch) => {
    try {
      if (userId !== 0) {
        dispatch(
          setUser({
            token: "",
            id: 0,
            email: "",
            steam_id: "",
            avatar_url: "https://res.cloudinary.com/kultured-dev/image/upload/v1625617920/defaultAvatar_aeibqq.png",
            username: "none",
            numOfStrikes: 0,
            about: "",
            age: 0,
            gender: 0,
            region: "",
            languages: [],
            preferred_platform: 0,
            discord: "",
            psn: "",
            xbox: "",
            last_seen: undefined,
            user_id: 0,
            weekdays: "",
            weekends: "",
            roles: [],
            play_styles: [],
            rust_is_published: false,
            rocket_league_is_published: false,
            battle_bit_is_published: false,
            connection_count_sender: 0,
            connection_count_acceptor: 0,
            gangs: [],
            connections: [],
            input_device_id: "",
            output_device_id: "",
            rank: 0,
            created_at: undefined,
            updated_at: undefined,
            error: false,
          })
        );
      }
      return { success: "true" };
    } catch (err: any) {
      dispatch(setUserError(err.toString()));
    }
  };

// THUNK5: Resetting Password For User
export const resetPasswordInState =
  (email: string, vKey: string, password: string): AppThunk =>
  async (dispatch) => {
    try {
      let response: any;
      response = await resetPassword(email, vKey, password);
      if (!response.error) {
        dispatch(setUser(response.data));
      }
      return response;
    } catch (err: any) {
      dispatch(setUserError(err.toString()));
    }
  };
