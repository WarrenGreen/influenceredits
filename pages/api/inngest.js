import { Inngest } from "inngest";
import { serve } from "inngest/next";
import { requestThumbnail, requestTranscription } from "./util"
import { addThumbnail } from '@/db/media'
import { createTranscript } from '@/db/transcript'

// Create a client to send and receive events
export const inngest = new Inngest({ name: "AdEditor" });
import { createClient } from '@supabase/supabase-js'

// Use a custom domain as the supabase URL
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)


const videoUpload = inngest.createFunction(
  { name: "Video Upload" },
  { event: "media/video.upload" },
  async ({ event, step }) => {

    let thumbnailUrl = (await requestThumbnail(event.data.video.url))[0].url
    let rows = await addThumbnail(supabase, event.data.video.id, thumbnailUrl)
    let transcribedWords = await requestTranscription({ "uploadUrl": event.data.video.url });
    let transcript = await createTranscript(supabase, event.data.video.projectMediaId, transcribedWords.text, JSON.stringify(transcribedWords.words))

    return { event, body: { rows: rows, transcript: transcript } };
  }
);

// Create an API that serves zero functions
export default serve(inngest, [
  videoUpload,
]);
