import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ResultSetHeader } from 'mysql2';

export async function POST(req:NextRequest) {
    try {
        const request = await req.json()
        const { username, email, phonenumber } = request
        if (!username) {
            return NextResponse.json({ message: 'Please fill out all required fields' }, { status: 400 });
          }
        const phone = phonenumber ? phonenumber: null
          const emailId = email ? email: null
        const connection = await connectDB();
        const query = 'INSERT INTO users(username , email , phoneNumber) values(?,? , ?)';
        const value = [username ,emailId, phonenumber]
        const [result] = await connection.query<ResultSetHeader>(query, value);
        const insertId = result.insertId;
  
        console.log("Inserted Newuser with ID:", result);
        return NextResponse.json({ message: 'Newuser saved successfully', tradeId: insertId }, { status: 201 });


    } catch (error:any) {
        console.error('Error saving Newuser:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}