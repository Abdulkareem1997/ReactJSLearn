import React from 'react';
import styles from "./ActionButtonComponent.module.css";
import RroundedActions from "../../../assets/images/RroundedActions.svg";
import Delete from "../../../assets/images/delete.svg"
import Edit from "../../../assets/images/edit.svg";
import { Tooltip } from '@mui/material';

interface Props{
    disableBtn: boolean,
    dataList:any,
    modalOpen:(param:boolean) => void,
    getKeyId:(param:any) => void,
    editKey:(param:any) => void,
    duplicateKey:(param:any) => void,
};

const ActionButtonComponent:React.FC<Props> =({disableBtn,dataList,modalOpen,getKeyId,editKey,duplicateKey})=>{
    const getKey = (d: any) => {
        modalOpen(true);
        getKeyId(d)                
    };
    return (
        <div className={styles.actionButtonComp}>
            <Tooltip title={`Duplicate`} arrow >
               <img src={RroundedActions} onClick={()=>duplicateKey(dataList)} />
            </Tooltip>
            <Tooltip title={`Edit`} arrow >
            <img className={`${disableBtn ? styles.imgDisable : ""}`} style={{cursor:"pointer"}} src={Edit} onClick={()=>editKey(dataList)}/>
            </Tooltip>
            <Tooltip title={`Delete`} arrow >
            <img className={`${disableBtn ? styles.imgDisable : ""}`} style={{cursor:"pointer"}} src={Delete} onClick={(e) => {getKey(dataList);e.stopPropagation()  }} />
            </Tooltip>            
        </div>
    );
};

export default ActionButtonComponent;