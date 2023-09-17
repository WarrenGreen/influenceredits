import { Disclosure } from '@headlessui/react'

import ProfileMenu from '../ProfileMenu'

export default function AppHeader ({children}) {
  const navigation = [
    { name: 'Dashboard', href: '/app/dashboard', current: true },
  ]
  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }

  return (
    <div className="min-h-full">
        <Disclosure as="nav" className="border-b border-gray-200 bg-white">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 justify-between">
                  <div className="flex">
                    <div className="flex flex-shrink-0 items-center">
                      <img
                        className="block h-8 w-auto lg:hidden"
                        src="/logo-sans-text.svg"
                        alt="AdEditor"
                      />
                      <img
                        className="hidden h-8 w-auto lg:block"
                        src="/logo-sans-text.svg"
                        alt="AdEditor"
                      />
                    </div>
                    <div className="ml-6 flex space-x-8">
                      {navigation.map((item) => (
                        <a
                          key={item.name}
                          href={item.href}
                          className={classNames(
                            item.current
                              ? 'border-indigo-500 text-gray-900'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium'
                          )}
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="ml-6 flex items-center">
                    {/*<<button
                      type="button"
                      className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">View notifications</span>
                      BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>*/}

                    <ProfileMenu />
                  </div>
                </div>
              </div>

              
            </>
          )}
        </Disclosure>

        <div className="py-10">
          <header className='pb-3'>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Dashboard</h1>
            </div>
          </header>
          <main className='py-7 bg-indigo-100'>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">{children}</div>
          </main>
        </div>
      </div>
  )
}