import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const q = url.searchParams.get('id') || '';
    console.log("THIS IS Q",q)
    const connection = await connectDB();
    const [rows] = await connection.query('SELECT id, username FROM users WHERE username LIKE ?', [`%${q}%`]);
    console.log("done")
    console.log(rows)
    const result = rows as any[]
    if(result.length === 0)
    {
      return NextResponse.json({message:'No user'},{status:400}) 
    }
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error in searching user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
