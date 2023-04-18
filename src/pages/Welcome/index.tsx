import { PageContainer } from '@ant-design/pro-components';
import { Card } from 'antd';
import React from 'react';

const Welcome: React.FC = () => {
	
	return (
		<PageContainer>
			<Card
				style={{
					borderRadius: 8,
				}}
			>
				欢迎页
			</Card>
		</PageContainer>
	);
};

export default Welcome;
