import { request } from '@umijs/max';
import React from 'react';

/**
 * 创建博客标签
 * @param data 
 * @returns 
 */
export function BlogLabelCreate(data: IBlogLabel) {
    return request('/apis/blogLabel/create', {
        method: 'POST',
        data
    });
}

/**
 * 删除博客标签
 * @param data 
 * @returns 
 */
export function BlogLabelDelete(data: React.Key[]) {
    return request('/apis/blogLabel/delete', {
        method: 'DELETE',
        data
    });
}

/**
 * 修改博客标签
 * @param data 
 * @returns 
 */
export function BlogLabelUpdate(data: IBlogLabel) {
    return request('/apis/blogLabel/update', {
        method: 'PUT',
        data
    });
}

/**
 * 博客标签 分页查询
 * @param data 
 * @returns 
 */
export function BlogLabelPageQuery(data: IBlogLabelPage) {
    return request('/apis/blogLabel/list', {
        method: 'POST',
        data
    });
}

/**
 * 博客标签 数据类型
 */
export interface IBlogLabel {
    _id?: string;
    name: string;
    status?: number;
}


/**
 * 博客标签 分页查询请求参数
 */
export interface IBlogLabelPage extends CommonTypes.PageQueryParams {
    name?: string
}