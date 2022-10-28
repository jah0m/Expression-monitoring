import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import axios from 'axios';


export default function FileUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [expression, setExpression] = useState(null);

  const getBase64 = file => {
    return new Promise(resolve => {
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        //console.log("Called", reader);
        baseURL = reader.result;
        //console.log(baseURL);
        resolve(baseURL);
      };
      //console.log(fileInfo);
    });
  };

  const uploadImage = () => {
    let img_b64 = getBase64(selectedImage)
    img_b64.then(result => {
      const regex = /data:.*base64,/
      let img_uri = decodeURI(result.replace(regex, ''))
      let param = {'base64': img_uri}
      axios({
        method: 'POST',
        url: 'http://127.0.0.1:5000/predict',
        params: param,
      }).then(response => {
        console.log(response.data)
        setExpression(response.data)
      })
    })
  }

  useEffect(() => {
    if (!selectedImage) return
    uploadImage()
  }, [selectedImage])

  return (
    <div className='file'>
      {selectedImage && (
        <div>
        <img alt="not fount" width={"250px"} src={URL.createObjectURL(selectedImage)} />
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
