import { BlogClassifyCreate, BlogClassifyUpdate, IBlogClassify } from "@/api/BlogClassify";
import { Form, Input, message, Modal, Select } from "antd";
import { useEffect } from "react";

interface IProps {
    open: boolean;
    onOk: () => void;
    onCancel: () => void;
    classify?: IBlogClassify
}

const CreateUpdateForm: React.FC<IProps> = (props) => {
    //表单实例
    const [form] = Form.useForm();
    const [messageApi, contextHolder] = message.useMessage();

    const handleOk = async () => {
        const formData: IBlogClassify = await form.validateFields();
        if (formData._id) {
            const response = await BlogClassifyUpdate(formData);
            if (response.code === 200) {
                messageApi.success('更新成功');
                props.onOk();
            } else {
                messageApi.success(response.message || '更新失败');
            }
        } else {
            const response = await BlogClassifyCreate(formData);
            if (response.code === 200) {
                messageApi.success('创建成功');
                props.onOk();
            } else {
                messageApi.success(response.message || '创建失败');
            }
        }
    }

    const initForm = () => {
        if (props.classify) {
            form.setFieldsValue(props.classify);
        } else {
            form.resetFields();
        }
    }

    useEffect(() => {
        initForm();
    }, [props.classify]);

    return <Modal destroyOnClose title="博客分类" open={props.open} onOk={handleOk} onCancel={props.onCancel}>
        {contextHolder}
        <Form
            name="basic"
            labelCol={{ span: 4 }}
            autoComplete="off"
            form={form}
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
                        { value: 0, label: '停用' },
                        { value: 1, label: '启用' }
                    ]}
                />
            </Form.Item>
        </Form>
    </Modal>
}

export default CreateUpdateForm;