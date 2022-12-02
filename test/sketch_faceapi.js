let btn = document.querySelector('button')
let input = document.querySelector('input')
let myImg = new Image()
const MODEL_URL = '../public/models'


//load model
faceapi.loadSsdMobilenetv1Model(MODEL_URL)
faceapi.loadTinyFaceDetectorModel(MODEL_URL)

input.addEventListener('change', e => loadFile(e))

function loadFile(event) {
  console.log('img change')
  myImg.src = URL.createObjectURL(event.target.files[0])
  console.log(myImg.src)
  userImageUploaded()
}

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
}

function saveImage() {
  let link = document.createElement('a');
  link.setAttribute('download', 'cropedImage.png');
  link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
  link.click();
}
