export interface User {
  token: string;
  id: number;
  email: string;
  avatarUrl: string | undefined;
  username: string;
  numOfStrikes: number;
  // trainerID?: number;
  // trainerName?: string;
  // mtgoID?: number;
  // mtgoName?: string;
  // buyerRating: number[];
  // sellerRating: number[];
  // transactionSales: number[];
  // transactionPurchases: number[];
  // transactionTrades: number[];
  // watchList: number[];
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
