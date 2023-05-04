import { request } from '@umijs/max';

/**
 * 创建关于我
 * @param data 
 * @returns 
 */
export function AboutCreate(data: IAbout) {
    return request('/apis/about/create', {
        method: 'POST',
        data
    });
}

/**
 * 更新关于我
 * @param data 
 * @returns 
 */
export function AboutUpdate(data: IAbout) {
    return request('/apis/about/update', {
        method: 'POST',
        data
    });
}

/**
 * 查询关于我
 * @param data 
 * @returns 
 */
export function AboutFindOne() {
    return request('/apis/about/findOne', {
        method: 'POST'
    });
}

export interface IAbout {
    _id?: string;
    content: string;
    createAt?: number;
    updateAt?: number;
    status?: number;
}