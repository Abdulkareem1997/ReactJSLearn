import React from 'react';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import "../InputFieldComponent/InputFieldComponent.css"
import { useFormContext, Controller } from "react-hook-form"

interface Props {
    label: string;
    required: boolean;
    onChange: any;
    inputSize: string,
    variant: string,
    inputType: string,
    registerName: string,
    maxLimit?:number,
    maxLength?:number,
    steps?:number
};
const InputFieldComponentForForm: React.FC<Props> = ({ label, onChange, required, inputSize, variant, inputType, registerName, maxLimit, maxLength,steps }) => {
    const { control, getValues } = useFormContext();
    const [validation, setValidation] = useState(required ? { required: "This Field is Required" } : {})
    // const [inputVal, setInputVal] = useState("")
    // const checkFirstString = (event:any) => {
    //     return event.target.value.length == 0
    // }
    return (
        <div className={`inputFieldStylingSect ${variant == "searchIcon" ? "searchIconSect" : ""}`}>
            <Controller
                name={registerName}
                rules={validation}
                control={control}
                render={({ field: { onChange, value, ref } }) => {
                    const handleContentChanges = (data: string) => {
                        if (inputType === "number") {
                            if (Number(data) > 0 && Number(data) <= Number(maxLimit)) {
                                if ((/^\d{0,4}\.\d{1,2}$|^\d{0,4}$/g.test(data))) {
                                    onChange(data)
                                }
                            } else if (data === "") {
                                onChange(data)
                            }
                        } else {
                            onChange(data)
                        }
                    }
                    return (
                        <TextField
                            className={`inputFieldStyling ${inputSize == "Medium" ? "mediumSize" : "largeSize"}`}
                            // {...register(registerName)}
                            inputRef={ref}
                            // required={required}
                            autoComplete='off'
                            value={getValues(registerName) ? getValues(registerName) : ""}
                            label={`${label} ${required ? "*" : ""}`}
                            onChange={(e) => {
                                handleContentChanges(e.target.value);
                                // setInputVal(e.target.value)
                            }}
                             InputProps={{ inputProps: { type: inputType, min: 1, max: maxLimit,step:steps, maxLength: maxLength  } }}
                            type={inputType}
                            onKeyDown={ (evt:any) => {
                                if (label == 'Marks' || label == 'Time in minutes') {
                                    if ( ["e", "E", "+", "-"].includes(evt.key)) {
                                        evt.preventDefault()
                                    }
                            }}}
                        // onKeyPress={(event) => {
                        //         console.log(event.which)
                        //         if((checkFirstString(event) && event.which == 48) || event.which == 45 || event.which == 43 || event.which == 101 || (!(/^\d{0,2}\.\d{1,2}$|^\d{0,2}$/g.test(inputVal)) && inputType === "number")){
                        //             event.preventDefault();
                        //         }
                        //     }}
                        // onKeyUp={(event) => {
                        //     if (inputType === "number") {
                        //         if(!(/^\d{0,2}\.\d{1,2}$|^\d{0,2}$/g.test(inputVal)) ){
                        //             setInputVal(inputVal.substring(0, inputVal.length-1))
                        //             event.preventDefault();
                        //         }
                        //     }
                        // }}
                        />
                    )
                }}
            />
        </div>
    );


}


export default InputFieldComponentForForm;
