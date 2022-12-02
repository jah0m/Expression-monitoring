import React, {useState, useEffect} from 'react'
import Webcam from 'react-webcam'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import axios from 'axios'
import Chart from '../components/Chart'
import moment from 'moment'
import * as faceapi from 'face-api.js'

export default function Camera() {
  const [imgSrc, setImgSrc] = useState()
  const [expression, setExpression] = useState(null)
  const [expData, setExpData] = useState([])
  const [captureTimer, setCaptureTimer] = useState()
  const [captureInvterval, setCaptureInveterval] = useState(100)
  const webcamRef = React.useRef(null)
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
    const timer = setInterval(()=>{
      capture()
    },captureInvterval)
    setCaptureTimer(timer)
  }

  const stopCapture = ()=> {
    clearInterval(captureTimer)
  }

  const clearData = ()=> {
    setExpData([])
  }

  const saveData = () => {
    let csvContent = "data:text/csv;charset=utf-8,"
    expData.forEach((item)=>{
      let row = `${item.time},${item.score}`
      csvContent += row + "\r\n";
    })
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  }

  async function loadModel() {
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL)
    console.log('model loaded')
  }
  
  useEffect(() => {
    loadModel()
  }, [])

  
  useEffect(() => {
    if (!imgSrc) return
    // console.log(imgSrc)
    myImg.src = imgSrc
    let time = moment().format('h:mm:ss.S')
    // console.log(myImg.src)
    userImageUploaded(time)
    // uploadImage()
  }, [imgSrc])

  async function userImageUploaded(time) {
    console.log('start detect')
    let preTime = new Date().getTime()
    let result = await faceapi.detectSingleFace(myImg, new faceapi.TinyFaceDetectorOptions())
    // console.log(result)
    let curTime = new Date().getTime()
    console.log('cost: ', (curTime-preTime))
    let box = result._box
    let { _x, _y, _width, _height } = box
    crop(myImg, _x, _y, _width, _height, time)
  }
  
  function crop(img, x, y, width, height, time){
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
  
    canvas.width = 48
    canvas.height = 48
  
    ctx.drawImage(img, x, y, width, height, 0, 0, 48, 48)
  
    //canvas to base64
    // console.log(canvas.toDataURL("image/jpeg"))
    uploadImage(canvas.toDataURL("image/jpeg"), time)
  }

  const uploadImage = (img_b64, time) => {
    // let img_b64 = getBase64(imgSrc)

    const regex = /data:.*base64,/
    let img_uri = decodeURI(img_b64.replace(regex, ''))
    let param = {'base64': img_uri}
    axios({
      method: 'POST',
      url: 'http://127.0.0.1:5000/predict',
      params: param,
    }).then(response => {
      // console.log(response.data)
      setExpression(response.data)
      let score = response.data.happy - response.data.sad
      score = score.toFixed(3)
      
      let data = {
        time : time,
        score : score
      }
      let arr = [...expData]
      // console.log(arr)
      arr.push(data)
      setExpData(arr)
    })
  }


  return (
    <>
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
          <input type="number" defaultValue={100} onChange={(e)=>{setCaptureInveterval(e.target.value)}}/>
          <Button onClick={autoCapture} variant="contained" component="label">
            Start Record
          </Button><br />
          <Button onClick={stopCapture} variant="contained" component="label">
            Stop Record
          </Button><br />
          <Button onClick={clearData} variant="contained" component="label">
            Clear data
          </Button><br />
          <Button onClick={saveData} variant="contained" component="label">
            Save data
          </Button>
        </Stack>
      </div>
      <Chart data={expData} />
    </>
  )
}
