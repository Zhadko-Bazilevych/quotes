import type { GetUsersQuery, UserList } from '@/types/user';

import { BaseApi } from './base-api';
import { Client } from './client';

export class UserApi extends BaseApi {
  async getList(query: GetUsersQuery): Promise<UserList> {
    const url = this.buildUrl('users');
    const data = await Client.get<UserList>(url, { query });
    return data;
  }
}
