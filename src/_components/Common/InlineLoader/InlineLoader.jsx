import React from "react";
import CircularProgress from '@material-ui/core/CircularProgress';

const InlineLoader = ({ size = 25, className = "", show = false }) => show ?
    <div className={`text-center ${className}`}>
      <CircularProgress classes={{ root: 'loader-circle'}} color="inherit" size={size} />
    </div> : null;

export default InlineLoader;