import { useSupabaseAuthClient } from '@supabase/auth-helpers-nextjs'

export async function signOut() {
  const supabase = useSupabaseAuthClient();
  const { error } = await supabase.auth.signOut()
  console.log(error)
  window.location.href = "/logout";

}