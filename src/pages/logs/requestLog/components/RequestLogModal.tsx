import { IRequestLog } from "@/api/logs";
import { Modal, Typography } from "antd";
import { JSONTree } from 'react-json-tree';

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
    console.log('requestLog', props.requestLog);
    const { requestLog } = props;
    return <Modal width={1200} title="请求日志" open={props.open} onOk={props.onOk} onCancel={props.onCancel}>
        <Typography>
            <Typography.Title >{requestLog.responseStatus}</Typography.Title>
            <Typography.Paragraph copyable>请求地址：{requestLog.url}</Typography.Paragraph>
            <Typography.Paragraph >请求方法：{requestLog.method}</Typography.Paragraph>
            <Typography.Paragraph copyable>请求参数：{JSON.stringify(requestLog.requestBody)}</Typography.Paragraph>
            <JSONTree hideRoot data={requestLog.requestBody} />
            <Typography.Paragraph>请求IP：{requestLog.ip}</Typography.Paragraph>
            <Typography.Paragraph copyable>响应结果：{JSON.stringify(requestLog.responseBody)}</Typography.Paragraph>
            <JSONTree hideRoot data={requestLog.responseBody} />
            <Typography.Paragraph>响应消息：{requestLog.message}</Typography.Paragraph>
            <Typography.Paragraph>请求时间：{new Date(requestLog.timestamp).toLocaleString()}</Typography.Paragraph>
        </Typography>
    </Modal>
}

export default RequestLogModal;

