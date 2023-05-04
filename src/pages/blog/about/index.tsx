import { PageContainer } from "@ant-design/pro-components";
import { Button, message } from "antd";
import { useEffect, useState } from "react";
import Vditor from 'vditor';
import "vditor/dist/index.css";
import styles from "./index.less";
import { PlusOutlined } from "@ant-design/icons";
import { AboutCreate, AboutFindOne, AboutUpdate, type IAbout } from "@/api/About";
const token = localStorage.getItem('USER_TOKEN');

const About: React.FC = () => {
    // editor 实例
    const [vd, setVd] = useState<Vditor>();
    // 关于我
    const [aboutInfo, setAboutInfo] = useState<IAbout>();
    //消息实例
    const [messageApi, contextHolder] = message.useMessage();
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
            minHeight: 700,
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

    /**
     * 查询关于我
     */
    const onFetchAboutMe = async () => {
        const response = await AboutFindOne();
        if (response.code === 200 && response.data) {
            vd?.setValue(response.data.content);
            setAboutInfo(response.data);
        }
    }

    /**
     * 创建/更新 关于我
     */
    const onCreateOrUpdate = async () => {
        if (aboutInfo?._id) {
            const response = await AboutUpdate({
                ...aboutInfo,
                content: vd?.getValue() || ""
            });
            if (response.code === 200) {
                messageApi.success('更新成功');
                onFetchAboutMe();
            } else {
                messageApi.success(response.message || '更新失败');
            }
        } else {
            const response = await AboutCreate({
                ...aboutInfo,
                content: vd?.getValue() || ""
            });
            if (response.code === 200) {
                messageApi.success('创建成功');
                onFetchAboutMe();
            } else {
                messageApi.success(response.message || '创建失败');
            }
        }
    }

    useEffect(() => {
        oninitVditior();
    }, []);

    useEffect(() => {
        if (vd) {
            onFetchAboutMe();
        }
    }, [vd]);

    return <PageContainer>
        {contextHolder}
        <div className={styles.about_header}>
            <Button type="primary" icon={<PlusOutlined />} onClick={onCreateOrUpdate}>
                提交
            </Button>
        </div>
        <div id="vditor" className="vditor" />
    </PageContainer>
}

export default About;