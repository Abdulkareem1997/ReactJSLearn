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
import { v4 as uuidv4 } from 'uuid';

declare global {
    interface Window {
        katex: any;
    }
}
interface ArrayObject {
    id: any;
    index: number;
    labelId: number
}
interface TextProps {
    textEditorSize: string,
    mandatory?: boolean,
    registerName: string,
    fillInTheBlanks?: boolean,
    setUniqueArr: any;
    uniqueArr: any[];
    isEdit: boolean;
    compIndex?: number | undefined;
}

const FIBTextEditor: React.FC<TextProps> = ({ textEditorSize, mandatory, registerName, fillInTheBlanks, setUniqueArr, uniqueArr, isEdit, compIndex }) => {
    const { register, setValue, setError, watch, clearErrors, control, getValues, unregister } = useFormContext();
    const [validation, setValidation] = useState(mandatory ? { required: "This Field is Required" } : {})
    const quillRef = useRef<ReactQuill>(null);
    const [quill, setQuill] = useState<any>(null);
    const [firstRender, setFirstRender] = useState<boolean>(true);
    window.katex = katex;
    const Quill = ReactQuill.Quill
    var Font = Quill.import('formats/font');
    Font.whitelist = ['Sans Serif', 'Raleway', 'Roboto', "MonoSpace"];
    Quill.register(Font, true);
    const [content, setContent] = useState('');
    const CustomButton = () => {
        console.log("clicked")
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
            },
            blank: true,
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

    const formattedResult = (data: ArrayObject[]) => {
        let indexArray = data.map((ele: ArrayObject) => ele.index)
        indexArray.sort((a: number, b: number) => {
            return a - b;
        });
        const settedArray = indexArray.map((ele: number) => {
            return data.find((element: ArrayObject) => element.index === ele)
        })
        return settedArray
    }
    
    const sortArrayWithOrder=(list:any)=>{
        let indexArray = list.map((ele: any) => ele.order)
        indexArray.sort((a: number, b: number) => {
            return a - b;
        });
        const settedArray = indexArray.map((ele: number) => {
            return list.find((element: any) => element.order === ele)
        })
        return settedArray
    }

    const getEditUniqueArr = () => {
        const quillDelta = quill.editor.getContents()
        let innerIndex = 0
        const finalArray: ArrayObject[] = []
        quillDelta.ops.map((ele: any, index: number) => {
            const id = uuidv4();
            if (typeof ele.insert === "string") {
                innerIndex = innerIndex + ele.insert.length
            } else if ("formula" in ele.insert) {
                if (ele.insert.formula !== "_______________") {
                    innerIndex = innerIndex + 1
                } else {
                    finalArray.push({ index: innerIndex, id: id, labelId: finalArray.length ? finalArray[finalArray.length - 1].labelId + 1 : 0 })
                    innerIndex += 1
                }
            }
        })
        setUniqueArr(finalArray)
    }
    
    useEffect(() => {
        if (quill && isEdit && firstRender && (getValues("blankMetaInfo") || getValues(`blankMetaInfo_${compIndex}`))) {
            setFirstRender(false)
            getEditUniqueArr()
            if(getValues("blankMetaInfo")){
                console.log("hii")
                setValue("blankMetaInfo",sortArrayWithOrder(getValues("blankMetaInfo")))
            }else{
                setValue(`blankMetaInfo_${compIndex}`,sortArrayWithOrder(getValues(`blankMetaInfo_${compIndex}`)))
            }
        }
    }, [getValues("blankMetaInfo"), getValues(`blankMetaInfo_${compIndex}`),quill])

    useEffect(() => {
        register(compIndex ? `blankMetaInfo_${compIndex}` : 'blankMetaInfo', { required: "Atleast one blank is required" })
    }, [register])

    return (
        <div className={`text-editor-component ${textEditorSize == "Medium" ? "textHeightMedium" : "textHeightSmall"}`}>
            <Controller
                rules={validation}
                control={control}
                name={registerName}
                render={({ field: { onChange, value, ref }, formState, fieldState }) => {
                    if (uniqueArr.length && quill) {
                        quill?.editor?.on('selection-change', function (range: any, oldRange: any, source: any) {
                            const totalIndex = uniqueArr?.map((ele: any) => ele.index)
                            if (range && range.length == 0) {
                                if (totalIndex.includes(range.index)) {
                                    quill?.editor?.setSelection(range.index + 2)
                                } else if (totalIndex.includes(range.index - 1)) {
                                    quill?.editor?.setSelection(range.index + 1)
                                } else {
                                    quill?.editor?.setSelection(range.index)
                                }
                            }
                        })
                    }
                    const handleContentChange = (content: any, delta: any, source: any, editor: any) => {
                        setContent(content)
                        const id = uuidv4();
                        const selection: any = quill?.editor?.getSelection()?.index
                        if (delta?.ops?.length > 1) {
                            if ((delta?.ops?.length == 2 && JSON.stringify(delta?.ops[0]) == '{"insert":{"formula":"_______________"}}') || JSON.stringify(delta?.ops[1]) == '{"insert":{"formula":"_______________"}}') {
                                let label = 0
                                if (uniqueArr?.length) {
                                    label = Math.max(...uniqueArr.map((ele: any) => ele?.labelId))
                                }
                                const indexChanged = uniqueArr.map((element: any) => {
                                    if (element?.index > delta.ops[0].retain || element?.index == delta.ops[0].retain) {
                                        element.index = element?.index + 2
                                        return element
                                    } else {
                                        return element
                                    }
                                })
                                setUniqueArr(formattedResult([...indexChanged, { index: delta.ops[0].retain ? delta.ops[0].retain : 0, id: id, labelId: label + 1 }]))
                            } else if ("delete" in delta.ops[1]) {
                                const startIndex = delta.ops[0].retain
                                const endIndex = delta.ops[1].delete !== 1 ? delta.ops[1].delete + delta.ops[0].retain : delta.ops[0].retain
                                const tempArray = delta.ops[1].delete == 1 ? uniqueArr?.filter((ele: any) => (ele?.index !== startIndex)) : uniqueArr?.filter((ele: any) => (ele?.index < startIndex || ele?.index > endIndex))
                                const differentObjects = uniqueArr?.filter((obj1: any) => !tempArray?.find((obj2: any) => obj1?.id === obj2?.id))
                                if (differentObjects?.length) {
                                    differentObjects.map((ele: any) => {
                                        // unregister(`blankMetaInfo.${ele?.labelId}`)
                                        unregister(compIndex ? `blankMetaInfo_${compIndex}.${ele?.labelId}` : `blankMetaInfo.${ele?.labelId}`)
                                    })
                                }
                                const indexChanged = tempArray.map((element: any) => {
                                    if (element?.index > startIndex) {
                                        element.index = element?.index - delta.ops[1].delete
                                        return element
                                    } else {
                                        return element
                                    }
                                })
                                setUniqueArr(formattedResult(indexChanged))
                            } else {
                                const indexChanged = uniqueArr.map((element: any) => {
                                    if (element?.index > delta.ops[0].retain || element?.index == delta.ops[0].retain) {
                                        element.index = element?.index + 1
                                        return element
                                    } else {
                                        return element
                                    }
                                })
                                setUniqueArr(formattedResult(indexChanged))
                            }
                        } else if ("delete" in delta.ops[0]) {
                            const startIndex = 0
                            const endIndex = delta.ops[0].delete !== 1 ? delta.ops[0].delete + 0 : 0
                            const tempArray = delta.ops[0].delete == 1 ? uniqueArr?.filter((ele: any) => (ele?.index !== startIndex)) : uniqueArr?.filter((ele: any) => (ele?.index < startIndex || ele?.index > endIndex))
                            const differentObjects = uniqueArr?.filter((obj1: any) => !tempArray?.find((obj2: any) => obj1?.id === obj2?.id))
                            if (differentObjects?.length) {
                                differentObjects.map((ele: any) => {
                                    // unregister(`blankMetaInfo.${ele?.labelId}`)
                                    unregister(compIndex ? `blankMetaInfo_${compIndex}.${ele?.labelId}` : `blankMetaInfo.${ele?.labelId}`)
                                })
                            }
                            const indexChanged = tempArray.map((element: any) => {
                                if (element?.index > startIndex) {
                                    element.index = element?.index - delta.ops[0].delete
                                    return element
                                } else {
                                    return element
                                }
                            })
                            setUniqueArr(formattedResult(indexChanged))
                        } else {
                            if (JSON.stringify(delta.ops[0]) == '{"insert":{"formula":"_______________"}}') {
                                setUniqueArr(formattedResult([...uniqueArr, { index: 0, id: id, labelId: uniqueArr.length ? uniqueArr[uniqueArr.length - 1].labelId + 1 : 1 }]))
                            } else if ("delete" in delta.ops[0]) {
                                setUniqueArr([])
                            }
                        }
                        if (content == "<p><br></p>" && mandatory) {
                            onChange("")
                        } else {
                            onChange(content)
                        }
                    }
                    const insertBlank = () => {
                        const selection: any = quill.editor.getSelection();
                        quill.editor.pasteHTML(selection?.index, '<p><span class="ql-formula color-black" data-value="_______________"><span contenteditable="false" ><span></span><span style="color:#000">_______________</span></span></span>&nbsp;</p>', "api");
                    }
                    return (
                        <>
                            <ReactQuill
                                ref={(el: any) => {
                                    setQuill(el);
                                }}
                                theme="snow"
                                modules={modules}
                                placeholder={" Start typing..."}
                                value={value ? value : editorContent}
                                formats={formats}
                                onChange={handleContentChange}
                                id={getIdName()}
                            />
                            {
                                fillInTheBlanks &&
                                <div className="allstudents-footer">
                                    <div className="allstudents-label">
                                        <Typography>
                                            Insert
                                        </Typography>
                                    </div>
                                    <span className='dividers'></span>
                                    <div className="allstudentActionBtn">
                                        <ButtonComponent icon={""} image={""} textColor="#385DDF" backgroundColor="#E8EEFD" disabled={uniqueArr.length > 2 ? true : false} buttonSize="small" type="contained" onClick={() => { insertBlank() }} label="___(Blank)____" minWidth="200" />
                                    </div>
                                </div>
                            }
                        </>
                    )
                }}
            />
        </div>)
}

export default FIBTextEditor