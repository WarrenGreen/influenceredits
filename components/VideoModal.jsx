

export const getServerSideProps = async ({ params }) => {
  return { props: { host: process.env.NEXT_PUBLIC_HOST } }
}

export default function VideoModal ({setShowModal, videoUrl}) {
  
  return (
    <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div className="z-10 fixed inset-0 w-screen overflow-y-auto">
      <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
          
        <video width="640" controls src={videoUrl} />

        <div className="bg-gray-50 py-3 sm:flex">
          <button type="button" onClick={()=>{setShowModal(false)}} className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Close</button>
        </div>
      </div>
    </div>
  </div>
  </div>
  )
}