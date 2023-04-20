import { request } from '@umijs/max';

/**
 * 用户登录
 */
export function UserLogin(data: UserLoginParams) {
    return request('/apis/user/login', {
        method: 'POST',
        data
    });
}

/**
 * 用户登录 请求参数
 */
export interface UserLoginParams {
    username: string;
    password: string;
}

/**
 * 用户对象
 */
export interface IUser {
    _id: string,
    username: string,
    nickname: string,
    password: string,
    phone: string,
    createAt: number,
    updateAt: number,
    avatarUrl: string,
    openId: string,
    status: number,
    persionalProfile: string,
    roles: string[]
}