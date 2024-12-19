import React, { useState, useEffect } from 'react';
import { apiCalls } from "../../../_services/common.service";
import { completeImagePath } from "../../Common/CommonFunction/CommonFuntion";
const placeHolder = 'images/no-image.svg';

export const ImageLoad = ({ url, id, externalId }) => {
  const [imageSrc, setImageSrc] = useState(placeHolder)
  const [imageRef, setImageRef] = useState();
  useEffect(() => {
  async function fetchData() {
    // wait for load image
    let res;
    if(id && url){
     res =  await apiCalls(`${url}/${id}`,'GET',{},'',false);
    }
    if(res){
      const loadedSrc = completeImagePath(
        externalId,
        "list",
        res?.imageDetails.url,
        res?.imageDetails.resolution
      );
      setImageSrc(loadedSrc);
    }
  }
  fetchData();

  let observer
  let didCancel = false

    if (imageRef && imageSrc === placeHolder) {
      if (IntersectionObserver) {
        observer = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              // when image is visible in the viewport + rootMargin
              if (
                !didCancel &&
                (entry.intersectionRatio > 0 || entry.isIntersecting)
              ) {
                setImageSrc(placeHolder)
              }
            })
          },
          {
            threshold: 0.01,
            rootMargin: '75%',
          }
        )
        observer.observe(imageRef)
      } else {
        // Old browsers fallback
        setImageSrc(placeHolder)
      }
    }
    return () => {
      didCancel = true
      // on component unmount, we remove the listner
      if (observer && observer.unobserve) {
        observer.unobserve(imageRef)
      }
    }
  },[url, id, externalId]);

  return <img ref={setImageRef} src={imageSrc} alt={imageSrc === placeHolder ? "no-image" : externalId} />
}