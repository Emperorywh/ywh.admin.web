import { PageContainer } from "@ant-design/pro-components";
import { Button, Input, Space } from "antd";
import styles from "./index.less"; 

const PageComponent: React.FC = () => {
    return <>
        <PageContainer className={styles.blog_container}> 
            <Space.Compact style={{ width: '100%' }}>
                <Input placeholder="请输入博客标题" />
                <Button type="primary">搜索</Button>
            </Space.Compact>
        </PageContainer>
    </>
}

export default PageComponent;