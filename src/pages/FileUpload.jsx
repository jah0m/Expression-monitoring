import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import axios from 'axios';
import * as faceapi from 'face-api.js';
// import * as ml5 from "ml5";
export default function FileUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [expression, setExpression] = useState(null);
  let myImg = new Image()
  const MODEL_URL = '../models'
  
  async function init() {
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL)
    console.log('model loaded')
  }
  
  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (!selectedImage) return
    myImg.src = URL.createObjectURL(selectedImage)
    console.log(myImg.src)
    userImageUploaded()
    // uploadImage()
  }, [selectedImage])

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
    // let img_b64 = getBase64(selectedImage)

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

  // const getBase64 = file => {
  //   return new Promise(resolve => {
  //     let baseURL = "";
  //     // Make new FileReader
  //     let reader = new FileReader();

  //     // Convert the file to base64 text
  //     reader.readAsDataURL(file);

  //     // on reader load somthing...
  //     reader.onload = () => {
  //       // Make a fileInfo Object
  //       //console.log("Called", reader);
  //       baseURL = reader.result;
  //       //console.log(baseURL);
  //       resolve(baseURL);
  //     };
  //     //console.log(fileInfo);
  //   });
  // };

  // const uploadImage = (img_b64) => {
  //   // let img_b64 = getBase64(selectedImage)
  //   img_b64.then(result => {
  //     const regex = /data:.*base64,/
  //     let img_uri = decodeURI(result.replace(regex, ''))
  //     let param = {'base64': img_uri}
  //     axios({
  //       method: 'POST',
  //       url: 'http://127.0.0.1:5000/predict',
  //       params: param,
  //     }).then(response => {
  //       console.log(response.data)
  //       setExpression(response.data)
  //     })
  //   })
  // }


  return (
    <div className='file'>
      {selectedImage && (
        <div>
        <img alt="not fount" width={"250px"} src={URL.createObjectURL(selectedImage)} />
        <canvas id="canvas"></canvas>
        <br /><br />
        <Stack>
          <Button onClick={uploadImage} variant="contained" component="label">
            Upload
          </Button>
        </Stack>
        <br />
        {/* <Button variant="contained" component="label" onClick={()=>setSelectedImage(null)}>Remove</Button> */}
        </div>
      )}
      <Stack>
        <Button variant="contained" component="label">
          Select Image
          <input hidden onChange={ e => setSelectedImage(e.target.files[0])} accept="image/*" multiple type="file" />
        </Button>
      </Stack>
      <ul>
        { expression &&
          Object.keys(expression).map(key =>{
            return <li key={key}>{key}: {expression[key]}</li>
          }) 
        }
      </ul>
    </div>
  )
}
