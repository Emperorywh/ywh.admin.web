import { request } from '@umijs/max';

/**
 * 用户登录
 */
export default function UserLogin(data: UserLoginParams) {
    return request('/apis/user/login', {
        method: 'POST',
        data
    });
}

export interface UserLoginParams {
    username: string;
    password: string;
}