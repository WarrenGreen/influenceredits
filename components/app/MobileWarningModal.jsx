

export const getServerSideProps = async ({ params }) => {
  return { props: { host: process.env.NEXT_PUBLIC_HOST } }
}

export default function MobileWarningModal ({style}) {
  
  return (
    <div className="relative z-10" style={style} aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

    <div className="z-10 fixed inset-0 w-screen overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
        <div style={{width: "640px"}} className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all">
          
        Sorry, this app only works on desktops currently. Please come back on a bigger screen.
      </div>
    </div>
  </div>
  </div>
  )
}