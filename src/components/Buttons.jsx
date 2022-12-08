import React from 'react'
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import {useNavigate} from 'react-router-dom'

export default function Buttons() {
  const [alignment, setAlignment] = React.useState();

  const handleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
  };
  const navigate = useNavigate()
  return (
    <ToggleButtonGroup
      style={{padding: '50px'}} 
      color="primary"
      value={alignment}
      exclusive
      onChange={handleChange}
      aria-label="Platform"
    >
      <ToggleButton onClick={()=>{navigate('camera')}} value="camera">Camera</ToggleButton>
      <ToggleButton onClick={()=>{navigate('video')}} value="video">Video</ToggleButton>
      <ToggleButton onClick={()=>{navigate('file')}} value="file">File</ToggleButton>
    </ToggleButtonGroup>
  )
}
