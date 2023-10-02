import {useState} from 'react'

import { observer } from 'mobx-react-lite';
import { overlayCreator } from '@/stores/OverlayCreatorStore';
import TemplateModal from './templates/TemplateModal';
/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/aspect-ratio'),
    ],
  }
  ```
*/
const files_proto = [
  {
    title: 'No Template',
    size: '',
    selected: true,
    source:
      'https://placehold.co/540x675',
  },
  {
    title: 'Logo',
    size: '3.9 MB',
    selected: false,
    source:
      'https://placehold.co/540x283',
  },

  // More files...
]

const TemplateGrid = observer(({resolution, thumbnail}) => {

  const updateSelected = (index) => {
    setFiles(oldFiles => {
      return oldFiles.map(( oldFile, fileIndex) => {
        return {...oldFile, selected: fileIndex==index}
      })
    })
  }

  const [files, setFiles] = useState([
    {
      title: 'No Template',
      selected: true,
      source: thumbnail,
      onClick: () => {
        if (overlayCreator.isLoading) {
          return
        }
        overlayCreator.template = []
        overlayCreator.applyTemplate();
      }
    },
    {
      title: 'Logo',
      selected: false,
      source: thumbnail,
      onClick: () => {
        if (overlayCreator.isLoading) {
          return
        }
        setShowModal(true);
      }
    },
  
    // More files...
  ])

  const [showModal, setShowModal] = useState(false);
  return (
    <>
    <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-2 xl:gap-x-8">
      {files.map(( file, index) => (
        <li key={index} className="relative">
          <div style={{width:"150px", height: (150*resolution[1]/resolution[0])+"px"}}className={"group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 " + (file.selected ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-100" : "")}>
            {file.title == "Logo"? <img src="/logo-sans-text.png" className='absolute top-1 left-1 w-8 z-1'/>: <></>}
            <img src={file.source} alt="" className="h-full w-full pointer-events-none object-cover group-hover:opacity-75" />
            <button onClick={()=> {updateSelected(index); file.onClick()}} type="button" className="absolute inset-0 focus:outline-none">
              <span className="sr-only">View details for {file.title}</span>
            </button>
          </div>
          <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">{file.title}</p>
        </li>
      ))}
    </ul>
    {showModal ? <TemplateModal setShowModal={setShowModal} /> : <></>}
    </>
  )
})

export default TemplateGrid; 