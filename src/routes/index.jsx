import Home from "../pages/Home"
import Camera from '../pages/Camera'
import Video from "../pages/Video"
import FileUpload from '../pages/FileUpload'

const routes =  [
  {
    path: '/',
    element:<Home />,
    children: [
      {
        path: 'camera',
        element: <Camera />
      },
      {
        path: 'video',
        element: <Video />
      },
      {
        path: 'file',
        element: <FileUpload />
      }
    ]
  }
]

export default routes