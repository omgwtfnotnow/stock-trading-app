"use client";
import { useEffect, useState, useRef } from "react";
import protobuf from "protobufjs";
import { Buffer } from "buffer/";
import Link from "next/link";
import { Grid, Button, Box, Typography, TextField, Autocomplete } from "@mui/material";

interface StockData {
  id: string;
  price: number;
}

const stockNames = [
  "RELIANCE.NS", "TCS.NS", "HDFCBANK.NS", "ICICIBANK.NS", "BHARTIARTL.NS",
  "SBIN.NS", "INFY.NS", "LICI.NS", "ITC.NS", "HINDUNILVR.NS",
  "LT.NS", "BAJFINANCE.NS", "HCLTECH.NS", "MARUTI.NS", "SUNPHARMA.NS",
  "ADANIENT.NS", "KOTAKBANK.NS", "TITAN.NS", "ONGC.NS", "TATAMOTORS.NS",
  "NTPC.NS", "AXISBANK.NS", "DMART.NS", "ADANIGREEN.NS", "ADANIPORTS.NS",
  "ULTRACEMCO.NS", "ASIANPAINT.NS", "COALINDIA.NS", "BAJAJFINSV.NS", "BAJAJ-AUTO.NS",
  "POWERGRID.NS", "NESTLEIND.NS", "WIPRO.NS", "M&M.NS", "IOC.NS",
  "JIOFIN.NS", "HAL.NS", "DLF.NS", "ADANIPOWER.NS", "JSWSTEEL.NS",
  "TATASTEEL.NS", "SIEMENS.NS", "IRFC.NS", "VBL.NS", "ZOMATO.NS",
  "PIDILITIND.NS", "GRASIM.NS", "SBILIFE.NS", "BEL.NS", "LTIM.NS",
  "TRENT.NS", "PNB.NS", "INDIGO.NS", "BANKBARODA.NS", "HDFCLIFE.NS",
  "ABB.NS", "BPCL.NS", "PFC.NS", "GODREJCP.NS", "TATAPOWER.NS",
  "HINDALCO.NS", "HINDZINC.NS", "TECHM.NS", "AMBUJACEM.NS", "INDUSINDBK.NS",
  "CIPLA.NS", "GAIL.NS", "RECLTD.NS", "BRITANNIA.NS", "UNIONBANK.NS",
  "ADANIENSOL.NS", "IOB.NS", "LODHA.NS", "EICHERMOT.NS", "CANBK.NS",
  "TATACONSUM.NS", "DRREDDY.NS", "TVSMOTOR.NS", "ZYDUSLIFE.NS", "ATGL.NS",
  "VEDL.NS", "CHOLAFIN.NS", "HAVELLS.NS", "HEROMOTOCO.NS", "DABUR.NS",
  "SHREECEM.NS", "MANKIND.NS", "BAJAJHLDNG.NS", "DIVISLAB.NS", "APOLLOHOSP.NS",
  "NHPC.NS", "SHRIRAMFIN.NS", "BOSCHLTD.NS", "TORNTPHARM.NS", "ICICIPRULI.NS",
  "IDBI.NS", "JSWENERGY.NS", "JINDALSTEL.NS", "BHEL.NS", "INDHOTEL.NS",
  "CUMMINSIND.NS", "ICICIGI.NS", "BTC-USD"
];

