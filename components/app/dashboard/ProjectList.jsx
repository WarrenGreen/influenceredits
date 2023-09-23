import { PlusIcon } from '@heroicons/react/24/outline'
import { useRouter } from 'next/navigation'


export default function ProjectList({projects, createNewProject}) {
  const router = useRouter()
  return (
    <ul role="list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <li className="cursor-pointer col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
        <button
          type="button"
          onClick={createNewProject}
          className="flex flex-col justify-center items-center relative block w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <PlusIcon className='h-7 w-7' />
          <span className="mt-2 block text-sm font-semibold text-gray-900">Create a new project</span>
        </button>
      </li>
      {projects.map((project) => (
        <li key={project.id} onClick={() => router.push(`/app/selection/${project.id}`)} className="cursor-pointer col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
          <div className="flex w-full items-center justify-center space-x-6 p-6">
            <img className="flex-shrink-0 h-40 rounded-lg bg-gray-300" src={project.thumbnail} alt="" />
          </div>
          <div>
            <div className="-mt-px flex divide-x divide-gray-200">
              <div className="flex w-0 flex-1">
                <p
                  className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                >
                  {project.name}
                
                </p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}

