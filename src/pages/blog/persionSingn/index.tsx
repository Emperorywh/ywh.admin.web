import { PersionSignalDelete, PersionSignalPageQuery, IPersionSignal } from "@/api/PersionSignal";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import { Button, message, Popconfirm } from "antd";
import React, { useRef, useState } from "react";
import CreateUpdateForm from "./compoents/CreateUpdateForm";

const PageComponent: React.FC = () => {
    //表格实例对象
    const actionRef = useRef<ActionType>();
    //当前选中的ID
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    //消息实例
    const [messageApi, contextHolder] = message.useMessage();
    //是否展示 创建/更新 弹窗
    const [showModal, setShowModal] = useState(false);
    //当前操作的个性签名
    const [currSign, setCurrSign] = useState<IPersionSignal>();
    /**
     * 删除
     */
    const handleDelete = async () => {
        if (selectedRowKeys.length === 0) {
            messageApi.error('请至少选择一个！');
            return;
        }
        const response = await PersionSignalDelete(selectedRowKeys);
        if (response.code === 200) {
            message.success('删除成功！');
            setSelectedRowKeys([]);
            actionRef.current?.reload();
        } else {
            message.error(response.message || '删除失败');
        }
    }

    //表格表头
    const columns: ProColumns<IPersionSignal>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '内容',
            dataIndex: 'content',
            ellipsis: true,
            tip: '标题过长会自动收缩',
            width: 900,
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: '此项为必填项',
                    },
                ],
            },
        },
        {
            title: '创建时间',
            key: 'createAt',
            dataIndex: 'createAt',
            valueType: 'date',
            hideInSearch: true,
        },
        {
            title: '更新时间',
            key: 'updateAt',
            dataIndex: 'updateAt',
            valueType: 'date',
            hideInSearch: true,
        },
        {
            title: '操作',
            valueType: 'option',
            key: 'option',
            render: (text, record, _, action) => [
                <a
                    key="editable"
                    onClick={() => {
                        setCurrSign(record);
                        setShowModal(true);
                    }}
                >
                    编辑
                </a>
            ],
        },
    ];

    return <PageContainer>
        {contextHolder}
        <ProTable<IPersionSignal>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params = {}) => {
                const response = await PersionSignalPageQuery({
                    ...params,
                    pageIndex: params.current || 1,
                    pageSize: params.pageSize || 20
                });
                if (response.code === 200) {
                    return {
                        total: response.data.total,
                        data: response.data.items,
                        success: true
                    }
                }
                return []
            }}
            rowKey="_id"
            search={{
                labelWidth: 'auto',
            }}
            options={{
                setting: {
                    listsHeight: 400,
                },
            }}
            dateFormatter="string"
            headerTitle="个性签名"
            toolBarRender={() => [
                <Button
                    key="button"
                    icon={<PlusOutlined />}
                    onClick={() => {
                        setCurrSign(undefined);
                        setShowModal(true);
                    }}
                    type="primary"
                >
                    新建
                </Button>,
                <Popconfirm
                    title="确定要删除吗？"
                    description="删除后不可恢复"
                    onConfirm={handleDelete}
                    okText="确定"
                    cancelText="取消"
                >
                    <Button
                        key="button"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => {

                        }}
                        type="primary"
                    >
                        删除
                    </Button>
                </Popconfirm>,

            ]}
            rowSelection={{
                type: 'checkbox',
                selectedRowKeys,
                onChange: setSelectedRowKeys
            }}
        />
        
        {
            showModal && <CreateUpdateForm persionSignal={currSign} open={showModal} onOk={() => {
                messageApi.success('操作成功！');
                setShowModal(false);
                actionRef.current?.reload();
            }} onCancel={() => setShowModal(false)}></CreateUpdateForm>
        }

    </PageContainer>
}

export default PageComponent;