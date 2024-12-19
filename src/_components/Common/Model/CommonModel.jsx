import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';

import {constantText} from './../../../_helpers/constants.text'
import LockIcon from 'images/lock-icon.svg';
import './Model.css';


export const CommonModel = ({
  state=false,
  className = '',
  Form = null,
  showTitle = true,
  title = constantText.unlock_title_text,
  showIcon = true,
  icon = <LockIcon />,
  showDes = true,
  des = '',
  desClass = '',
  showBtn1 = true,
  desWithoutDialogText = false,
  btn1Text = constantText.yes_text,
  showBtn2 = true,
  btn2Text = constantText.no_text,
  btn1Action,
  btn2Action,
  handleClose,
  disableBackdropClick = false,
  singleButton = false }) => {
  return (
    <Dialog open={state} onClose={handleClose} className={className} disableBackdropClick={disableBackdropClick} >
      {showTitle && <DialogTitle>{title}</DialogTitle>}
      <DialogContent>
        {showIcon && <Avatar>{icon}</Avatar>}
        {showDes && desWithoutDialogText ? des : <DialogContentText className={desClass} dangerouslySetInnerHTML={{ __html: des }} />}
        {Form}
      </DialogContent>
      <DialogActions className={(showBtn1 && showBtn2) ? 'show-buttons' : 'show-button'}>
        {showBtn1 && <Button className={`auto-button-${btn1Text ? btn1Text.split(" ").join(""): ""}`} onClick={btn1Action}>{btn1Text}</Button>}
        {showBtn2 && !singleButton && <Button  className={`auto-button-${btn2Text ? btn2Text.split(" ").join(""): ""}`} onClick={btn2Action}>{btn2Text}</Button>}
      </DialogActions>
    </Dialog>
  )
}
