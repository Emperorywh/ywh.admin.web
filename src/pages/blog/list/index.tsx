import { PageContainer, nanoid } from "@ant-design/pro-components";
import { Avatar, Button, Card, Checkbox, Col, Divider, Empty, Input, Pagination, Popconfirm, Radio, Row, Space, Spin, Tag, message, Image } from "antd";
import styles from "./index.less";
import { useEffect, useState } from "react";
import { BlogClassifyPageQuery, IBlogClassify } from "@/api/BlogClassify";
import { BlogLabelPageQuery, IBlogLabel } from "@/api/BlogLabel";
import { BlogDelete, BlogPageQuery, IBlog } from "@/api/Blog";
import { DeleteOutlined, EditOutlined, PlusOutlined, UserOutlined } from "@ant-design/icons";
import { history } from '@umijs/max';

/**
 * 博客分类 多选框数据类型
 */
interface IBlogLabelCheckBox extends IBlogLabel {
    label: string;
    value: string;
}

const PageComponent: React.FC = () => {
    //是否加载中
    const [isLoading, setIsLoading] = useState(false);
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
    //是否全选标签样式
    const [indeterminate, setIndeterminate] = useState(false);
    //是否全选
    const [checkAll, setCheckAll] = useState(false);
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
            });
            setLabelList(response.data.items);
        } else {
            messageApi.error(response.message || '获取博客标签失败');
        }
    }

    /**
     * 查询博客列表
     */
    const onFetchBlogList = async () => {
        setIsLoading(true);
        const response = await BlogPageQuery({
            pageIndex,
            pageSize,
            title: blogTitle,
            classification: selectedClassify,
            label: selectedLabel
        });
        setIsLoading(false);
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
        const response = await BlogDelete([blog._id as string]);
        if (response.code === 200) {
            messageApi.success("删除成功");
            onFetchBlogList();
        } else {
            messageApi.error(response.message || '删除失败');
        }
    }

    /**
     * 编辑博客
     * @param blog 
     */
    const onEditBlog = async (blog: IBlog) => {
        history.push("/blog/editor?blogId=" + blog._id)
    }

    /**
     * 创建博客
     */
    const handleCreateBlog = () => {
        history.push('/blog/editor');
    }

    useEffect(() => {
        onFetchBlogList();
    }, [pageIndex, pageSize, selectedClassify, selectedLabel]);

    useEffect(() => {
        onFetchBlogClassify();
        onFetchBlogLabel();
    }, []);

    return <Spin size="large" spinning={isLoading} >
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
                        <Radio.Button key={nanoid()} value={""}>全部</Radio.Button>
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
                    <Checkbox indeterminate={indeterminate} onChange={(value) => {
                        if (value.target.checked) {
                            const temp: string[] = [];
                            labelList.forEach(item => {
                                temp.push(item._id as string);
                            });
                            setSelectedLabel(temp);
                        } else {
                            setSelectedLabel([]);
                        }
                        setCheckAll(value.target.checked);
                        setIndeterminate(false);
                    }} checked={checkAll}>
                        全选
                    </Checkbox>
                    <Checkbox.Group value={selectedLabel} onChange={value => {
                        setSelectedLabel(value as unknown as string[]);
                        setCheckAll(value.length === labelList.length);
                        setIndeterminate(value.length > 0 && value.length !== labelList.length);
                    }} options={labelList} />
                </Space>
            </div>
            <Button className={styles.blog_classify_add} type="primary" icon={<PlusOutlined />} size="large" onClick={handleCreateBlog}>
                发布博客
            </Button>
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
                                        <Image
                                            width="100%"
                                            height={200}
                                            src={item.cover}
                                            fallback="data:image/png;base64,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"
                                        />
                                        <Tag className={styles.blog_cover_classify} color="cyan">{(typeof item.classification !== 'string') && item.classification.name}</Tag>
                                        <div className={styles.blog_cover_labels}>
                                            {
                                                item.label.map((labelItem, labelIndex) => {
                                                    const color = ["magenta", "#f50", "#2db7f5", "#87d068", "#108ee9"];
                                                    return <Tag color={color[labelIndex % 5]}>{(typeof labelItem !== 'string') && labelItem.name}</Tag>
                                                })
                                            }
                                        </div>
                                    </div>}
                                    actions={[
                                        <EditOutlined key="edit" onClick={() => onEditBlog(item)} />,
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
                                            {new Date(item.updateAt || 0).toLocaleString()}
                                        </div>
                                        <Avatar size={36} icon={<UserOutlined />} src={(typeof item.author !== 'string') && item.author?.avatarUrl} />
                                    </div>
                                </Card>
                            </Col>
                        })
                    }
                </Row>
            </div> : <Empty style={{ backgroundColor: '#FFF', margin: '20px', height: '400px' }} />
        }
        {/* 分页组件 */}
        <div className={styles.blog_pagenation}>
            <Pagination current={pageIndex} pageSize={pageSize} total={total} onChange={(pageIndex, pageSize) => {
                setPageIndex(pageIndex);
                setPageSize(pageSize);
            }} />
        </div>
    </Spin>
}

export default PageComponent;