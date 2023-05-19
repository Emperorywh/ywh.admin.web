import { request } from '@umijs/max';

/**
 * 请求分页查询
 */
export function RequestLogPageQuery(data: RequestLogParams) {
    return request('/apis/requestLog/list', {
        method: 'POST',
        data
    });
}

/**
 * 分页查询请求参数
 */
export interface RequestLogParams extends CommonTypes.PageQueryParams {
    status?: number
}

/**
 * 请求参数响应结果
 */
export interface IRequestLog {
    _id: string,
    ip: string,
    method: string,
    url: string,
    requestBody: any,
    responseStatus: number,
    responseBody: any,
    timestamp: number,
    message: string
}