"use client"
import React, { useEffect, useState } from 'react'
import UsernameSearch from '@/components/ui/search'
import { Grid, TextField, MenuItem, Select, FormControl, InputLabel, Box } from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import { getEntry } from '@/helpers/search'
import CollapsibleTable from '@/components/ui/Table'
import DataTable from '@/components/ui/billTable'
type Props = {}

const Test = (props: Props) => {
    const [uid, setUid] = useState("")
    const [week, setWeek] = useState("")
    const [date, setDate] = useState<Dayjs | null>(null)
    const [userentry, setUserentry] = useState<any[]>([])
    const [inputType, setInputType] = useState<string>("week")

    const handleUserid = (value: string) => {
        setUid(value)
    }

    useEffect(() => {
        const fetchEntries = async () => {
            if (!uid || (!week && !date)) {
                setUserentry([])
                return
            }
            const searchParam = inputType === "week" ? week : date?.format('YYYY-MM-DD')
            if(uid && searchParam) {
              const result = await getEntry(uid,searchParam)
              console.log(typeof result)
                setUserentry(result)
            }
        }
        fetchEntries()
    }, [week, date, uid, inputType])

    return (
        <Box width={'100%'} display='flex' justifyContent={'center'} mt={3}>
            <Box maxWidth={'md'}>
            <UsernameSearch handleUID={handleUserid} />
            <FormControl fullWidth margin="normal">
                <InputLabel id="input-type-label">Select Input Type</InputLabel>
                <Select
                    labelId="input-type-label"
                    value={inputType}
                    label="Select Input Type"
                    onChange={(e) => setInputType(e.target.value)}
                >
                    <MenuItem value="week">Week Number</MenuItem>
                    <MenuItem value="date">Date</MenuItem>
                </Select>
            </FormControl>
            
            
                {inputType === "week" ? (
                   <FormControl fullWidth margin="normal">
                        <TextField
                            fullWidth
                            label="Week Number"
                            name="weeknumber"
                            type="number"
                            value={week}
                            onChange={(e) => setWeek(e.target.value)}
                            margin="normal"
                        />
                    </FormControl>
                ) : (
                    
                    <FormControl fullWidth margin="normal">
                        <DatePicker
                            label="Date"
                            value={date}
                            onChange={(newValue) => setDate(newValue)}
                        />
                    </FormControl>
                )}
            <Box 
                mt={2} 
                sx={{
                    height: 'calc(100vh - 150px)', 
                    overflowY: 'auto',
                    paddingRight: '16px',
                    boxSizing: 'border-box'
                }}
            >
                {/* {userentry.length > 0 ? (
                    <CollapsibleTable row={userentry} />
                ) : (
                    "Not found"
                )} */}
                <DataTable/>
            </Box>
            </Box>
        </Box>
    )
}

export default Test
