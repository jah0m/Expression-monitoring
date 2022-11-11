import React, {useState, useEffect} from 'react'
import Webcam from 'react-webcam'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import * as faceapi from 'face-api.js';

export default function Camera() {
  const [imgSrc, setImgSrc] = useState()
  const [expression, setExpression] = useState(null);
  const webcamRef = React.useRef(null);
  let myImg = new Image()
  const MODEL_URL = '../models'

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

  async function init() {
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL)
    console.log('model loaded')
  }
  
  useEffect(() => {
    init()
  }, [])

  
  useEffect(() => {
    if (!imgSrc) return
    console.log(imgSrc)
    myImg.src = imgSrc
    console.log(myImg.src)
    userImageUploaded()
    // uploadImage()
  }, [imgSrc])

  async function userImageUploaded() {
    console.log('start detect')
    let preTime = new Date().getTime()
    let result = await faceapi.detectSingleFace(myImg, new faceapi.TinyFaceDetectorOptions())
    console.log(result)
    let curTime = new Date().getTime()
    console.log('cost: ', (curTime-preTime))
    let box = result._box
    let { _x, _y, _width, _height } = box
    crop(myImg, _x, _y, _width, _height)
  }
  
  function crop(img, x, y, width, height){
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
  
    canvas.width = width
    canvas.height = height
  
    ctx.drawImage(img, x, y, width, height, 0, 0, 48, 48)
  
    //canvas to base64
    console.log(canvas.toDataURL("image/jpeg"))
    uploadImage(canvas.toDataURL("image/jpeg"))
  }

  const uploadImage = (img_b64) => {
    // let img_b64 = getBase64(imgSrc)

    const regex = /data:.*base64,/
    let img_uri = decodeURI(img_b64.replace(regex, ''))
    let param = {'base64': img_uri}
    axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/predict',
      params: param,
    }).then(response => {
      console.log(response.data)
      setExpression(response.data)
    })
  }

  return (
    <div className='camera'>
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
      /><br />
      { imgSrc && 
        <div>
          <img alt="not fount" width={"250px"} src={imgSrc} />
          <canvas id="canvas"></canvas>
        </div>
      }
      <ul>
        { expression &&
          Object.keys(expression).map(key =>{
            return <li key={key}>{key}: {expression[key]}</li>
          }) 
        }
      </ul>
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
