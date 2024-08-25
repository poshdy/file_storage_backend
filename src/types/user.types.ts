export type User = {
  email: string;
  hash?: string;
  id?: string;
  name: string;
  hashRt?: string;
};

export type TIdentifer = 'email' | 'id';


export type ReturnedUserType = {
  id:string,
  email:string,
  access_token:string
  refresh_token: string
}