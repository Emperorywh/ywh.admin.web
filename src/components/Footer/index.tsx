import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {
	const currentYear = new Date().getFullYear();
	return (
		<DefaultFooter
			style={{
				background: 'none',
			}}
			copyright={`${currentYear} 胤龙集团研发部出品`}
			links={[
				{
					key: 'Ant Design Pro',
					title: 'Ant Design Pro',
					href: '#',
					blankTarget: true,
				},
				{
					key: 'github',
					title: <GithubOutlined />,
					href: '#',
					blankTarget: true,
				},
				{
					key: 'Ant Design',
					title: 'Ant Design',
					href: '#',
					blankTarget: true,
				},
			]}
		/>
	);
};

export default Footer;
