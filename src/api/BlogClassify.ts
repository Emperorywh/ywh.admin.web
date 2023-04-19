import { request } from '@umijs/max';
import React from 'react';

/**
 * 创建博客分类
 * @param data 
 * @returns 
 */
export function BlogClassifyCreate(data: IBlogClassify) {
    return request('/apis/blogClassify/create', {
        method: 'POST',
        data
    });
}

/**
 * 删除博客分类
 * @param data 
 * @returns 
 */
export function BlogClassifyDelete(data: React.Key[]) {
    return request('/apis/blogClassify/delete', {
        method: 'DELETE',
        data
    });
}

/**
 * 修改博客分类
 * @param data 
 * @returns 
 */
export function BlogClassifyUpdate(data: IBlogClassify) {
    return request('/apis/blogClassify/update', {
        method: 'PUT',
        data
    });
}

/**
 * 博客分类 分页查询
 * @param data 
 * @returns 
 */
export function BlogClassifyPageQuery(data: IBlogClassifyPage) {
    return request('/apis/blogClassify/list', {
        method: 'POST',
        data
    });
}

/**
 * 博客分类 数据类型
 */
export interface IBlogClassify {
    _id?: string;
    name: string;
    status?: number;
}


/**
 * 博客分类 分页查询请求参数
 */
export interface IBlogClassifyPage extends CommonTypes.PageQueryParams {
    name?: string
}