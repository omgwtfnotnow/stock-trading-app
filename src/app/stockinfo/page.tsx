"use client"; // Ensure this directive is added at the top for client-side rendering

import React, { useEffect, useState } from 'react';
import { getNiftyData } from '../services/page';

interface QuoteCryptoCurrency {
  symbol: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
}

const StockInfo: React.FC = () => {
  const [niftyData, setNiftyData] = useState<QuoteCryptoCurrency | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getNiftyData();
        if (data) {
          console.log(data);
          setNiftyData(data);
        } else {
          console.error('Fetched data does not match NiftyData interface');
        }
      } catch (error) {
        console.error('Error fetching Nifty data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Nifty 50 Index Information</h1>
      {niftyData && (
        <div>
          <p>Symbol: {niftyData.symbol}</p>
          <p>Price: {niftyData.regularMarketPrice}</p>
          <p>Change: {niftyData.regularMarketChange}</p>
          <p>Changes Percent: {niftyData.regularMarketChangePercent}%</p>
        </div>
      )}
    </div>
  );
};

export default StockInfo;