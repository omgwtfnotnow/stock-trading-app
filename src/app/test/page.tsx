"use client"
import React, { useEffect, useState } from 'react'
import UsernameSearch from '@/components/ui/search'
import { Grid, TextField } from '@mui/material'
import { getEntry } from '@/helpers/search'
import CollapsibleTable from '@/components/ui/Table'
type Props = {}

const test = (props: Props) => {
    const [uid, setUid] = useState("")
    const [week, setWeek] = useState("")
    const [userentry , setUserentry] = useState([])
    const handleUserid = (value: string) => {
        setUid(value)
    }
   useEffect(
    () => {
        const fetchEntries = async()=>{
            if(!uid || !week)
              {
                setUserentry([])
                return
              }
              const result = await getEntry(uid,week)
              const ARR = result as any[]
              console.log(typeof ARR)
              console.log( result)

              setUserentry(result)
            };
            fetchEntries()
    }
    ,[week,uid])
    return (
        <div>
            <UsernameSearch handleUID={handleUserid} />
            <Grid item xs={12} sm={6}>
                <TextField
                    label="Week Number"
                    name="weekNumber"
                    type="text"
                    value={week}
                    onChange={(e)=>setWeek(e.target.value)}
                />
                </Grid>
                {userentry.length>0 && <CollapsibleTable row = {userentry}/> }
        </div>
    )
}

export default test