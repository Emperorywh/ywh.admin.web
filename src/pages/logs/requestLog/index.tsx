import { IRequestLog } from "@/api/logs";
import { ActionType, PageContainer, ProColumns, ProTable } from "@ant-design/pro-components";
import { useRef, useState } from "react";
import { RequestLogPageQuery } from "@/api/logs";
import RequestLogModal from "./components/RequestLogModal";

const RequestLog: React.FC = () => {
    //表格实例对象
    const actionRef = useRef<ActionType>();
    // 当前 操作的日志
    const [currentLog, setCurrentLog] = useState<IRequestLog>();
    // 是否展示弹窗
    const [showModal, setShowModal] = useState(false);
    //表格表头
    const columns: ProColumns<IRequestLog>[] = [
        {
            dataIndex: 'index',
            valueType: 'indexBorder',
            width: 48,
        },
        {
            title: '路径',
            dataIndex: 'url',
            key: 'url',
            hideInSearch: true,
        },
        {
            title: '方法',
            dataIndex: 'method',
            key: 'method',
            valueType: 'select',
            fieldProps: {
                options: [
                    {
                        value: 'GET',
                        label: 'GET'
                    },
                    {
                        value: 'POST',
                        label: 'POST'
                    },
                    {
                        value: 'PUT',
                        label: 'PUT'
                    },
                    {
                        value: 'DELETE',
                        label: 'DELETE'
                    },
                ]
            }
        },
        {
            title: '状态码',
            dataIndex: 'responseStatus',
            key: 'responseStatus',
        },
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
            hideInSearch: true,
        },
        {
            title: '消息',
            dataIndex: 'message',
            key: 'message',
            hideInSearch: true,
        },
        {
            title: '时间',
            key: 'timestamp',
            dataIndex: 'timestamp',
            valueType: 'dateTime',
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
                        setCurrentLog(record);
                        setShowModal(true);
                    }}
                >
                    详情
                </a>
            ],
        },
    ];

    return <PageContainer>
        <ProTable<IRequestLog>
            columns={columns}
            actionRef={actionRef}
            cardBordered
            request={async (params = {}) => {
                const response = await RequestLogPageQuery({
                    ...params,
                    pageIndex: params.current || 1,
                    pageSize: params.pageSize || 20,
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
            headerTitle="请求列表"
        />

        {
            showModal && currentLog && <RequestLogModal
                open={showModal}
                requestLog={currentLog}
                onCancel={() => setShowModal(false)}
                onOk={() => setShowModal(false)}
            ></RequestLogModal>
        }
    </PageContainer>
}

export default RequestLog;