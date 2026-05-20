type Tstatus="open"|"in_progress"|'resolved'
export interface Iissue{
title:string,
description:string,
type:string,
status:Tstatus,
reporter_id:number
created_at:string
updated_at:string
}