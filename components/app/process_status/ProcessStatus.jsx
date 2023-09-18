import { CheckIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export default function ProcessStatus({state, projectId}) {

  let processStatus = {}
  let nextUrl = "#";
  if (state == "select") {
    processStatus = {"selection": 'current', 'overlay':'upcoming', 'render': 'upcoming'}
    nextUrl = "/app/overlay/"+projectId
  } else if (state == "overlay") {
    processStatus = {"selection": 'complete', 'overlay':'current', 'render': 'upcoming'}
    nextUrl = "/app/render/"+projectId
  }else {
    processStatus = {"selection": 'complete', 'overlay':'complete', 'render': 'current'}
  }
  const steps = [
    { id: '01', name: 'Selection', href: '/app/selection/'+projectId, status: processStatus['selection'] },
    { id: '02', name: 'Overlays', href: '/app/overlay/'+projectId, status: processStatus['overlay'] },
    { id: '03', name: 'Render', href: '/app/render/'+projectId, status: processStatus['render'] },
  ]

  return (
    <nav aria-label="Progress">
      <ol role="list" className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
        <li className="relative flex md:flex-1 mx-5 w-10 justify-center items-center" style={{flex: 0}}>
          <Link href="/app/dashboard" onClick={() => {return true}} className="w-10" aria-label="Dashboard">
          <img
            className="block h-8 lg:hidden"
            src="/logo-sans-text.svg"
            alt="AdEditor"
          />
          <img
            className="hidden h-8 lg:block"
            src="/logo-sans-text.svg"
            alt="AdEditor"
          />
          </Link>
        </li>
        {steps.map((step, stepIdx) => (
          <li key={step.name} className="relative md:flex md:flex-1">
            {step.status === 'complete' ? (
              <a href={step.href} className="group flex w-full items-center">
                <span className="flex items-center px-6 py-1 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                    <CheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                </span>
              </a>
            ) : step.status === 'current' ? (
              <a href={step.href} className="flex items-center px-6 py-1 text-sm font-medium" aria-current="step">
                <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600">
                  <span className="text-indigo-600">{step.id}</span>
                </span>
                <span className="ml-4 text-sm font-medium text-indigo-600">{step.name}</span>
              </a>
            ) : (
              <a href={step.href} className="group flex items-center">
                <span className="flex items-center px-6 py-1 text-sm font-medium">
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300 group-hover:border-gray-400">
                    <span className="text-gray-500 group-hover:text-gray-900">{step.id}</span>
                  </span>
                  <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">{step.name}</span>
                </span>
              </a>
            )}

            {stepIdx !== steps.length - 1 ? (
              <>
                {/* Arrow separator for lg screens and up */}
                <div className="absolute right-0 top-0 hidden h-full w-5 md:block" aria-hidden="true">
                  <svg
                    className="h-full w-full text-gray-300"
                    viewBox="0 0 22 80"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0 -2L20 40L0 82"
                      vectorEffect="non-scaling-stroke"
                      stroke="currentcolor"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </>
            ) : null}
          </li>
        ))}

        <li className="bg-violet-800 relative flex md:flex-1 w-24 justify-center items-center" style={{flex: 0}}>
              <Link href={nextUrl} className="text-sm text-white px-10 font-bold">
                  Next
              </Link>
        </li>
      </ol>
    </nav>
  )
}