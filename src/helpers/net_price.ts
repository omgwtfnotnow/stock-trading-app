

export const  buy_net_price = (buy_net_price:number)=>{
    const result:number  = buy_net_price + (buy_net_price*0.12) ;
    console.log(result)
    return parseFloat(result.toFixed(5));
  };

export const sell_net_price=(sell_net_price:number)=>{
  const result:number = sell_net_price - (sell_net_price*0.12);
  return parseFloat(result.toFixed(5));
}

