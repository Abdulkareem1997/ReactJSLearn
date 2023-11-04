import React, { useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import "./MultiSelectComponent.css";
import Paper from '@mui/material/Paper';

interface Props {
    options:string[],
    onChange:any,
    disable: boolean,
    multiType: string
}
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const options = ['All types','MCQ','Subjective','Match the following','FIB','Short answer','Long answer']

const MultiSelectComponent: React.FC<Props> = ({ options, onChange,disable, multiType }) => {
    const [disableOptionType, setDisableOptionType] = useState<any>([])
    const [disableAllOption, setDisableAllOption] = useState<any>(Boolean)

    /*To get the Index Of selected Value(-1 is Used For Replace All Types Option)*/
    const gettingIndex = (array: string[]) => {
        if (array.length){
            return array.map((element: string) => options.indexOf(element) -1)
        }else{
            return []
        }
    }

    /*Selection Of All Values When All Types Option Clicked*/
    const selectAllIndex = () => {
        if (options.length) {
            const tempArray = options.map((element: string) => {
                if (element !== "All types") {
                    return options.indexOf(element) - 1
                }
            })
            return tempArray.filter((ele: any) => ele !== undefined)
        }
        else {
            return []
        }
    }
    return (
        <div className={`${disable ? "disableWrapper" : ""} ${multiType == "Multi1" ? "multiSelectDropdown" : "multiSelectDefaultCheck"}`}>
            <Autocomplete
                // defaultValue={[options[1],options[3]]}
                onChange={(event, newValue) => {
                    newValue.includes("All types") ? setDisableAllOption(true) : setDisableAllOption(false);
                    if(newValue.length > 0 && !newValue.includes("All types")){
                        onChange(gettingIndex(newValue))
                        setDisableOptionType(options[0]) 
                    }else if(newValue.includes("All types")){
                        onChange(selectAllIndex())
                        setDisableOptionType([])
                    }else{
                        onChange(newValue)
                        setDisableOptionType([])
                        onChange([])
                    }
                }}
                multiple
                limitTags={2}
                id="checkboxes-tags-demo"
                options={options}
                disableCloseOnSelect
                getOptionDisabled={(option) =>
                    option === (disableAllOption ? option === "All types" ? "" : option : disableOptionType)
                }
                getOptionLabel={(option) => option}
                renderOption={(props, option, { selected }) => (
                    <li {...props}>
                    <Checkbox
                        icon={icon}
                        checkedIcon={checkedIcon}
                        style={{ marginRight: 8 }}
                        checked={selected ? selected : disableAllOption ? true : false}
                    />
                    {option}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField {...params} label="All Question type" />
                )}
            />
        </div>
    );
};

export default MultiSelectComponent;