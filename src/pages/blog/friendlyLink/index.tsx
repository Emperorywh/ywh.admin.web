import { PageContainer } from "@ant-design/pro-components";
import styles from "./index.less";
import { Avatar, Button, Card, Col, Empty, Input, Pagination, Popconfirm, Row, Space, Tag, message } from "antd";
import { useEffect, useState } from "react";
import { FriendlyLinkDelete, FriendlyLinkPageQuery, IFriendlyLink } from "@/api/FriendlyLink";
import { CheckCircleOutlined, ClockCircleOutlined, CloseCircleOutlined, DeleteOutlined, EditOutlined, PlusOutlined, SyncOutlined, UserOutlined } from "@ant-design/icons";
import CreateUpdateFriendlyLink from "./components/CreateUpdateFriendlyLink";

const FriendlyLinkComp: React.FC = () => {
    //是否加载中
    const [isLoading, setIsLoading] = useState(false);
    //搜索栏绑定的输入框
    const [friendlyLinkName, setFriendlyLinkName] = useState('');
    //友情链接列表
    const [friendlyLinkList, setFriendlyLinkList] = useState<IFriendlyLink[]>([]);
    //当前页面
    const [pageIndex, setPageIndex] = useState(1);
    //页容量
    const [pageSize, setPageSize] = useState(6);
    //总量
    const [total, setTotal] = useState(0);
    //消息实例
    const [messageApi, contextHolder] = message.useMessage();
    //是否展示 创建/更新 弹窗
    const [showModal, setShowModal] = useState(false);
    //当前操作的友链
    const [curFriendlyLink, setCurFriendlyLink] = useState<IFriendlyLink>();

    /**
     * 查询友情链接列表
     */
    const onFetchFriendlyLinkList = async () => {
        setIsLoading(true);
        const response = await FriendlyLinkPageQuery({
            pageIndex,
            pageSize,
            name: friendlyLinkName
        });
        setIsLoading(false);
        if (response.code === 200) {
            setTotal(response.data.total);
            setFriendlyLinkList(response.data.items);
        } else {
            message.error(response.message || "查询友情链接列表失败");
        }
    }

    /**
     * 编辑友链
     * @param friendlyLink 
     */
    const onEditFriendlyLink = (friendlyLink: IFriendlyLink) => {
        setCurFriendlyLink(friendlyLink);
        setShowModal(true);
    }

    /**
     * 删除友情链接
     * @param item 
     */
    const onDeleteFriendlyLink = async (friendlyLink: IFriendlyLink) => {
        const response = await FriendlyLinkDelete([friendlyLink._id]);
        if (response.code === 200) {
            onFetchFriendlyLinkList();
            message.success('删除成功！');
        } else {
            message.error(response.message || '删除失败');
        }
    }

    /**
     * 新建友情链接
     */
    const onCreateFriendlyLink = () => {
        setCurFriendlyLink(undefined);
        setShowModal(true);
    }

    useEffect(() => {
        onFetchFriendlyLinkList();
    }, [pageIndex, pageSize]);

    return <div>
        {contextHolder}
        {/* 头部 */}
        <PageContainer className={styles.friendlyLink_container}>
            <div className={styles.friendlyLink_header}>
                <Space.Compact style={{ width: '30vw' }}>
                    <Input allowClear value={friendlyLinkName} onChange={value => setFriendlyLinkName(value.target.value)} className={styles.friendlyLink_header_input} size="large" placeholder="请输入友链名称" />
                    <Button className={styles.friendlyLink_header_input} size="large" type="primary" onClick={onFetchFriendlyLinkList}>搜索</Button>
                </Space.Compact>
            </div>
            <Button className={styles.friendlyLink_add_btn} type="primary" icon={<PlusOutlined />} onClick={onCreateFriendlyLink}>
                新建友链
            </Button>
        </PageContainer>
        {/* 友情链接列表 */}
        {
            friendlyLinkList.length > 0 ? <div className={styles.friendly_list_card}>
                <Row gutter={[20, 20]} wrap>
                    {
                        friendlyLinkList.map(item => {
                            return <Col className={styles.friendly_list_item} key={item._id} xs={12} sm={12} md={12} lg={12} xl={8}>
                                <Card hoverable style={{ width: "100%" }} actions={[
                                    <EditOutlined key="edit" onClick={() => onEditFriendlyLink(item)} />,
                                    <Popconfirm
                                        title="确定要删除这个友链吗？"
                                        description={item.name}
                                        onConfirm={() => onDeleteFriendlyLink(item)}
                                        okText="确定"
                                        cancelText="取消"
                                    >
                                        <DeleteOutlined key="delete" />
                                    </Popconfirm>,
                                ]}>
                                    <Space size="large">
                                        <Avatar size={64} icon={<UserOutlined />} src={item.cover} />
                                        <h2>{item.name}</h2>
                                        {item.status === 0 && <Tag icon={<ClockCircleOutlined />} color="default">停用</Tag>}
                                        {item.status === 1 && <Tag icon={<CheckCircleOutlined />} color="success">启用</Tag>}
                                        {item.status === 2 && <Tag icon={<CloseCircleOutlined />} color="success">删除</Tag>}
                                        {item.status === 3 && <Tag icon={<SyncOutlined spin />} color="processing">待审核</Tag>}
                                    </Space>

                                    <div className={styles.friendly_link} onClick={() => {
                                        window.open(item.url);
                                    }}>
                                        {item.url}
                                    </div>

                                    <div className={styles.friendly_desc}>
                                        {item.desc}
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

        {
            showModal && <CreateUpdateFriendlyLink friendlyLink={curFriendlyLink} open={showModal} onOk={() => {
                setShowModal(false);
                onFetchFriendlyLinkList();
                message.success("操作成功");
            }} onCancel={() => setShowModal(false)}></CreateUpdateFriendlyLink>
        }
    </div>
}

export default FriendlyLinkComp;