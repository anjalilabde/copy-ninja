import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react'
import useSupabase from '../../../supabase/use-supabase'
import { SpinnerLoader } from './SpinnerLoader'
import Dropdown from './core/Dropdown'
import { PlusIcon } from '@heroicons/react/20/solid'
import { getLocalStorage } from '../../../utils'
import { Dialog, Transition } from '@headlessui/react'

const Search = ({ className }: { className?: string }) => {
  const { getAllFolders, createFolder } = useSupabase()
  const [isModal, setIsModal] = useState(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [folder, setFolder] = useState<string>('')

  const [allFolders, setAllFolders] = useState<string[]>([''])

  function createFolderHandler() {
    setLoading(true)
    createFolder(folder).then((res: any) => {
      if (res.data) {
        setLoading(false)
        setIsModal(false)

        getAllFolders()
      }
    })
  }

  useEffect(() => {
    getAllFolders().then((res) => {
      console.log(res)
    })
    setAllFolders(getLocalStorage('allFolders') ?? [''])
  }, [])

  return (
    <div className={`flex justify-between  flex-col ${className}`}>
      <div className="px-4 py-1">
        <div className="mt-2 flex rounded-mdalign-middle">
          <Dropdown className="" id={'folder'} selectOptions={allFolders} />

          <button
            type="button"
            onClick={() => setIsModal(true)}
            className="ml-4 inline-flex items-center gap-x-2 rounded-md  px-3.5 py-2.5 bg-indigo-600  text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            <PlusIcon className=" h-full w-5 text-white" aria-hidden="true" />
            Create
          </button>
        </div>
      </div>

      <div className="flex justify-between px-4 py-2">
        <div className='w-full'>
          <input
            type="text"
            name="topics"
            id="topics"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Search Topics"
          />
        </div>
        <div>
          <span className="isolate inline-flex rounded-md ">
            <button
              onClick={() => {
                window.open(chrome.runtime.getURL('/options.html#/create'))
              }}
              type="button"
              className="ml-4 relative inline-flex align-middle gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            >
              <PlusIcon className="h-5 w-5" aria-hidden="true" />
              Add
            </button>
          </span>
        </div>
      </div>
      <Transition.Root show={isModal} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={() => setIsModal(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-[63%] items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                  <div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900 mb-4"
                      >
                        Create a Folder
                      </Dialog.Title>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="folder_name"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Folder Name
                    </label>
                    <div className="mt-2">
                      <input
                        type="text"
                        name="folder_name"
                        id="folder_name"
                        onChange={(e: any) => {
                          setFolder(e.target.value)
                        }}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        placeholder="Enter Folder Name"
                      />
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-6 flex gap-x-2">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 sm:col-start-2"
                      onClick={() => createFolderHandler()}
                    >
                      {loading ? <SpinnerLoader className="w-5 h-5" /> : 'Save'}
                    </button>
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:col-start-1 sm:mt-0"
                      onClick={() => setIsModal(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  )
}

export default Search
