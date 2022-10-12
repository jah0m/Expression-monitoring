import React, {useState} from 'react'
import Webcam from 'react-webcam'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
export default function Camera() {
  const [imgSrc, setImgSrc] = useState()
  const webcamRef = React.useRef(null);
  const capture = React.useCallback(
    () => {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc)
    },
    [webcamRef]
  );

  const autoCapture = () => {
    let captureTimer = setInterval(()=>{
      capture()
    },1000)
  }


  return (
    <div className='camera'>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      /><br />
      { imgSrc && <img alt="not fount" width={"250px"} src={imgSrc} />}
      <Stack>
        <Button onClick={capture} variant="contained" component="label">
          Capture
        </Button><br />
        <Button onClick={autoCapture} variant="contained" component="label">
          Auto Capture
        </Button>
      </Stack>
    </div>
  )
}
