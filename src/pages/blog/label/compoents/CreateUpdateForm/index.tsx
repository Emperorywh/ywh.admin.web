import { BlogLabelCreate, BlogLabelUpdate, IBlogLabel } from "@/api/BlogLabel";
import { Form, Input, message, Modal, Select } from "antd";
import { useEffect } from "react";

interface IProps {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
    label?: IBlogLabel
}

const CreateUpdateForm: React.FC<IProps> = (props) => {
    //表单实例
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = async () => {
        const formData: IBlogLabel = await form.validateFields();
        if (formData._id) {
            const response = await BlogLabelUpdate(formData);
            if (response.code === 200) {
                messageApi.success('更新成功');
                props.onOk();
            } else {
                messageApi.success(response.message || '更新失败');
            }
        } else {
            const response = await BlogLabelCreate(formData);
            if (response.code === 200) {
                messageApi.success('创建成功');
                props.onOk();
            } else {
                messageApi.success(response.message || '创建失败');
            }
        }
    }

    return <Modal title="博客标签" open={props.open} onOk={handleOk} onCancel={props.onCancel}>
        {contextHolder}
        <Form
            name="basic"
            labelCol={{ span: 4 }}
            autoComplete="off"
            form={form}
            initialValues={props.label}
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
                <Input />
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