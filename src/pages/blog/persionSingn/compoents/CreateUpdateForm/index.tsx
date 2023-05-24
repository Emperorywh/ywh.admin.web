import { PersionSignalCreate, PersionSignalUpdate, IPersionSignal } from "@/api/PersionSignal";
import { Form, Input, message, Modal, Select } from "antd";

interface IProps {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
    persionSignal?: IPersionSignal
}

const CreateUpdateForm: React.FC<IProps> = (props) => {
    //表单实例
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = async () => {
        const formData: IPersionSignal = await form.validateFields();
        if (formData._id) {
            const response = await PersionSignalUpdate(formData);
            if (response.code === 200) {
                messageApi.success('更新成功');
                props.onOk();
            } else {
                messageApi.success(response.message || '更新失败');
            }
        } else {
            const response = await PersionSignalCreate(formData);
            if (response.code === 200) {
                messageApi.success('创建成功');
                props.onOk();
            } else {
                messageApi.success(response.message || '创建失败');
            }
        }
    }

    return <Modal title="个性签名" open={props.open} onOk={handleOk} onCancel={props.onCancel}>
        {contextHolder}
        <Form
            name="basic"
            labelCol={{ span: 4 }}
            autoComplete="off"
            form={form}
            initialValues={props.persionSignal}
        >
            <Form.Item
                label="id"
                name="_id"
                hidden
            >
                <Input />
            </Form.Item>

            <Form.Item
                label="内容"
                name="content"
                rules={[{ required: true, message: '这是必填项！' }]}
            >
                <Input.TextArea placeholder="请输入内容！" />
            </Form.Item>

            <Form.Item
                label="状态"
                name="status"
                rules={[{ required: true, message: '这是必填项！' }]}
            >
                <Select
                    style={{ width: '100%' }}
                    options={[
                        { value: 1, label: '启用' },
                        { value: 0, label: '停用' },
                    ]}
                />
            </Form.Item>
        </Form>
    </Modal>
}

export default CreateUpdateForm;