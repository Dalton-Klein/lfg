export interface User {
  token: string;
  id: number;
  email: string;
  avatarUrl: string | undefined;
  username: string;
  numOfStrikes: number;
  about: string;
  age: number;
  gender: number;
  region: string;
  languages: [];
  preferred_platform: number;
  discord: string;
  psn: string;
  xbox: string;
  last_seen: undefined;
  user_id: number;
  weekdays: string;
  weekends: string;
  roles: [];
  play_styles: [];
  created_at?: Date;
  updated_at?: Date;
  error: React.SetStateAction<boolean>;
}

export interface Preferences {
  conversationsOrChat: boolean;
  currentChatId: number;
  currentChatItemId: number;
  currentChatOtherUser: {
    id: number;
    avatarUrl: string;
    username: string;
  };
  messages: any;
  lastProfileMenu: number;
  discoverFilters: any;
}

export interface SignIn {
  email: string;
  password: string;
}

export interface StandardTile {
  id: number;
  name: string;
  price: number;
  image: string;
  level?: number;
  userOwner: number;
  userOwnerName: string;
}
