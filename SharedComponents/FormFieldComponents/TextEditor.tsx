import React, { useEffect, useMemo, useRef, useState } from 'react'
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "../TextEditor/TextEditor.css";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import 'react-quill/dist/quill.snow.css';
import "react-quill/dist/quill.core.css";
import "react-quill/dist/quill.bubble.css";
import { useFormContext, Controller } from "react-hook-form"
import { Typography } from '@mui/material';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import underLineIcon from '../../../assets/images/underLine.svg'

declare global {
    interface Window {
        katex: any;
    }
}
interface TextProps {
    textEditorSize: string,
    mandatory?: boolean,
    registerName: string,
    fillInTheBlanks?: boolean,
}
const TextEditorForForm: React.FC<TextProps> = ({ textEditorSize, mandatory, registerName, fillInTheBlanks }) => {
    const { register, setValue, setError, watch, clearErrors, control, getValues } = useFormContext();
    const [validation, setValidation] = useState(mandatory ? { required: "This Field is Required" } : {})
    const quillRef = useRef<ReactQuill>(null);
    const [quill, setQuill] = useState<any>(null);
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
        console.log("clicked", isShow)
    }   
    const editorContent = watch(registerName);

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
    const handleContentChange = (value: any) => {
        setContent(value)
        if (value == "<p><br></p>" && mandatory) {
            setValue(registerName, null)
            register(registerName, validation);
            // setError(registerName, { type: 'required', message: 'This field is required' });
        } else {
            clearErrors(registerName)
            setValue(registerName, value)
        }
    }
    const handleChange = (content: any, delta: any, source: any, editor: any) => {
        setContent(editor.getContents())
    }
    function quillGetHTML(inputDelta: any) {
        var tempCont = document.createElement("div");
        (new Quill(tempCont)).setContents(inputDelta);
    }

    const getIdName = () => {
        if (fillInTheBlanks as Boolean) {
            return "quill_blanks" as string
        } else {
            return "" as string
        }
    };

    return (

        <div className={`text-editor-component ${textEditorSize == "Medium" ? "textHeightMedium" : "textHeightSmall"}`}>
            <Controller
                rules={validation}
                control={control}
                name={registerName}
                render={({ field: { onChange, value, ref }, formState, fieldState }) => {
                    const handleContentChange = (value: any) => {
                        setContent(value)
                        if (value == "<p><br></p>" && mandatory) {
                            onChange("")
                        } else {
                            clearErrors(registerName)
                            onChange(value)
                        }
                    }
                    return (
                        <>
                            <ReactQuill
                                ref={(el: any) => {
                                    setQuill(el);
                                }}
                                theme="snow"
                                modules={modules}
                                placeholder={"Start typing..."}
                                value={getValues(registerName) ?? ""}
                                formats={formats}
                                onChange={handleContentChange}
                                id={getIdName()}
                            />
                        </>
                    )
                }}
            />
        </div>)
}

export default TextEditorForForm