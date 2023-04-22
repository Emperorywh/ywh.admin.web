import { FriendlyLinkCreate, FriendlyLinkUpdate, IFriendlyLink } from "@/api/FriendlyLink";
import { UserOutlined } from "@ant-design/icons";
import { Form, Input, Modal, Select, message, Image, Avatar } from "antd";
import { useEffect, useState } from "react";

interface IProps {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
    friendlyLink?: IFriendlyLink
}

const CreateUpdateFriendlyLink: React.FC<IProps> = (props) => {
    //表单实例
    const [form] = Form.useForm();
    //消息实例
    const [messageApi, contextHolder] = message.useMessage();
    //友链封面预览
    const [cover, setCover] = useState('');

    const handleOk = async () => {
        const formData: IFriendlyLink = await form.validateFields();
        if (formData._id) {
            const response = await FriendlyLinkUpdate(formData);
            if (response.code === 200) {
                messageApi.success('更新成功');
                props.onOk();
            } else {
                messageApi.success(response.message || '更新失败');
            }
        } else {
            const response = await FriendlyLinkCreate(formData);
            if (response.code === 200) {
                messageApi.success('创建成功');
                props.onOk();
            } else {
                messageApi.success(response.message || '创建失败');
            }
        }
    }

    useEffect(() => {
        if (props.friendlyLink) {
            console.log("props.friendlyLink.url", props.friendlyLink.url);
            setCover(props.friendlyLink.cover);
        }
    }, []);

    return <Modal title="友情链接" open={props.open} onOk={handleOk} onCancel={props.onCancel}>
        {contextHolder}
        <Avatar style={{ margin: '10px 20px' }} size={64} icon={<UserOutlined />} src={cover} />
        <Form
            name="basic"
            labelCol={{ span: 4 }}
            autoComplete="off"
            form={form}
            initialValues={props.friendlyLink}
        >
            <Form.Item
                label="id"
                name="_id"
                hidden
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true, message: '这是必填项！' }]}
            >
                <Input placeholder="请输入友链名称！" />
            </Form.Item>

            <Form.Item
                label="地址"
                name="url"
                rules={[{ required: true, message: '这是必填项！' }]}
            >
                <Input placeholder="请输入友链地址！" />
            </Form.Item>

            <Form.Item
                label="封面"
                name="cover"
                rules={[{ required: true, message: '这是必填项！' }]}
            >
                <Input.TextArea onChange={value => {
                    setCover(value.target.value);
                }} autoSize={{ minRows: 1, maxRows: 6 }} placeholder="请输入友链封面！" />
            </Form.Item>

            <Form.Item
                label="描述"
                name="desc"
                rules={[{ required: true, message: '这是必填项！' }]}
            >
                <Input.TextArea autoSize={{ minRows: 2, maxRows: 6 }} placeholder="请输入友链描述！" />
            </Form.Item>

            <Form.Item
                label="排序"
                name="sort"
                rules={[{ required: true, message: '这是必填项！' }]}
            >
                <Input type="number" placeholder="请输入友链排序！" />
            </Form.Item>

            <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: '这是必填项！' }]}
            >
                <Select
                    style={{ width: '100%' }}
                    placeholder="请选择友链状态！"
                    options={[
                        { value: 1, label: '启用' },
                        { value: 0, label: '停用' },
                        { value: 3, label: '待审核' }
                    ]}
                />
            </Form.Item>
        </Form>
    </Modal>
}

export default CreateUpdateFriendlyLink;