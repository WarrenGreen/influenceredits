import { Fragment, useEffect } from 'react'
import { Disclosure, Menu } from '@headlessui/react'
import { Popover, Transition } from '@headlessui/react'
import {createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {useUser } from '@supabase/auth-helpers-react'
import {useState} from 'react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function ProfileMenu() {
  const supabase = createClientComponentClient()

  const user = useUser()

  const [userData, setUserData] = useState({name: '', email: '', imageUrl: ''})

  if (user) {
  supabase
    .from("user")
    .select()
    .single()
    .eq("id", user.id)
    .then(({data}) => {
      setUserData({name: data.name, email:data.email, imageUrl: data.image_url})
    })
  }


  const userNavigation = [
    // { name: 'Your Profile', href: '#' },
    // { name: 'Settings', href: '#' },
    { name: 'Sign out', href:'/', onClick:  async () => {await supabase.auth.signOut(); window.location.href="/"} },
  ]

  return (
    <Menu as="div" className="relative ml-3">
                      <div>
                        <Menu.Button className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                          <span className="absolute -inset-1.5" />
                          <span className="sr-only">Open user menu</span>
                          <img className="h-8 w-8 rounded-full" src={userData.imageUrl} alt="" />
                        </Menu.Button>
                      </div>
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                          {userNavigation.map((item) => (
                            <Menu.Item key={item.name}>
                              {({ active }) => (
                                <p
                                  onClick={item.onClick}
                                  className={classNames(
                                    active ? 'bg-gray-100' : '',
                                    'block px-4 py-2 text-sm text-gray-700'
                                  )}
                                >
                                  {item.name}
                                </p>
                              )}
                            </Menu.Item>
                          ))}
                        </Menu.Items>
                      </Transition>
                    </Menu>
  )
}