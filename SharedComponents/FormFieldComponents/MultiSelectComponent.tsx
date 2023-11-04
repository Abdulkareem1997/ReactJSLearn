import React, { useEffect, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import "../MultiSelectComponent/MultiSelectComponent.css";
import Paper from '@mui/material/Paper';
import "./FormFieldComponents.css"
import { useFormContext, Controller } from "react-hook-form"

interface Props {
    options: any[],
    onChange: any,
    disable: boolean,
    mandatory?: boolean,
    multiType: string,
    multiLabel: string,
    registerName: string,
    showableLabel?: string,
    showableData?: string
}
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const options = ['All types', 'MCQ', 'Subjective', 'Match the following', 'FIB', 'Short answer', 'Long answer']

const MultiSelectComponentForForm: React.FC<Props> = ({ options, registerName, onChange, disable, mandatory, multiType, multiLabel, showableLabel, showableData }) => {
    const [validation, setValidation] = useState(mandatory ? { required: "This Field is Required" } : {})
    const {  getValues, control ,setError,clearErrors} = useFormContext()
    const checkChecked = (value: number) => {
        return getValues(registerName)?.some((ele: any) => value === ele.errorTypeId)
    }

    return (
        <div className={`${disable ? "disableWrapper" : ""} ${multiType == "Multi1" ? "multiSelectDropdown" : "multiSelectDefaultCheck selectFillType"}`}>
            <Controller
                rules={validation}
                control={control}
                name={registerName}
                render={({ field: { onChange, value,ref }, formState, fieldState }) => {
                    const handleChange = (data: any[]) => {
                        const temp = data.map((ele: any) => {
                            return { errorTypeId: ele.id }
                        })
                        onChange(temp)
                        if (data.length === 0 && mandatory) {
                            setError(registerName,{type:"required",message:"This field is required"})
                        }else(
                            clearErrors(registerName)
                        )
                    }
                    
                    const valued = value ? value?.map((val: any) => {
                        const tempData = options?.find((ele: any) => ele.id === val.errorTypeId);
                        return tempData
                    }) : []
                    return (
                        <Autocomplete
                            onChange={(event, newValue) => {
                                handleChange(newValue)
                            }}
                            multiple
                            limitTags={2}
                            id="checkboxes-tags-demo"
                            options={options? options : []}
                            value={valued}
                            disableCloseOnSelect
                            getOptionLabel={(option) => {
                                return showableLabel ? option?.[showableLabel] : option
                            }}
                            renderOption={(props, option, { selected }) => (

                                <li {...props} value={showableData ? option?.[showableData] : option}>
                                    <Checkbox
                                        icon={icon}
                                        checkedIcon={checkedIcon}
                                        checked={checkChecked(showableData ? option?.[showableData] : option) ? true:false}
                                        style={{ marginRight: 8 }}
                                        value={showableData ? option?.[showableData] : option}
                                    />
                                    {showableLabel ? option?.[showableLabel] : option}
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField {...params} label={multiLabel}  inputRef={ref}/>
                            )}
                        />
                    )
                }}
            />

        </div>
    );
};

export default MultiSelectComponentForForm;