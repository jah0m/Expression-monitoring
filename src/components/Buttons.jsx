import React from 'react'
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function Buttons() {
  return (
    <>
      <ButtonGroup variant="outlined" aria-label="outlined button group">
        <Button>Camera</Button>
        <Button>Photo</Button>
      </ButtonGroup>
    </>
  )
}
