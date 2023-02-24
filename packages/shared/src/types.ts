export interface Bundle {
  appId: number;
  name: string;
  //   imgUrl: string;
  items: string[];
  priceSOL: number;
  lastRecordedPrice?: number;
  enabled: boolean;
  startTime?: Date;
  endTime?: Date;
}

type AvaliableBlockchains = "solana" | "ethereum" | "polygon";

export interface Game {
  appId: number;
  mainImage: string;
  background: string;
  mccAddress: string;
  name: string;
  desc: string;
  blockchain: AvaliableBlockchains;
  isPublished: boolean;
  updatedAt?: Date;
}

export interface Item {
  appId: number;
  marketHashName: string;
  name: string;
  // projectExternalUrl: string;
  imageUrl: string;
  direct_buy: boolean;
  enabled: boolean;
  startTime?: Date;
  endTime?: Date;
  lastRecordedPrice?: number;
  priceSOL?: number;
  tags?: Array<{
    category: string;
    value: string;
  }>;
  updatedAt?: Date;
}

export interface Lootbox {
  appId: number;
  name: string;
  imageUrl: string;
  items: Array<{
    marketHashName: string;
    rarity: number;
  }>;
  priceSOL: number;
  lastRecordedPrice?: number;
  enabled: boolean;
  startTime?: Date;
  endTime?: Date;
  updatedAt?: Date;
}

export interface Trait {
    appId: number;
    enabled: boolean;
    category: string;
    potentialValues: string[];
  }