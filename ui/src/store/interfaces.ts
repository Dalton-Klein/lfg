export interface User {
  token: string;
  id: number;
  email: string;
  avatarUrl: string | undefined;
  username: string;
  trainerID?: number;
  trainerName?: string;
  mtgoID?: number;
  mtgoName?: string;
  buyerRating: number[];
  sellerRating: number[];
  transactionSales: number[];
  transactionPurchases: number[];
  transactionTrades: number[];
  numOfStrikes: number;
  watchList: number[];
  createdAt?: Date;
  updatedAt?: Date;
  error: React.SetStateAction<boolean>;
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