import { request } from '@umijs/max';

/**
 * 创建友情链接
 * @param data 
 * @returns 
 */
export function FriendlyLinkCreate(data: IFriendlyLink) {
    return request('/apis/friendlyLink/create', {
        method: 'POST',
        data
    });
}

/**
 * 删除友情链接
 * @param data 
 * @returns 
 */
export function FriendlyLinkDelete(data: React.Key[]) {
    return request('/apis/friendlyLink/delete', {
        method: 'DELETE',
        data
    });
}

/**
 * 修改友情链接
 * @param data 
 * @returns 
 */
export function FriendlyLinkUpdate(data: IFriendlyLink) {
    return request('/apis/friendlyLink/update', {
        method: 'PUT',
        data
    });
}

/**
 * 友情链接 分页查询
 * @param data 
 * @returns 
 */
export function FriendlyLinkPageQuery(data: IFriendlyLinkPage) {
    return request('/apis/friendlyLink/list', {
        method: 'POST',
        data
    });
}

/**
 * 友情链接
 */
export interface IFriendlyLink {
    _id: string,
    name: string,
    url: string,
    cover: string,
    desc: string,
    createAt: number,
    updateAt: number,
    status: number,
    sort: number,
    remark: string
}

/**
 * 友情链接 分页查询
 */
export interface IFriendlyLinkPage extends CommonTypes.PageQueryParams {
    name?: string
}