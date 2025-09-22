import { User } from '../../../user/model/user';

export interface LoginResult {
  token: string;
  user: User;
}
