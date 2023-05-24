import { request } from '@umijs/max';

import React from 'react';

/**
 * 创建个性签名
 * @param data 
 * @returns 
 */
export function PersionSignalCreate(data: IPersionSignal) {
    return request('/apis/personalSignature/create', {
        method: 'POST',
        data
    });
}

/**
 * 删除个性签名
 * @param data 
 * @returns 
 */
export function PersionSignalDelete(data: React.Key[]) {
    return request('/apis/personalSignature/delete', {
        method: 'DELETE',
        data
    });
}

/**
 * 修改个性签名
 * @param data 
 * @returns 
 */
export function PersionSignalUpdate(data: IPersionSignal) {
    return request('/apis/personalSignature/update', {
        method: 'PUT',
        data
    });
}

/**
 * 个性签名 分页查询
 * @param data 
 * @returns 
 */
export function PersionSignalPageQuery(data: IPersionSignalPage) {
    return request('/apis/personalSignature/list', {
        method: 'POST',
        data
    });
}

export interface IPersionSignal {
    _id?: string;
    content: string;
    createAt: number;
    updateAt: number;
}

export interface IPersionSignalPage extends CommonTypes.PageQueryParams {

}