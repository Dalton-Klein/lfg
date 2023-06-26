export interface User {
  token: string;
  id: number;
  email: string;
  steam_id: string;
  avatar_url: string | undefined;
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
  rust_is_published: boolean;
  rocket_league_is_published: boolean;
  connection_count_sender: number;
  connection_count_acceptor: number;
  gangs: any;
  connections: any;
  input_device_id: string;
  output_device_id: string;
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
    avatar_url: string;
    username: string;
  };
  messages: any;
  lastProfileMenu: number;
  discoverFilters: any;
  currentConvo: any;
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
