import React from 'react';
import TextField from '@mui/material/TextField';
import { useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import "./InputFieldComponent.css"
import SearchIcon from '@mui/icons-material/Search';

interface Props{
    label:string;
    required:boolean;
    onChange:any;
    inputSize:string,
    variant:string,
    inputType: string
};
const InputFieldComponent :React.FC<Props> =({label,onChange,required,inputSize,variant, inputType})=>{

    return (
        <div className={`inputFieldStylingSect ${variant == "searchIcon" ? "searchIconSect" : ""}`}>
            <TextField
                className={`inputFieldStyling ${inputSize == "Medium" ? "mediumSize" : "largeSize"}`}
                required={required}
                label={label}
                onChange={onChange}
                type={inputType}
                autoComplete='off'
            />
            
        </div>
    );


}


export default InputFieldComponent;
