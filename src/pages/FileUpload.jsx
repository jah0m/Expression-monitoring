import React, {useState} from 'react'
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

export default function FileUpload() {
  const [selectedImage, setSelectedImage] = useState(null);
  return (
    <div className='file'>
      {selectedImage && (
        <div>
        <img alt="not fount" width={"250px"} src={URL.createObjectURL(selectedImage)} />
        <br /><br />
        <Stack>
          <Button variant="contained" component="label">
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
    </div>
  )
}
