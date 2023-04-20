import { PageContainer } from "@ant-design/pro-components";
import { Avatar, Button, Card, Checkbox, Col, Divider, Empty, Input, Pagination, Popconfirm, Radio, Row, Space, Tag, message } from "antd";
import styles from "./index.less";
import { useCallback, useEffect, useState } from "react";
import { BlogClassifyPageQuery, IBlogClassify } from "@/api/BlogClassify";
import { BlogLabelPageQuery, IBlogLabel } from "@/api/BlogLabel";
import { BlogDelete, BlogPageQuery, IBlog } from "@/api/Blog";
import { DeleteOutlined, EditOutlined, UserOutlined } from "@ant-design/icons";

/**
 * 博客分类 多选框数据类型
 */
interface IBlogLabelCheckBox extends IBlogLabel {
    label: string;
    value: string;
}

const PageComponent: React.FC = () => {
    //搜索栏绑定的输入框
    const [blogTitle, setblogTitle] = useState('');
    //博客列表
    const [blogList, setBlogList] = useState<IBlog[]>([]);
    //博客分类列表
    const [classifyList, setClassifyList] = useState<IBlogClassify[]>([]);
    //当前选中的分类
    const [selectedClassify, setSelectedClassify] = useState('');
    //博客标签列表
    const [labelList, setLabelList] = useState<IBlogLabelCheckBox[]>([]);
    //当前选中的标签
    const [selectedLabel, setSelectedLabel] = useState<string[]>([]);
    //消息实例
    const [messageApi, contextHolder] = message.useMessage();
    //当前页面
    const [pageIndex, setPageIndex] = useState(1);
    //页容量
    const [pageSize, setPageSize] = useState(8);
    //总量
    const [total, setTotal] = useState(0);

    /**
     * 获取博客分类
     */
    const onFetchBlogClassify = async () => {
        const response = await BlogClassifyPageQuery({
            pageIndex: 1,
            pageSize: 20
        });
        if (response.code === 200) {
            setClassifyList(response.data.items);
        } else {
            messageApi.error(response.message || '获取博客分类失败');
        }
    }

    /**
     * 获取博客标签
     */
    const onFetchBlogLabel = async () => {
        const response = await BlogLabelPageQuery({
            pageIndex: 1,
            pageSize: 20,
        });
        if (response.code === 200) {
            response.data.items.forEach((item: IBlogLabelCheckBox) => {
                item.label = item.name;
                item.value = item._id as string;
            })
            setLabelList(response.data.items);
        } else {
            messageApi.error(response.message || '获取博客标签失败');
        }
    }

    /**
     * 查询博客列表
     */
    const onFetchBlogList = async () => {
        const response = await BlogPageQuery({
            pageIndex,
            pageSize,
            title: blogTitle,
            classification: selectedClassify,
            label: selectedLabel
        });
        if (response.code === 200) {
            setTotal(response.data.total);
            setBlogList(response.data.items);
        } else {
            message.error(response.message || "查询博客列表失败");
        }
    }

    /**
     * 删除博客
     */
    const onDeleteBlog = async (blog: IBlog) => {
        const response = await BlogDelete([blog._id]);
        if (response.code === 200) {
            messageApi.success("删除成功");
            onFetchBlogList();
        } else {
            messageApi.error(response.message || '删除失败');
        }
    }

    useEffect(() => {
        onFetchBlogList();
    }, [pageIndex, pageSize]);

    useEffect(() => {
        onFetchBlogClassify();
        onFetchBlogLabel();
    }, []);

    return <>
        {contextHolder}
        {/* 头部 */}
        <PageContainer className={styles.blog_container}>
            <div className={styles.blog_header}>
                <Space.Compact style={{ width: '30vw' }}>
                    <Input allowClear value={blogTitle} onChange={value => setblogTitle(value.target.value)} className={styles.blog_header_input} size="large" placeholder="请输入博客标题" />
                    <Button className={styles.blog_header_input} size="large" type="primary" onClick={onFetchBlogList}>搜索</Button>
                </Space.Compact>
            </div>
        </PageContainer>
        {/* 博客分类 + 博客标签 */}
        <Card className={styles.blog_classify}>
            <div className={styles.blog_classify_item}>
                <Space>
                    <div>分类：</div>
                    <Radio.Group buttonStyle="solid" value={selectedClassify} onChange={value => setSelectedClassify(value.target.value)}>
                        {
                            classifyList.map(item => {
                                return <Radio.Button key={item._id} value={item._id} disabled={item.status === 0}>{item.name}</Radio.Button>
                            })
                        }
                    </Radio.Group>
                </Space>
            </div>
            <Divider dashed />
            <div className={styles.blog_classify_item}>
                <Space>
                    <div>标签：</div>
                    <Checkbox.Group value={selectedLabel} onChange={value => setSelectedLabel(value as unknown as string[])} options={labelList} />
                </Space>
            </div>
        </Card>
        {/* 博客列表 */}
        {
            blogList.length > 0 ? <div className={styles.blog_list_card}>
                <Row gutter={[20, 20]} wrap>
                    {
                        blogList.map(item => {
                            return <Col key={item._id} xs={12} sm={12} md={12} lg={12} xl={6}>
                                <Card
                                    hoverable
                                    style={{ width: '100%' }}
                                    cover={<div className={styles.blog_cover_box}>
                                        <img style={{ width: '100%', height: '200px' }} alt="example" src="https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png" />
                                        <Tag className={styles.blog_cover_classify} color="cyan">{(typeof item.classification !== 'string') && item.classification.name}</Tag>
                                    </div>}
                                    actions={[
                                        <EditOutlined key="edit" />,
                                        <Popconfirm
                                            title="确定要删除这篇博客吗？"
                                            description={item.title}
                                            onConfirm={() => onDeleteBlog(item)}
                                            okText="确定"
                                            cancelText="取消"
                                        >
                                            <DeleteOutlined key="delete" />
                                        </Popconfirm>,
                                    ]}
                                >
                                    <Card.Meta title={item.title} description={item.abstract} style={{ height: '150px' }} />
                                    <div className={styles.blog_auther_info}>
                                        <div>
                                            {new Date(item.updateAt).toLocaleString()}
                                        </div>
                                        <Avatar size={36} icon={<UserOutlined />} src={(typeof item.author !== 'string') && item.author.avatarUrl} />
                                    </div>
                                </Card>
                            </Col>
                        })
                    }
                </Row>
            </div> : <Empty style={{backgroundColor: '#FFF', margin: '20px', height: '400px'}} />
        }
        {/* 分页组件 */}
        <div className={styles.blog_pagenation}>
            <Pagination current={pageIndex} pageSize={pageSize} total={total} onChange={(pageIndex, pageSize) => {
                setPageIndex(pageIndex);
                setPageSize(pageSize);
            }} />
        </div>

    </>
}

export default PageComponent;