import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    console.log("THIS IS START" , req.nextUrl.searchParams, " This is End")
    const url = req.nextUrl.searchParams;
    const id = url.get('id') || '';
    const start = url.get('start') || '';
    const end = url.get('end') || '';
    console.log(id , start , end)
    if (!id) {
      return NextResponse.json({ error: 'User ID not provided' }, { status: 400 });
    }
    const connection = await connectDB();
    const [rows] = await connection.query('SELECT * FROM main WHERE id = ? AND date BETWEEN ? AND ?', [id ,start,end]);
    console.log(rows)
    const result = rows as any[];
    console.log("After user")
    if (result.length === 0) {
        return NextResponse.json({ error: 'User not found' }, { status: 500 });
    }
    console.log(result[0])
    return NextResponse.json(rows);
  } catch (error: any) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}