import { BlogClassifyDelete, BlogClassifyPageQuery, IBlogClassify } from "@/api/BlogClassify";
import { CheckCircleOutlined, CloseCircleOutlined, DeleteOutlined, ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { ActionType, PageContainer, ProColumns, ProTable, TableDropdown } from "@ant-design/pro-components";
import { Button, message, Popconfirm, Space, Tag } from "antd";
import React, { useRef, useState } from "react";

const PageComponent: React.FC = () => {
    //表格实例对象
    const actionRef = useRef<ActionType>();
    //当前选中的ID
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [messageApi, contextHolder] = message.useMessage();
    /**
     * 删除
     */
    const handleDelete = async () => {
        if (selectedRowKeys.length === 0) {
            messageApi.error('请至少选择一个！');
            return;
        }
        const response = await BlogClassifyDelete(selectedRowKeys);
        if (response.code === 200) {
            message.success('删除成功！');
            actionRef.current?.reload();
        } else {
            message.error(response.message || '删除失败');
        }
    }

    //表格表头
    const columns: ProColumns<IBlogClassify>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '名称',
            dataIndex: 'name',
            ellipsis: true,
            tip: '标题过长会自动收缩',
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
            disable: true,
            title: '状态',
            dataIndex: 'status',
            search: false,
            renderFormItem: (_, { defaultRender }) => {
                return defaultRender(_);
            },
            render: (_, record) => (
                <Space>
                    {
                        record.status === 1 && <Tag icon={<CheckCircleOutlined />} color="success">
                            启用
                        </Tag>
                    }
                    {
                        record.status === 2 && <Tag icon={<CloseCircleOutlined />} color="error">
                            删除
                        </Tag>
                    }
                    {
                        record.status === 0 && <Tag icon={<ExclamationCircleOutlined />} color="warning">
                            停用
                        </Tag>
                    }
                </Space>
            ),
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

                    }}
                >
                    编辑
                </a>
            ],
        },
    ];

    return <PageContainer>
        {contextHolder}
        <ProTable<IBlogClassify>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params = {}) => {
                const response = await BlogClassifyPageQuery({
                    pageIndex: params.current || 1,
                    pageSize: params.pageSize || 20,
                    name: params.name
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
            headerTitle="博客分类"
            toolBarRender={() => [
                <Button
                    key="button"
                    icon={<PlusOutlined />}
                    onClick={() => {

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
    </PageContainer>
}

export default PageComponent;