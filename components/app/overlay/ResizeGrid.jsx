import {useState} from 'react'

import { observer } from 'mobx-react-lite';
import { overlayCreator } from '@/stores/OverlayCreatorStore';
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

function getWidth(fullSizeWidth, fullSizeHeight, height) {
  return Math.round(height * fullSizeWidth / fullSizeHeight);
}

function getPreviewResolution(resolution) {
  return [getWidth(resolution[0], resolution[1], 300), 300]
}

const ResizeGrid = observer(({originalResolution, setResolution}) => {


const files_proto = [
  {
    title: 'Original Size',
    size: '',
    selected: true,
    resolution: originalResolution,
    source:
      `https://placehold.co/${originalResolution[0]}x${originalResolution[1]}`,
  },
  {
    title: 'Instagram Post Square',
    selected: false,
    resolution: [1080, 1080],
    icon: '/images/app/overlay/logos/instagram.png',
    source:
      'https://placehold.co/1080x1080',
  },
  {
    title: 'Instagram Post Potrait',
    selected: false,
    resolution: [1080, 1350],
    icon: '/images/app/overlay/logos/instagram.png',
    source:
      'https://placehold.co/1080x1350',
  },
  {
    title: 'Instagram Post Landscape',
    selected: false,
    resolution: [1080, 608],
    icon: '/images/app/overlay/logos/instagram.png',
    source:
      'https://placehold.co/1080x608',
  },
  {
    title: 'Instagram Reels',
    selected: false,
    resolution: [1080, 1920],
    icon: '/images/app/overlay/logos/instagram.png',
    source:
      'https://placehold.co/1080x1920',
  },
  {
    title: 'Facebook Feed (Desktop)',
    selected: false,
    resolution: [1080, 1080],
    icon: '/images/app/overlay/logos/facebook.png',
    source:
      'https://placehold.co/1080x1080',
  },
  {
    title: 'Facebook Feed (Mobile)',
    selected: false,
    resolution: [1080, 1350],
    icon: '/images/app/overlay/logos/facebook.png',
    source:
      'https://placehold.co/1080x1350',
  },
  {
    title: 'Facebook Stories',
    selected: false,
    resolution: [1080, 1920],
    icon: '/images/app/overlay/logos/facebook.png',
    source:
      'https://placehold.co/1080x1920',
  },
  {
    title: 'Google Ads Horizontal',
    selected: false,
    resolution: [1920, 1080],
    icon: '/images/app/overlay/logos/google.png',
    source:
      'https://placehold.co/1920x1080',
  },
  {
    title: 'Google Ads Vertical',
    selected: false,
    resolution: [1080, 1920],
    icon: '/images/app/overlay/logos/google.png',
    source:
      'https://placehold.co/1080x1920',
  },
  {
    title: 'Google Ads Square',
    selected: false,
    resolution: [1080, 1080],
    icon: '/images/app/overlay/logos/google.png',
    source:
      'https://placehold.co/1080x1080',
  },
  {
    title: 'Snapchat',
    selected: false,
    resolution: [1080, 1920],
    icon: '/images/app/overlay/logos/snapchat.png',
    source:
      'https://placehold.co/1080x1920',
  },
  {
    title: 'LinkedIn Vertical (9:16)',
    selected: false,
    resolution: [1080, 1920],
    icon: '/images/app/overlay/logos/linkedin.png',
    source:
      'https://placehold.co/1080x1920',
  },
  {
    title: 'LinkedIn Vertical (4:5)',
    selected: false,
    resolution: [1536, 1920],
    icon: '/images/app/overlay/logos/linkedin.png',
    source:
      'https://placehold.co/1536x1920',
  },
  {
    title: 'LinkedIn Landscape',
    selected: false,
    resolution: [1920, 1080],
    icon: '/images/app/overlay/logos/linkedin.png',
    source:
      'https://placehold.co/1920x1080',
  },
  {
    title: 'LinkedIn Square',
    selected: false,
    resolution: [1920, 1920],
    icon: '/images/app/overlay/logos/linkedin.png',
    source:
      'https://placehold.co/1920x1920',
  },
  {
    title: 'X (Twitter) Square',
    selected: false,
    resolution: [1200, 1200],
    icon: '/images/app/overlay/logos/twitter.png',
    source:
      'https://placehold.co/1200x1200',
  },
  {
    title: 'X (Twitter) Landscape',
    selected: false,
    resolution: [1920, 1080],
    icon: '/images/app/overlay/logos/twitter.png',
    source:
      'https://placehold.co/1920x1080',
  },

  // More files...
]

  const updateSelected = (index) => {
    setResolution(oldRes => files[index].resolution)
    setFiles(oldFiles => {
      return oldFiles.map(( oldFile, fileIndex) => {
        return {...oldFile, selected: fileIndex==index}
      })
    })
    overlayCreator.setResolution(getPreviewResolution(files[index].resolution))
  }

  const [files, setFiles] = useState(files_proto)
  return (
    <ul role="list" className="grid  gap-x-4 gap-y-8 grid-cols-3">
      {files.map(( file, index) => (
        <li key={file.title} className="relative">
          <div className={"group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 " + (file.selected ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-100" : "")}>
            <div className={"pointer-events-none object-cover group-hover:opacity-75 p-5 flex flex-col justify-center items-center text-slate-400 font-extrabold"} style={{height: Math.round(117 * file.resolution[1] / file.resolution[0]) +"px" }}>
              <img src={file.icon} className='w-8 grayscale-[75%]'/>
              <span>{`${file.resolution[0]}x${file.resolution[1]}`}</span>
            </div>
            <button onClick={()=> updateSelected(index)} type="button" className="absolute inset-0 focus:outline-none">
              <span className="sr-only">View details for {file.title}</span>
            </button>
          </div>
          <p className="pointer-events-none mt-2 block text-sm font-bold text-gray-900">{file.title}</p>
        </li>
      ))}
    </ul>
  )
})

export default ResizeGrid;