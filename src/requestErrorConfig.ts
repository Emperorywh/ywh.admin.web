import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { message } from 'antd';

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
		[
			(response) => {
				return response;
			},
			(error: any) => {
				handleError(error);
				return Promise.reject(error);
			}
		]
	],
};

const handleError = (error: any) => {
	if (!error.response) return;
	switch (error.response.status) {
		case 400:
			message.error('当前请求无法被服务器理解！');
			break;
		case 401:
			history.push('/login');
			break;
		case 404:
			message.error('请求地址错误！');
			break;
		case 408:
			message.error('请求超时！');
			break;
		case 500:
			message.error(error.response.data.message || '服务器端的源代码出现错误！');
			break;
		case 502:
			message.error('网关或者代理工作的服务器出现错误');
			break;
		default:
			message.error('服务端异常：' + error.message);
	}
}
