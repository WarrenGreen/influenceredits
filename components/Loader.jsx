import {Oval} from 'react-loader-spinner';

export default function Loader ({style}) {

return (
    <Oval
      height={75}
      width={75}
      color="#BEADFA"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
      aria-label='oval-loading'
      secondaryColor=""
      strokeWidth={4}
      strokeWidthSecondary={4}
    />
  )
}