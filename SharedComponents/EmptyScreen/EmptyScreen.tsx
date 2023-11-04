import React, { FC, } from 'react'
import AssessEmptyImage from "../../../assets/images/assessEmptyImage.png";
import styles from "./EmptyScreen.module.css";
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';

type Props = {
    emptyBtnTxt: string;
    title: string,
    desc: string,
    onClickBtn: () => void;
}
const EmptyScreen: FC<Props> = ({ emptyBtnTxt, title, desc, onClickBtn }) => {
    let history = useNavigate();
    const handleButtonClick = () => {
        onClickBtn();
    }

    return (
        <div className={styles.emptySectionScroll}>
            <div className={styles.emptySection}>
                <img src={AssessEmptyImage} />
                <h2>{title}</h2>
                <h4>{desc}</h4>
                <div className='mt-3'>
                    <ButtonComponent icon={<AddIcon/>} image={""} textColor ="" backgroundColor="#01B58A" disabled={false} buttonSize="Medium" type="contained" onClick={handleButtonClick} label={emptyBtnTxt} minWidth="" />
                </div>
                
            </div>
        </div>
        
    );
};

export default EmptyScreen;