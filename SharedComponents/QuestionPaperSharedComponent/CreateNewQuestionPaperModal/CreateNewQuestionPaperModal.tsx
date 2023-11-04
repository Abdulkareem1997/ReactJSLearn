import React, { FC } from 'react';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button } from '@mui/material';
import './CreateNewQuestionPaperModal.css';
import ButtonComponent from '../../ButtonComponent/ButtonComponent';
const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: "763px",
    height: "507px",
    bgcolor: "#FFFFFF",
    borderRadius: "19px",
    p: 4,
};
type Props = {
    modalData: any,
    onClose: () => void;
}
const CreateNewQuestionPaperModal: FC<Props> = ({ modalData, onClose }) => {
    const handleClose = () => onClose()
    return (
        <div>
            <Modal
                open={true}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description">
                <Box sx={style} >
                    <Box className="closeIconAlign">
                        <CloseIcon className='cursorPointer' onClick={handleClose} />
                    </Box>
                    <br />
                    <div className='d-flex justify-content-between'>
                        {modalData.map((model: any) => {
                            return (
                                <div className="createNewPaperModalSect" style={{width: `calc(100% / ${modalData.length})`}}>
                                    <div className="textHeader">{model?.header}</div>
                                    <Box className="alignQuestionImg">
                                        <img className="mt-5 mb-4" alt="leftImage" src={model?.image}></img>
                                    </Box>
                                    <p className='content'>{model?.content}</p>
                                    {model?.buttons?.map((buttonData: any) => {
                                        return (
                                            <Box sx={{ marginTop: "20px" }}>
                                                <ButtonComponent label={buttonData.label} 
                                                type={buttonData.type} 
                                                textColor={buttonData.textColor}
                                                 backgroundColor={buttonData.backgroundColor} 
                                                 minWidth={buttonData.minWidth} 
                                                 buttonSize={buttonData.buttonSize} 
                                                 endIcon = {buttonData.icon}
                                                 onClick={buttonData.onClick}/>
                                            </Box>
                                        )
                                    })}
                                </div>
                            )
                        })}
                        {/* <Box className='verticalDivider'></Box> */}
                    </div>
                </Box>
            </Modal>
        </div >
    )
}
export default CreateNewQuestionPaperModal;