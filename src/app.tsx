import Footer from '@/components/Footer';
import { Settings as LayoutSettings } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from '@umijs/max';
import { history } from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';
import React from 'react'; 
import { Dropdown } from 'antd'; 
import { LogoutOutlined } from '@ant-design/icons';
import { IUser } from './api/User';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
	settings?: Partial<LayoutSettings>;
}> {
	return {
		settings: defaultSettings as Partial<LayoutSettings>,
	};
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }) => {
	const userStorage: IUser = JSON.parse(localStorage.getItem('USER_INFO') || "{}");
	return {
		avatarProps: { 
			src: userStorage?.avatarUrl || 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
			size: 'small',
			title: userStorage?.nickname || '',
			render: (props, dom) => { 
				return (
					<Dropdown
						menu={{
							items: [
								{
									key: 'logout',
									icon: <LogoutOutlined />,
									label: '退出登录',
									danger: true,
									onClick: () => {
										history.push('/login');
										localStorage.clear();
									}
								},
							],
						}}
					>
						{dom}
					</Dropdown>
				);
			},
		},
		waterMarkProps: {
			content: "YWH.Admin.Web",
		},
		footerRender: () => <Footer />,
		onPageChange: () => {

		},
		childrenRender: (children) => {
			return (
				<>
					{children}
				</>
			);
		},
		...initialState?.settings,
	};
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 和 ahooks 的 useRequest 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request = {
	...errorConfig,
};
