import {useState} from 'react'
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

export default function ResizeGrid({originalResolution, setResolution}) {


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
    source:
      'https://placehold.co/1080x1080',
  },
  {
    title: 'Instagram Post Potrait',
    selected: false,
    resolution: [1080, 1350],
    source:
      'https://placehold.co/1080x1350',
  },
  {
    title: 'Instagram Post Landscape',
    selected: false,
    resolution: [1080, 608],
    source:
      'https://placehold.co/1080x608',
  },
  {
    title: 'Instagram Reels',
    selected: false,
    resolution: [1080, 1920],
    source:
      'https://placehold.co/1080x1920',
  },
  {
    title: 'Facebook Feed (Desktop)',
    selected: false,
    resolution: [1080, 1080],
    source:
      'https://placehold.co/1080x1080',
  },
  {
    title: 'Facebook Feed (Mobile)',
    selected: false,
    resolution: [1080, 1350],
    source:
      'https://placehold.co/1080x1350',
  },
  {
    title: 'Facebook Stories',
    selected: false,
    resolution: [1080, 1920],
    source:
      'https://placehold.co/1080x1920',
  },
  {
    title: 'Google Ads Horizontal',
    selected: false,
    resolution: [1920, 1080],
    source:
      'https://placehold.co/1920x1080',
  },
  {
    title: 'Google Ads Vertical',
    selected: false,
    resolution: [1080, 1920],
    source:
      'https://placehold.co/1080x1920',
  },
  {
    title: 'Google Ads Square',
    selected: false,
    resolution: [1080, 1080],
    source:
      'https://placehold.co/1080x1080',
  },
  {
    title: 'Snapchat',
    selected: false,
    resolution: [1080, 1920],
    source:
      'https://placehold.co/1080x1920',
  },
  {
    title: 'LinkedIn Vertical (9:16)',
    selected: false,
    resolution: [1080, 1920],
    source:
      'https://placehold.co/1080x1920',
  },
  {
    title: 'LinkedIn Vertical (4:5)',
    selected: false,
    resolution: [1536, 1920],
    source:
      'https://placehold.co/1536x1920',
  },
  {
    title: 'LinkedIn Landscape',
    selected: false,
    resolution: [1920, 1080],
    source:
      'https://placehold.co/1920x1080',
  },
  {
    title: 'LinkedIn Square',
    selected: false,
    resolution: [1920, 1920],
    source:
      'https://placehold.co/1920x1920',
  },
  {
    title: 'X (Twitter) Square',
    selected: false,
    resolution: [1200, 1200],
    source:
      'https://placehold.co/1200x1200',
  },
  {
    title: 'X (Twitter) Landscape',
    selected: false,
    resolution: [1920, 1080],
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
  }

  const [files, setFiles] = useState(files_proto)
  return (
    <ul role="list" className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-8">
      {files.map(( file, index) => (
        <li key={file.source} className="relative">
          <div className={"group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 " + (file.selected ? "ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-100" : "")}>
            <img src={file.source} alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
            <button onClick={()=> updateSelected(index)} type="button" className="absolute inset-0 focus:outline-none">
              <span className="sr-only">View details for {file.title}</span>
            </button>
          </div>
          <p className="pointer-events-none mt-2 block text-sm font-medium text-gray-900">{file.title}</p>
        </li>
      ))}
    </ul>
  )
}
