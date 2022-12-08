import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import axios from 'axios'
import Chart from '../components/Chart'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts'
import * as faceapi from 'face-api.js'

export default function Video() {
  const [expression, setExpression] = useState(null)
  const [expData, setExpData] = useState([])
  const [pieData, setPieData] = useState([])
  const [playTimer, setPlayTimer] = useState()
  const [playInvterval, setPlayInveterval] = useState(300)
  const MODEL_URL = '../models'
  var startTime

  const clearData = ()=> {
    setExpData([])
    setPieData([])
    window.localStorage.setItem('data', null)
  }

  const playVideo = () => {
    clearData()
    let media = URL.createObjectURL(document.querySelector('input').files[0])
    let video = document.getElementById("video")
    video.src = media
    video.style.display = "block"
    video.play()
    video.volume = 0
    startTime = new Date().getTime()
    const timer = setInterval(userImageUploaded, playInvterval)
    setPlayTimer(timer)
    // setInterval(capture, 50)
  }

  const stopVideo = () => {
    let video = document.getElementById("video")
    video.pause()
    clearInterval(playTimer)
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

  async function userImageUploaded() {
    // console.log('start detect')
    let video = document.querySelector('video')
    let passTime = new Date().getTime() - startTime
    passTime = Math.round(passTime/100) * 100
    // console.log(passTime)

    faceapi.detectSingleFace(video, new faceapi.TinyFaceDetectorOptions()).then(result=>{
      if (result) {
        let box = result._box
        let { _x, _y, _width, _height } = box
        crop(video, _x, _y, _width, _height, passTime)
      } else {
        console.log("Can't detect face")
      }
    })
  }


  function crop(img, x, y, width, height, passTime){
    const canvas = document.querySelector('canvas')
    const ctx = canvas.getContext('2d')
  
    canvas.width = 48
    canvas.height = 48
  
    ctx.drawImage(img, x, y, width, height, 0, 0, 48, 48)
  
    //canvas to base64
    // console.log(canvas.toDataURL("image/jpeg"))
    uploadImage(canvas.toDataURL("image/jpeg"), passTime)
  }

  const uploadImage = (img_b64, passTime) => {
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
        time : passTime,
        score : score
      }
      // let arr = [...expData]
      let arr = JSON.parse(window.localStorage.getItem('data')) || []
      arr.push(data)
      window.localStorage.setItem('data', JSON.stringify(arr))
      setExpData(arr)
      updatePieDate(arr)
    })
  }

  const updatePieDate = (data) => {
    let arr = [0,0,0,0,0]
    for (let exp of data) {
      if (exp.score >= 0.75) {
        arr[0] += 1
      } else if (exp.score >= 0.25) {
        arr[1] += 1
      } else if (exp.score >= -0.25) {
        arr[2] += 1
      } else if (exp.score >= -0.75) {
        arr[3] += 1
      } else {
        arr[4] += 1
      }
    }
    arr = [
            {'name': '1 >= score >= 0.75', 'value': arr[0]}, 
            {'name': '0.75 > score >= 0.25', 'value': arr[1]},
            {'name': '0.25 > score >= -0.25', 'value': arr[2]},
            {'name': '-0.25 > score >= -0.75', 'value': arr[3]},
            {'name': '-0.75 > score >= -1', 'value': arr[4]},
          ]
    setPieData(arr)
    // console.log(arr)
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#ff0000'];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const CustomizedLegend = (props) => {
    const { payload } = props;
    return (
      <ul className="LegendList">
        {payload.map((entry, index) => (
          <li key={`item-${index}`}>
            <div className="BulletLabel">
              <Bullet backgroundColor={entry.payload.fill} size="20px" />
              <div className="BulletLabelText">{entry.value}</div>
            </div>
            <div style={{ marginLeft: "20px", marginBottomL: "10px" }}>{entry.payload.value}</div>
          </li>
        ))}
      </ul>
    );
  };

  const Bullet = ({ backgroundColor, size }) => {
    return (
      <div
        className="CirecleBullet"
        style={{
          backgroundColor,
          width: size,
          height: size
        }}
      ></div>
    );
  };


  return (
    <>
      <div className='camera'>
        <input type="file" id="input" name="input_video" accept="video/mp4, video/mov" />
        <video id="video" width="320" height="240" controls style={{display: 'none'}}></video>
        <canvas className="faceCanvas"></canvas>
        <ul>
          { expression &&
            Object.keys(expression).map(key =>{
              return <li key={key}>{key}: {expression[key]}</li>
            }) 
          }
        </ul>
        <Stack>
          <input type="number" defaultValue={300} onChange={(e)=>{setPlayInveterval(e.target.value)}}/>
          <Button onClick={playVideo} variant="contained" component="label">
            Play
          </Button><br />
          <Button onClick={stopVideo} variant="contained" component="label">
            Stop
          </Button><br />
          <Button onClick={clearData} variant="contained" component="label">
            Clear data
          </Button><br />
          <Button onClick={saveData} variant="contained" component="label">
            Save data
          </Button>
        </Stack>
      </div>
      <div className='charts'>
        <Chart data={expData} />
        <PieChart width={300} height={500}>
          <Pie 
            data={pieData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Legend content={<CustomizedLegend />} />
        </PieChart>
      </div>
  </>
  )
}
