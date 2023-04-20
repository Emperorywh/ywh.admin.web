import { request } from '@umijs/max';
import React from 'react';
import { IBlogClassify } from './BlogClassify';
import { IBlogLabel } from './BlogLabel';
import { IUser } from './User';

/**
 * 创建博客
 * @param data 
 * @returns 
 */
export function BlogCreate(data: IBlog) {
    return request('/apis/blog/create', {
        method: 'POST',
        data
    });
}

/**
 * 删除博客
 * @param data 
 * @returns 
 */
export function BlogDelete(data: React.Key[]) {
    return request('/apis/blog/delete', {
        method: 'DELETE',
        data
    });
}

/**
 * 修改博客
 * @param data 
 * @returns 
 */
export function BlogUpdate(data: IBlog) {
    return request('/apis/blog/update', {
        method: 'PUT',
        data
    });
}

/**
 * 博客 分页查询
 * @param data 
 * @returns 
 */
export function BlogPageQuery(data: IBlogPage) {
    return request('/apis/blog/list', {
        method: 'POST',
        data
    });
}

/**
 * 博客 数据类型
 */
export interface IBlog {
    _id: string,
    author: string | IUser,
    title: string,
    abstract: string,
    content: string,
    classification: string | IBlogClassify,
    label: string[] | IBlogLabel[],
    createAt: number,
    updateAt: number,
    status: number,
    likeNumber: number,
    commentNumber: number,
    readNumber: number,
    cover: string
}


/**
 * 博客 分页查询请求参数
 */
export interface IBlogPage extends CommonTypes.PageQueryParams {
    title?: string;
    classification?: string,
    label?: string[]
}