export default function Live() {
  const [currentStocks, setCurrentStocks] = useState<Record<string, StockData>>({});
  const previousStocks = useRef<Record<string, StockData>>({});
  const [marketOpen, setMarketOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [highlightedStock, setHighlightedStock] = useState("");

  useEffect(() => {
    const ws = new WebSocket("wss://streamer.finance.yahoo.com");

    protobuf.load("./YPricingData.proto", (error, root) => {
      if (error || !root) {
        console.error("Failed to load protobuf:", error);
        return;
      }
      const Yaticker = root.lookupType("yaticker");
      ws.onopen = () => {
        console.log("connected");
        ws.send(JSON.stringify({ subscribe: stockNames }));
      };
      ws.onclose = () => {
        console.log("disconnected");
      };
      ws.onmessage = (message) => {
        console.log("incoming message");
        const decodedMessage = Yaticker.decode(new Buffer(message.data, "base64"));
        const next = decodedMessage as unknown as StockData;
        setCurrentStocks((prevStocks) => {
          const newStocks = { ...prevStocks, [next.id]: next };
          previousStocks.current[next.id] = prevStocks[next.id];
          return newStocks;
        });
      };
    });

    const checkMarketStatus = () => {
      const now = new Date();
      const marketCloseTime = new Date();
      marketCloseTime.setHours(15, 30, 0); // Market closes at 3:30 PM
      setMarketOpen(now <= marketCloseTime);
    };

    checkMarketStatus();
    const interval = setInterval(checkMarketStatus, 60000); // Check every minute

    return () => {
      ws.close();
      clearInterval(interval);
    };
  }, []);

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const stockSymbol = searchInput.toUpperCase();
    if (stockNames.includes(stockSymbol)) {
      if (!currentStocks[stockSymbol]) {
        alert(`${stockSymbol} is not available at the moment.`);
      } else {
        setHighlightedStock(stockSymbol);
      }
    } else {
      alert(`${stockSymbol} is not a valid stock symbol.`);
    }
    setSearchInput("");
  };

  const moveStockToTop = (stockId: string) => {
    const filteredStocks = stockNames.filter((stock) => stock !== stockId);
    return [stockId, ...filteredStocks];
  };

  return (
    <Box sx={{ backgroundColor: '#000000', minHeight: '100vh', padding: '20px' }}>
      <Typography variant="h4" sx={{ textAlign: "center", color: "#ffffff" }}>
        {marketOpen ? "Market is open ❤️" : "Market is closed 💔"}
      </Typography>
      <Box component="form" onSubmit={handleSearchSubmit} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, py: 2 }}>
        <Autocomplete
          value={searchInput}
          sx={{ width: '300px' }}
          onChange={(e, value) => handleSearchInputChange(value || '')}
          options={stockNames}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Enter Stock Symbol"
              InputLabelProps={{
                shrink: true,
              }}
              variant="outlined"
              value={searchInput}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              sx={{ color: "#ffffff" }}
            />
          )}
        />
        <Button type="submit" variant="contained">
          Search
        </Button>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="outlined">
          <Link href="/live/futurestock" style={{ color: "#ffffff", textDecoration: "none" }}>FutureStock list</Link>
        </Button>
      </Box>
      <Grid container spacing={2} justifyContent="center" style={{ marginTop: '20px' }}>
        {moveStockToTop(highlightedStock).map((stockId) => {
          const currentPrice = currentStocks[stockId]?.price || 0;
          const previousPrice = previousStocks.current[stockId]?.price || 0;
          const isPriceIncreased = previousPrice && currentPrice > previousPrice;
          const isPriceDecreased = previousPrice && currentPrice < previousPrice;

          return (
            <Grid item xs={6} sm={4} md={3} lg={2} key={stockId}>
              <Box
                sx={{
                  padding: 2,
                  border: "1px solid #ffffff",
                  borderRadius: 5,
                  textAlign: "center",
                  backgroundColor: stockId === highlightedStock ? "#ffffff" : "#000000",
                  boxShadow: stockId === highlightedStock ? "0 4px 8px rgba(0, 0, 0, 0.2)" : "none",
                  cursor: "pointer",
                }}
                onClick={() => setHighlightedStock(stockId)}
              >
                <Typography variant="h6" sx={{ color: stockId === highlightedStock ? "#000000" : "#ffffff" }}>
                  {stockId}
                </Typography>
                <Typography variant="h5" sx={{ color: isPriceIncreased ? "green" : isPriceDecreased ? "red" : "inherit" }}>
                  ₹{currentPrice.toFixed(2)}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
