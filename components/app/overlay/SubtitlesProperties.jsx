import { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'
import { overlayCreator } from '@/stores/OverlayCreatorStore'

import {v4 as uuid} from 'uuid';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const subtitlesElement = {
  "type": "text",
  "transcript_effect": "highlight",
  "transcript_maximum_length": 14,
  "y": "82%",
  "width": "81%",
  "height": "35%",
  "x_alignment": "50%",
  "y_alignment": "50%",
  "fill_color": "#ffffff",
  "stroke_color": "#000000",
  "stroke_width": "1.6 vmin",
  "font_family": "Montserrat",
  "font_weight": "700",
  "font_size": "9.29 vmin",
  "background_color": "rgba(216,216,216,0)",
  "background_x_padding": "31%",
  "background_y_padding": "17%",
  "background_border_radius": "31%"
}

import { deepClone } from '@/helpers/deepClone';


export default function SubtitlesProperties() {
  const [enabled, setEnabled] = useState(null)

  useEffect(() => {
    const fn = async () => {
      if (!overlayCreator.preview || !overlayCreator.preview.getSource() || !overlayCreator.preview.getSource().elements) {
        if (enabled)
          setEnabled(false)
        return;
      }
      if (enabled){
        let source = overlayCreator.preview?.getSource()
        let newElements = []
        let start = 0;
        await Promise.all(source.elements.map(async (element)=> {
          let subElem = deepClone(subtitlesElement)
          subElem['id'] = uuid()
          subElem['transcript_source'] = element.id
          subElem['time'] = start
          subElem['duration'] = element.trim_duration
          newElements.push({
            ...subElem,
          });
          start += element.trim_duration

        }))
        source.elements.push(...newElements)
        await overlayCreator.preview.setSource(source, true)
        console.log(source)

      } else if (enabled == false) {
        let source = overlayCreator.preview?.getSource()
        source.elements = source.elements.filter((element) => {return element.type!="text"})
        console.log(source)
        await overlayCreator.preview.setSource(source, true)

      }
    }
    fn()
  }, [enabled])

  return (
    <Switch.Group as="div" className="flex items-center justify-between">
      <span className="flex flex-grow flex-col">
        <Switch.Label as="span" className="text-sm font-medium leading-6 text-gray-900" passive>
          Enable Subtitles
        </Switch.Label>
      </span>
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={classNames(
          enabled ? 'bg-indigo-600' : 'bg-gray-200',
          'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2'
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
          )}
        />
      </Switch>
    </Switch.Group>
  )
}
