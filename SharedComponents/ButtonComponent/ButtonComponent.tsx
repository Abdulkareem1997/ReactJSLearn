import React, { FC, } from 'react'
import Button from '@mui/material/Button';
import styles from "./ButtonComponent.module.css";
type Props = {
    disabled?: boolean;
    type: any;
    label: string;
    textColor: string;
    buttonSize: any;
    icon?: any;
    image?: any;
    backgroundColor?: string
    minWidth: string
    onClick?: () => void;
    status?: string
    addRow?:Boolean
    endIcon?:any
}
const ButtonComponent: FC<Props> = ({ label, type, icon, disabled, backgroundColor, onClick, textColor, buttonSize, image, minWidth, status,addRow,endIcon }) => {
    const handleClick = () => {
        onClick && onClick();
    }
    return (
        <Button
            className={`${styles.buttonCompStyling} btnCompStyle ${disabled ? "disableWrapper" : ""}`}
            style={{ "background": `${type == "contained" ? backgroundColor : ""}`, "height": (buttonSize === "Large" ? "50px" : buttonSize === "Medium" ? "40px" : "30px"), "minWidth": minWidth + "px","padding": `${addRow && "6px"}` }}
            variant={type ? type : ''}
            startIcon={icon ? icon : ''}
            endIcon={endIcon ? endIcon :''}
            type={status === "submit" ? "submit" : "button"}
            sx={{
                textTransform: "none",
                borderRadius: "8px",
                color: (textColor),
                borderColor: ((type == "outlined" && !disabled ) ? backgroundColor : (type == "outlined" && icon == "" && image == "") ? backgroundColor : "transparent"),
                ":hover": {
                    backgroundColor: ((type === "outlined" || type == "transparent") ? "transparent" : backgroundColor),
                    color: "",
                    borderColor: ((type === "outlined" || type == "conatined") ? backgroundColor : "transparent")
                }
            }}
            onClick={handleClick}
        >
            {image && <img className='me-2' width="18px" src={image} />} {label}
        </Button>
    )
}
export default ButtonComponent;