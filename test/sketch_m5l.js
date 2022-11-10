let btn = document.querySelector('button')
let input = document.querySelector('input')
// let img = document.querySelector('#img')
let myImg = new Image()


input.addEventListener('change', e => loadFile(e))
// img.addEventListener('load', () => userImageUploaded())

function loadFile(event) {
  console.log('img change')
  myImg.src = URL.createObjectURL(event.target.files[0])
  userImageUploaded()
  // img.src = URL.createObjectURL(event.target.files[0])
}

function userImageUploaded() {
  console.log('start detect')
  let preTime = new Date().getTime()
  faceapi.detect(myImg, (err, results) => {
    let result = results[0]
    console.log(result)
    let alignedRect = result.alignedRect
    let { _x, _y, _width, _height } = alignedRect._box
    console.log(_x, _y, _width, _height)
    let curTime = new Date().getTime()
    console.log('cost: ', (curTime-preTime))
    crop(myImg, _x, _y, _width, _height)
  });
}

const detectionOptions = {
  withLandmarks: true,
  withDescriptors: false,
};
// Initialize the magicFeature
const faceapi = ml5.faceApi(detectionOptions, modelLoaded);

// When the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
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
