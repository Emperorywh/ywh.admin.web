import { Button, Form, Input, Radio, Select, Spin, Upload, message } from "antd";
import styles from "./index.less";
import Vditor from 'vditor';
import "vditor/dist/index.css";
import { useEffect, useState } from "react";
import { BlogClassifyPageQuery, IBlogClassify } from "@/api/BlogClassify";
import { BlogLabelPageQuery, IBlogLabel } from "@/api/BlogLabel";
import type { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { LeftOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { BlogCreate, BlogFindById, BlogUpdate, IBlog } from "@/api/Blog";
import { history, useSearchParams } from '@umijs/max';
const token = localStorage.getItem('USER_TOKEN');
/**
 * 博客标签 多选框数据类型
 */
interface IBlogLabelCheckBox extends IBlogLabel {
    label: string;
    value: string;
    disabled?: boolean;
}

/**
 * 【博客】富文本编辑器
 * @returns 
 */
const EditorComp: React.FC = () => {
    //是否加载中
    const [showLoading, setShowLoading] = useState(false);
    //url取值
    const [searchParams, setSearchParams] = useSearchParams();
    //博客form实例
    const [blogForm] = Form.useForm();
    // editor 实例
    const [vd, setVd] = useState<Vditor>();
    //消息实例
    const [messageApi, contextHolder] = message.useMessage();
    //博客分类列表
    const [classifyList, setClassifyList] = useState<IBlogClassify[]>([]);
    //博客标签列表
    const [labelList, setLabelList] = useState<IBlogLabelCheckBox[]>([]);
    //封面
    const [imageUrl, setImageUrl] = useState<string>();
    //上传加载中
    const [loading, setLoading] = useState(false);

    /**
     * 获取博客分类
     */
    const onFetchBlogClassify = async () => {
        const response = await BlogClassifyPageQuery({
            pageIndex: 1,
            pageSize: 20
        });
        if (response.code === 200) {
            setClassifyList(response.data.items);
        } else {
            messageApi.error(response.message || '获取博客分类失败');
        }
    }

    /**
     * 获取博客标签
     */
    const onFetchBlogLabel = async () => {
        const response = await BlogLabelPageQuery({
            pageIndex: 1,
            pageSize: 20,
        });
        if (response.code === 200) {
            response.data.items.forEach((item: IBlogLabelCheckBox) => {
                item.label = item.name;
                item.value = item._id as string;
                item.disabled = item.status === 0;
            })
            setLabelList(response.data.items);
        } else {
            messageApi.error(response.message || '获取博客标签失败');
        }
    }

    /**
     * 上传前的校验
     * @param file 
     * @returns 
     */
    const beforeUpload = (file: RcFile) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传图片格式文件');
        }
        const isLt2M = file.size / 1024 / 1024 < 5;
        if (!isLt2M) {
            message.error('图片必须小于 5MB!');
        }
        return isJpgOrPng && isLt2M;
    };

    /**
     * 上传按钮
     */
    const uploadButton = (
        <div className={styles.upload_btn}>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div>上传封面</div>
        </div>
    );

    /**
     * 文件上传状态改变
     * @param info 
     * @returns 
     */
    const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            setLoading(false);
            if (info.file.response.code === 200) {
                setImageUrl(info.file.response.data);
                messageApi.success("上传成功");
                blogForm.setFieldValue("cover", info.file.response.data);
            } else {
                messageApi.error(info.file.response.message || "上传失败");
            }
        }
    };

    /**
     * 发布博客
     */
    const handleSendBlog = async () => {
        const content = vd?.getValue();
        if (!content) {
            messageApi.error("正文内容不能为空");
            return;
        }
        const formData: IBlog = await blogForm.validateFields();
        const jsonData: IBlog = {
            _id: formData._id,
            title: formData.title,
            abstract: formData.abstract,
            content,
            classification: formData.classification,
            label: formData.label,
            cover: formData.cover,
            author: formData.author
        }
        if (jsonData._id) {
            setShowLoading(true);
            const response = await BlogUpdate(jsonData);
            setShowLoading(false);
            if (response.code === 200) {
                messageApi.success("修改成功！");
                history.back();
            } else {
                message.error(response.message || "修改失败");
            }
        } else {
            setShowLoading(true);
            const response = await BlogCreate(jsonData);
            setShowLoading(false);
            if (response.code === 200) {
                messageApi.success("发布成功！");
                history.back();
            } else {
                message.error(response.message || "发布失败");
            }
        }
    }

    /**
     * 初始化博客信息
     */
    const onFetchBlogInfo = async () => {
        const blogId = searchParams.get('blogId');
        if (blogId) {
            const response = await BlogFindById(blogId);
            const { blog } = response.data;
            if (response.code === 200) {
                const classification = blog.classification._id;
                const label: string[] = [];
                blog.label.forEach((item: IBlogLabel) => {
                    label.push(item._id as string);
                });
                blogForm.setFieldsValue({
                    ...blog,
                    classification,
                    label,
                    author: blog.author._id
                });
                setImageUrl(blog.cover);
                if (vd) {
                    vd?.setValue(blog.content);
                }
            } else {
                messageApi.error(response.message || "查询博客信息失败");
            }
            window.scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            })
        }
    }

    /**
     * 初始化富文本编辑器
     */
    const oninitVditior = async () => {
        const vditor = new Vditor("vditor", {
            placeholder: "请输入正文内容！",
            cache: {
                enable: false
            },
            after: () => {
                setVd(vditor);
            },
            upload: {
                url: "/apis/user/uploadBlogImage",
                headers: {
                    Authorization: token || ''
                },
                multiple: false,
                fieldName: 'file'
            }
        });
    }

    useEffect(() => {
        oninitVditior();
    }, []);

    useEffect(() => {
        if (vd) {
            onFetchBlogClassify();
            onFetchBlogLabel();
            onFetchBlogInfo();
        }
    }, [vd]);

    return <div className={styles.editor_container}>
        {contextHolder}
        <Spin size="large" spinning={showLoading}>
            <div className={styles.editor_top}>
                <div className={styles.editor_header}>
                    <LeftOutlined className={styles.editor_top_back} onClick={() => history.back()} />
                    <div className={styles.editor_btns}>
                        <Button type="default" style={{ marginRight: '10px' }}>保存到本地</Button>
                        <Button type="primary" onClick={handleSendBlog}>发布</Button>
                    </div>
                </div>
            </div>
            <div className={styles.editor_body}>
                <Form
                    name="basic"
                    labelCol={{ span: 2 }}
                    onFinish={() => { }}
                    style={{ width: '1200px', marginTop: '30px' }}
                    autoComplete="off"
                    size="large"
                    form={blogForm}
                >
                    <Form.Item
                        label="id"
                        name="_id"
                        hidden
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="author"
                        name="author"
                        hidden
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="标题"
                        name="title"
                        rules={[{ required: true, message: '请输入标题！' }]}
                    >
                        <Input placeholder="请输入标题！" />
                    </Form.Item>
                    <Form.Item
                        label="摘要"
                        name="abstract"
                        rules={[{ required: true, message: '请输入摘要！' }]}
                    >
                        <Input.TextArea placeholder="请输入摘要！" autoSize />
                    </Form.Item>
                    <Form.Item
                        label="分类"
                        name="classification"
                        rules={[{ required: true, message: '请选择分类！' }]}
                    >
                        <Radio.Group buttonStyle="solid">
                            {
                                classifyList.map(item => {
                                    return <Radio.Button key={item._id} value={item._id} disabled={item.status === 0}>{item.name}</Radio.Button>
                                })
                            }
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item
                        label="标签"
                        name="label"
                        rules={[{ required: true, message: '请选择标签！' }]}
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            placeholder="请选择标签！"
                            options={labelList}
                        />
                    </Form.Item>
                    <Form.Item
                        label="封面"
                        name="cover"
                    >
                        <Upload
                            name="file"
                            showUploadList={false}
                            action="/apis/user/uploadImage"
                            beforeUpload={beforeUpload}
                            onChange={handleChange}
                            headers={{
                                Authorization: token || ""
                            }}
                        >
                            {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '160px', height: '86px' }} /> : uploadButton}
                        </Upload>
                    </Form.Item>
                </Form>
                <div className={styles.editor_content}>
                    <div id="vditor" className="vditor" />
                </div>

            </div>
        </Spin>
    </div>
}

export default EditorComp;