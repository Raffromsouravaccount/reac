import React from 'react';
const ImagePreview=({className,imageUrl,placeHolder,setRef})=>(
    <div className={className}>
     <div className="MuiCardActionArea-root">
         {imageUrl && imageUrl.length> 0 &&
        <img src={imageUrl} 
        ref={setRef}
         alt={placeHolder}/>}
        </div>
        </div>
)
export default ImagePreview;


