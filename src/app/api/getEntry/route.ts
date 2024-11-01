import connectDB from '@/lib/db';
import { NextRequest , NextResponse} from 'next/server';
import { ResultSetHeader } from 'mysql2';

export async function GET(req:NextRequest){
    try {
    const url = new URL(req.url);
    const uid = url.searchParams.get('uid') || '';
    const weekNumber = url.searchParams.get('week') || '';
    console.log("THIS IS Q",uid , weekNumber)
    const connection = await connectDB();
    if(!uid || !weekNumber)
    {
        return NextResponse.json({status:0, message:"missing arguments"})
    }
    
    const [rows] = await connection.query('SELECT * FROM entries WHERE uid = ? AND week_no = ?', [uid,weekNumber]);
    console.log("done")
    console.log(rows)
    const result = rows as any[]
    if(result.length === 0)
    {
      return NextResponse.json({message:'No user'},{status:400}) 
    }
    return NextResponse.json(result);
    } catch (error:any) {
        console.error('Error fetching entry:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}