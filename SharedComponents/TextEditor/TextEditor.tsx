import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./TextEditor.css";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import 'react-quill/dist/quill.snow.css';
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.bubble.css";

declare global {
    interface Window {
        katex: any;
    }
}
interface TextProps {
    textEditorSize: string,
    mandatory?: boolean,
    setData?: (e: any) => void
}
const TextEditor: React.FC<TextProps> = ({ textEditorSize, mandatory,setData }) => {
    const quillRef = useRef<ReactQuill>(null);
    window.katex = katex;
    const Quill = ReactQuill.Quill
    var Font = Quill.import('formats/font');
    Font.whitelist = ['Sans Serif', 'Raleway', 'Roboto', "MonoSpace"];
    Quill.register(Font, true);
    const [content, setContent] = useState('');
    const [isShow, setIsShow] = useState<boolean>(false)
    const CustomButton = () => {
        let clonedShow = !isShow
        setIsShow(clonedShow)
    }

    const modules = useMemo(() => ({
        toolbar: {
            container: [
                [{ "font": Font.whitelist }],
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                [{ 'script': 'sub' }, { 'script': 'super' }],
                [{ 'indent': '-1' }, { 'indent': '+1' }],
                [{ 'color': [] }, { 'background': [] }],
                ["link", "image"],
                ['formula']
            ],
            handlers: {
                'custom': function () { CustomButton() }
            },
            clipboard: {
                matchVisual: false
            }
        }
    }), [])
    const formats: any = [
        'header', 'font', 'background', 'color', 'code',
        'bold', 'italic', 'underline', 'strike',
        'list', 'bullet', 'indent', 'script', 'align', 'direction',
        'link', 'image', 'code-block', 'formula'
    ]
    const handleProcedureContentChange = (value: any) => {
        console.log(value)
        setData && setData(value)
        setContent(value)
    }
    const handleChange = (content: any, delta: any, source: any, editor: any) => {
        setContent(editor.getContents())
        setData && setData(editor.getContents())
    }
    function quillGetHTML(inputDelta: any) {
        var tempCont = document.createElement("div");
        (new Quill(tempCont)).setContents(inputDelta);
        return tempCont.getElementsByClassName("ql-editor")[0].innerHTML;
    }
    
    return (
        <div className={`text-editor-component ${textEditorSize == "Medium" ? "textHeightMedium" : "textHeightSmall"}`}>
            {/* <div className='text-label h4 fontW600'>{`${label} ${mandatory ? " *" : ""}`}</div> */}
            <ReactQuill
                ref={quillRef}
                theme="snow"
                modules={modules}
                placeholder={"Start typing..."}
                value={content}
                formats={formats}
                onChange={handleProcedureContentChange}                                  
            />
            {/* <EditableMathExample /> */}
            {/* <div dangerouslySetInnerHTML={{ __html: quillGetHTML(content) }}></div> */}
        </div>)
}

export default TextEditor