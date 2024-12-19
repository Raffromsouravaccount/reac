import React from "react";
import Button from '@material-ui/core/Button';

const ButtonField = ({ className,  autoId = "" , onClick, variant, color, buttonText, disabled, Icon }) => (
  <Button   className={`${className?className:""} auto-button-${buttonText === 'string' ? buttonText.split(" ").join("") : className}${autoId}`}
    variant={variant}
    onClick={onClick}
    color={color}
    disabled={disabled}
  >
    {Icon && <Icon />}
    {buttonText}
  </Button>
);

export default ButtonField;
