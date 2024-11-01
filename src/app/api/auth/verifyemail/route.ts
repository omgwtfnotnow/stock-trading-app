import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
export async function POST(request:NextRequest){
    try {
        const connection = await connectDB();
        const req = await request.json();
        const {token} = req;
        console.log(token)
        let querii = "SELECT * FROM users WHERE verifyToken = ? , verifyTokenExpiry = ?";
        const [user] = await connection.query(querii , [token , Date.now()])
        const users  = user as any [];
        console.log(users)
        if(users.length == 0)
        { 
            return NextResponse.json({error:"Invalid token"},{status:500})
        }
        const ID = users[0].id;
        querii = "UPDATE users SET isVerified = ? , verifyToken = ? verifyTokenExpiry = ? WHERE id = ?"
        const result = await connection.query(querii , [true , undefined,undefined,ID])
        console.log(result)
        return NextResponse.json({message:"Email verified succesfully"},{status:200})

    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500})
    }
}