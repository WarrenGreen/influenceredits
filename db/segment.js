
import { sql } from '@vercel/postgres';


export async function createSegment(segment) {
  let { rows, fields } = await sql`
    INSERT INTO segment 
      ("id", "start_index", "end_index", "start_time", "end_time", "color", "project_media_id", "index", "text")
    VALUES (${segment.id}, ${segment.start}, ${segment.end}, ${segment.timeStart}, ${segment.timeEnd}, ${segment.color}, ${segment.projectMediaId}, ${segment.index}, ${segment.text}) `;
  return rows, fields;
}

export async function editSegments(segments) {
  let global_rows = segments.map(async (segment) => {
    let { rows, fields } = await sql`
    UPDATE segment 
    SET start_index=${segment.start},
    end_index=${segment.end},
    start_time=${segment.timeStart},
    end_time=${segment.timeEnd},
    color=${segment.color},
    text=${segment.text},
    index=${segment.index}
    WHERE id=${segment.id}`;

    return [...rows];
  })

  return global_rows;
}

export async function getSegment(segmentId) {
  let { rows, fields } = await sql`SELECT * FROM segment WHERE id = ${segmentId}`;
  return rows;
}

export async function getSegmentFromProjectMedia(projectMediaId) {
  let { rows, fields } = await sql`SELECT * FROM segment WHERE project_media_id = ${projectMediaId}`;
  return rows;
}

export async function getSegmentByProject(projectId) {
  let { rows, fields } = await sql`
    SELECT segment.id, segment.start_index as start, segment.end_index as end, start_time as "timeStart", end_time as "timeEnd", color, project_media_id, index, text
    FROM project_media
    inner join segment on project_media.id=segment.project_media_id
    where project_media.project_id=${projectId}
    order by segment.index `;
  return rows;
}

export async function deleteSegment(segmentId) {
  let { rows, fields } = await sql`DELETE FROM segment WHERE id = ${segmentId}`;
  return rows;
}