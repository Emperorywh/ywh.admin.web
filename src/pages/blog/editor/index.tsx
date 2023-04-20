import { Button } from "antd";
import styles from "./index.less";
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { Editor, Toolbar } from '@wangeditor/editor-for-react'
import { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor/editor'
import { useEffect, useState } from "react";

/**
 * 【博客】富文本编辑器
 * @returns 
 */
const EditorComp: React.FC = () => {
    // editor 实例
    const [editor, setEditor] = useState<IDomEditor | null>(null)   // TS 语法
    // 编辑器内容
    const [html, setHtml] = useState('<p>hello</p>');
    // 工具栏配置
    const toolbarConfig: Partial<IToolbarConfig> = {}  // TS 语法
    // 编辑器配置
    const editorConfig: Partial<IEditorConfig> = {    // TS 语法
        placeholder: '请输入内容...',
    }

    // 及时销毁 editor ，重要！
    useEffect(() => {
        return () => {
            if (editor == null) return
            editor.destroy()
            setEditor(null)
        }
    }, [editor])

    return <div className={styles.editor_container}>
        <div className={styles.editor_top}>
            <div className={styles.editor_header}>
                <div className={styles.editor_logo}>
                    <img src="/logo.svg"></img>
                </div>
                <div className={styles.editor_btns}>
                    <Button type="default" style={{ marginRight: '10px' }}>保存到本地</Button>
                    <Button type="primary">发布</Button>
                </div>
            </div>
        </div>
        <div className={styles.editor_body}>
            <div className={styles.editor_content}>
                <Toolbar
                    editor={editor}
                    defaultConfig={toolbarConfig}
                    mode="default"
                    style={{ borderBottom: '1px solid #ccc' }}
                />
                <Editor
                    defaultConfig={editorConfig}
                    value={html}
                    onCreated={setEditor}
                    onChange={editor => setHtml(editor.getHtml())}
                    mode="default"
                    style={{ height: '500px', overflowY: 'hidden' }}
                />
            </div>

        </div>

    </div>
}

export default EditorComp;