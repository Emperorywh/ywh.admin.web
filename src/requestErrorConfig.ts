import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {

	// 请求拦截器
	requestInterceptors: [
		(config: RequestOptions) => {
			const token = localStorage.getItem('USER_TOKEN');
			if (token && config.headers) {
				config.headers['Authorization'] = token;
			}
			return config;
		},
	],

	// 响应拦截器
	responseInterceptors: [
		(response) => {
			return response;
		},
	],
};
