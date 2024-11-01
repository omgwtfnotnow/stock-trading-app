import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { ResultSetHeader } from 'mysql2';
import { buy_net_price, sell_net_price } from '@/helpers/net_price';
import dayjs from 'dayjs';
import weekOfYear from 'dayjs/plugin/weekOfYear'
dayjs.extend(weekOfYear)
export async function POST(req: NextRequest) {
  try {
    const request = await req.json();
    console.log("THIS IS SaveTrade " , request)
    const {uid, date, item, expiry, lotsize, numberlot, buyqty, buyprice, sellqty, sellprice } = request;
    
    if (!uid|| !date || !item || !expiry || !lotsize || !numberlot || !buyqty || !buyprice) {
      return NextResponse.json({ message: 'Please fill out all required fields' }, { status: 400 });
    }
    
    const connection = await connectDB();
    const weekNo = dayjs(date).week()
    const net_buy_price:number = buy_net_price(buyprice);
    let query;
    let values;
    if (sellqty && sellprice) {
      console.log("HERE")
      const net_sell_price:number = sell_net_price(sellprice); 
      query = 'INSERT INTO ENTRIES (uid, date, item, expiry, lot_size, no_of_lot, buy_qty, buy_price, buy_net_price, sell_qty, sell_price, sell_net_price, week_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      values = [uid, date, item, expiry, lotsize, numberlot, buyqty, buyprice, net_buy_price, sellqty, sellprice, net_sell_price, weekNo];

    } else {
      query = 'INSERT INTO ENTRIES (uid, date, item, expiry, lot_size, no_of_lot, buy_qty, buy_price, buy_net_price, week_no) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
      values = [uid, date, item, expiry, lotsize, numberlot, buyqty, buyprice, net_buy_price, weekNo];
    }
  
    const [result] = await connection.query<ResultSetHeader>(query, values);
    const insertId = result.insertId;
  
    console.log("Inserted trade with ID:", result);
    return NextResponse.json({ message: 'Trade saved successfully', tradeId: insertId }, { status: 201 });


  } catch (error: any) {
    console.error('Error saving trade:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
