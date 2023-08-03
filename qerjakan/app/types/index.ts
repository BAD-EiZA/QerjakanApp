import { User, Profile, Service, Order, UserBankAccount,  Message, Conversation, Report, Reviews,  } from "@prisma/client"


export type SafeService = Omit<Service, "createdAt"> & {
  createdAt: string;
  serviceRating: Reviews[]
};

export type SafeMyOrder = Omit<Order, "createdAt"> & {
  createdAt: string;
  payment_type: string
}

export type SafeOrder = Omit<Order, "createdAt"> & {
  createdAt: string;
};

export type SafeReport = Omit<Order, "createdAt"> & {
  createdAt: string;
};

export type SafeUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified" | "userbank"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
  userbank: UserBankAccount;
};

export type SafeCurrentUser = Omit<
  User,
  "createdAt" | "updatedAt" | "emailVerified"
> & {
  createdAt: string;
  updatedAt: string;
  emailVerified: string | null;
};


export type SafeProfile = Omit<Profile, "description" | "language"> & {
  description: string;
  language: string
  
}

export type FullMessageType = Message & {
  sender: User, 
  seen: User[]
};

export type FullConversationType = Conversation & { 
  users: User[]; 
  messages: FullMessageType[]
};