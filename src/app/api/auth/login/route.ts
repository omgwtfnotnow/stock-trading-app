import { NextResponse , NextRequest} from "next/server";
import connectDB from "@/lib/db";
import bcryptjs from 'bcryptjs'

export async function POST(request:NextRequest){
    try {
        const connection = await connectDB();
        const req= await request.json()
        const { email, password } = req;
        
        let query: string = 'SELECT * FROM users WHERE email =?';
        const [result]= await connection.execute(query, [email]);
        const rows = result as any[];
        const dbpass = rows[0].password
        console.log("start",rows , "rowss"," DB PASS" , dbpass)
        if (rows.length<0) {
            return NextResponse.json({Error:"User does not exist"},{status:400})
        } 
        console.log("User exist")
        const validPassword = bcryptjs.compare(password,dbpass);
        if(!validPassword){
            return NextResponse.json({Error:"Incorrect Password"},{status:400})
        }
        return NextResponse.json({message:"Login successfull"},{status:200})
        connection.end();


    } catch (error:any) {
        return NextResponse.json({ERror:error.message},{status:500})
    }
}