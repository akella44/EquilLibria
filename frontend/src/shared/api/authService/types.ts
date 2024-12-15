export interface ILoginUser {
  username: string;
  password: string;
}

export interface IRegisterUser {
  username: string;
  password: string;
  telegram_2fa: boolean
}
