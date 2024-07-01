import { User } from "../schema/user.schema";

export type validateType = {
  email: string;
  password: string;
};

export type tokensType = {

  REFRESHTOKEN: string;
};

export type signUpType = {
  token: string;
  refreshToken: string
}

export type loginType = {
  user: User;
  token: string;
  refreshToken: string
}

export type returnedTokenType={
  accessToken: string;
  refreshToken:string;
}