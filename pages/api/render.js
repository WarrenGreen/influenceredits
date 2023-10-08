

import { Inngest } from 'inngest';

const inngest = new Inngest({ name: "AdEditor" });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
import { createClient } from '@supabase/supabase-js'


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { source, project_id } = req.body;
    const { data, error } = await supabase
      .from("render")
      .insert({ project_id: project_id, source: source, status: "rendering" })
      .select()

    console.log("send inngest render")
    console.log(data)
    await inngest.send({
      name: "render/video",
      data: {
        source: source,
        projectId: project_id,
        renderId: data[0].id
      },
    });

    res.status(200).json({ renderId: data[0].id })
    //res.status(200).body().end();
  } else {
    res.status(404).end();
  }
}