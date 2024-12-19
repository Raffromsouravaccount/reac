import React from 'react';
import Button from '@material-ui/core/Button';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';

const DropDown= ({className = "", open, loaderVisible = false, isLoading = false, buttonText, children, handleOpenClose, handleClose})=> {
  const anchorRef = React.useRef(null);

  const handleCloseOutside = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    if(handleClose) {
      handleClose();
    }
  };

  const handleListKeyDown= (event)=> {
    if (event.key === 'Tab') {
      event.preventDefault();
      handleClose();
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
   
    <div className={`${(loaderVisible && isLoading) ? 'loader-dropdown' : ''} ${className} auto-dropdown-wrapper-${buttonText ? buttonText.split(' ').join('') : className}`}>
    <Button
          className={`auto-dropdown-btn-${buttonText ? buttonText.split(' ').join('') : className}`}
          ref={anchorRef}
          aria-controls={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={handleOpenClose}
        >
        {buttonText}
        </Button>
        <Popper className="drop-menu" open={open} anchorEl={anchorRef.current} transition disablePortal>
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: placement === 'bottom' ? 'right top' : 'right bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseOutside}>
                  <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                    {children}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </div>
   
  );
}

export default DropDown;
