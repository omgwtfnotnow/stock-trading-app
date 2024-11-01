
import connectDB from '@/lib/db';
import { NextRequest , NextResponse} from 'next/server';
import { sell_net_price, buy_net_price } from '@/helpers/net_price';
import { ResultSetHeader } from 'mysql2';

export async function POST(req:NextRequest) {
  
    
    try {
        const request = await req.json()
        const connection = await connectDB()
        const { id, date, item, expiry, lotsize, numberlot, buyqty, sellqty, sellprice, buyprice } = request;
        const net_buy_price = buy_net_price(buyprice)
        let querii;
        let values;
        if(sellprice && sellqty)
        {
            const net_sell_price = sell_net_price(sellprice)
            querii = 'UPDATE ENTRIES SET date = ?, item = ?, expiry = ?, lot_size = ?, no_of_lot = ?, buy_qty = ?, sell_qty = ?, sell_price = ?, buy_price = ? , buy_net_price = ?, sell_net_price=? WHERE id = ?';
            values = [ date, item, expiry, lotsize, numberlot, buyqty, sellqty, sellprice, buyprice, net_buy_price, net_sell_price , id]
        }
        else{
             querii = 'UPDATE ENTRIES SET date = ?, item = ?, expiry = ?, lot_size = ?, no_of_lot = ?, buy_qty = ?,   buy_price = ?, buy_net_price=? WHERE id = ?'
             values = [ date, item, expiry, lotsize, numberlot, buyqty,  buyprice, net_buy_price, id]
        }
        const [result] = await connection.query<ResultSetHeader>(querii, values);
        const insertId = result.insertId;
  
        console.log("UPDATED trade with ID:", result);
        return NextResponse.json({ message: 'Trade saved successfully', tradeId: insertId }, { status: 201 });
      
      
    } catch (error:any) {
        console.error('Error updating trade:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
