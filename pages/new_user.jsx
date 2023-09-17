import { createPagesServerClient } from '@supabase/auth-helpers-nextjs'


export const getServerSideProps = async (context) => {

  // Create authenticated Supabase Client
  const supabase = createPagesServerClient(context)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user){
    let imageUrl;
    if (user.user_metadata && user.user_metadata.avatar_url)
      imageUrl = user.user_metadata.avatar_url;
    else
      imageUrl = "https://ui-avatars.com/api/?background=random&name=" + user.user_metadata.full_name.replace(" ", "+")

    const {error} = await supabase
      .from("user")
      .update({image_url: imageUrl, name: user.user_metadata.full_name})
      .eq("id", user.id)

    if( error) 
      console.log(error)
  }
  

    return {
      redirect: {
        destination: '/app/dashboard',
        permanent: false,
      },
    }
  
}

export default function NewUser() {

}