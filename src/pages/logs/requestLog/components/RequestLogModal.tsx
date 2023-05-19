import { IRequestLog } from "@/api/logs";
import { Descriptions, Modal } from "antd";
import { ProField, ProFieldFCMode } from "@ant-design/pro-components";

export interface IProps {
    requestLog: IRequestLog;
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
}

/**
 * 请求详情
 * @returns 
 */
const RequestLogModal: React.FC<IProps> = (props) => {
    const { requestLog } = props;
    return <Modal width={800} title="请求日志" open={props.open} onOk={props.onOk} onCancel={props.onCancel}>
        <Descriptions column={1}>
            <Descriptions.Item label="状态码">
                <ProField
                    text={requestLog.responseStatus}
                    valueType="text"
                    mode={'read'}
                />
            </Descriptions.Item>
            <Descriptions.Item label="请求地址">
                <ProField
                    text={requestLog.url}
                    valueType="text"
                    mode={'read'}
                />
            </Descriptions.Item>
            <Descriptions.Item label="请求方法">
                <ProField
                    text={requestLog.method}
                    valueType="text"
                    mode={'read'}
                />
            </Descriptions.Item>
            <Descriptions.Item label="请求参数">
                <ProField
                    text={JSON.stringify(requestLog.requestBody)}
                    valueType="jsonCode"
                    mode={'read'}
                />
            </Descriptions.Item>
            <Descriptions.Item label="IP地址">
                <ProField
                    text={requestLog.ip}
                    valueType="text"
                    mode={'read'}
                />
            </Descriptions.Item>
            <Descriptions.Item label="响应结果" style={{overflow: 'auto'}}>
                <ProField
                    text={JSON.stringify(requestLog.responseBody)}
                    valueType="jsonCode"
                    mode={'read'}
                />
            </Descriptions.Item>
            <Descriptions.Item label="响应消息">
                <ProField
                    text={requestLog.message}
                    valueType="text"
                    mode={'read'}
                />
            </Descriptions.Item>
            <Descriptions.Item label="请求时间">
                <ProField
                    text={requestLog.timestamp}
                    valueType="dateTime"
                    mode={'read'}
                />
            </Descriptions.Item>
        </Descriptions>

    </Modal>
}

export default RequestLogModal;

