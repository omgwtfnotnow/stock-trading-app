"use client"
import * as React from 'react';
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { Button, FormControl, Grid, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { updateUser } from '@/helpers/search';

interface FormData {
  id: string;
  uid: number;
  date: Dayjs | null;
  item: string;
  expiry: Dayjs | null;
  lotsize: string;
  numberlot: string;
  buyqty: number;
  sellqty: string | "";
  sellprice: string | "";
  buyprice: string | "";
}

function createData(
    id: string,
    uid: number,
    date: Dayjs,
    item: string,
    expiry: Dayjs,
    lotsize: string,
    numberlot: string,
    buyqty: number,
    buyprice: string | "",
    sellqty: string | "",
    sellprice: string | "",
  ) {
    return {
      id,
      uid,
      date,
      item,
      expiry,
      lotsize,
      numberlot,
      buyqty,
      buyprice:buyprice !== null ? buyprice : "",
      sellqty: sellqty !== null ? sellqty : "",
      sellprice: sellprice !== null ? sellprice : "",
    };
  }


function Row(props: { row: ReturnType<typeof createData> }) {
  const { row } = props;
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    id: "",
    uid: 0,
    date: dayjs(),
    item: "",
    expiry: dayjs(),
    lotsize: "",
    numberlot: "",
    buyqty: 0,
    buyprice: "",
    sellqty: "",
    sellprice: "",
  });

  useEffect(() => {
    setFormData({
      id: row.id,
      uid: row.uid,
      date: row.date,
      item: row.item,
      expiry: row.expiry,
      lotsize: row.lotsize,
      numberlot: row.numberlot,
      buyqty: row.buyqty,
      buyprice: row.buyprice,
      sellqty: row.sellqty,
      sellprice: row.sellprice,
    });
  }, [row]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requiredFields: (keyof FormData)[] = [
      "id",
      "uid",
      "date",
      "item",
      "expiry",
      "lotsize",
      "numberlot",
      "buyqty",
    ];
    for (let key of requiredFields) {
      if (formData[key] === "") {
        alert(`Please fill out the ${key} field.`);
        return;
      }
    }

    const dataToSubmit = {
      ...formData,
      lotsize: parseFloat(formData.lotsize),
      numberlot: parseFloat(formData.numberlot),
      buyprice: parseFloat(formData.buyprice),
      sellqty: formData.sellqty === "" ? 0 : parseFloat(formData.sellqty),
      sellprice: formData.sellprice === "" ? 0 : parseFloat(formData.sellprice),
    };

    const response = await updateUser(dataToSubmit);
    console.log(response);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{row.date.format('YYYY-MM-DD')}</TableCell>
        <TableCell>{row.expiry.format('YYYY-MM-DD')}</TableCell>
        <TableCell>{row.item}</TableCell>
        <TableCell>{row.lotsize}</TableCell>
        <TableCell>{row.numberlot}</TableCell>
        <TableCell>{row.buyqty}</TableCell>
        <TableCell>{row.buyprice}</TableCell>
        <TableCell>{row.sellqty}</TableCell>
        <TableCell>{row.sellprice}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={10}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Update
              </Typography>
              <form onSubmit={handleSubmit}>
                <Table size="small" aria-label="purchases">
                  <TableHead sx={{ backgroundColor: 'black', color: 'white' }}>
                    <TableRow>
                      <TableCell>Entities</TableCell>
                      <TableCell>Input</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>
                        <Grid item xs={6} sm={6}>
                          <FormControl>
                            <DatePicker
                              label="Date"
                              value={formData.date??undefined}
                              onChange={(date) => setFormData((prevData) => ({ ...prevData, date: date as Dayjs }))}
                            />
                          </FormControl>
                        </Grid>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Expiry</TableCell>
                      <TableCell>
                        <Grid item xs={6} sm={6}>
                          <FormControl>
                            <DatePicker
                              label="Expiry"
                              value={formData.expiry??undefined}
                              onChange={(date) => setFormData((prevData) => ({ ...prevData, expiry: date as Dayjs }))}
                            />
                          </FormControl>
                        </Grid>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Item</TableCell>
                      <TableCell>
                        <Grid item xs={6} sm={6}>
                          <TextField
                            label="Item"
                            name="item"
                            type="text"
                            value={formData.item??""}
                            onChange={handleChange}
                          />
                        </Grid>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Lot size</TableCell>
                      <TableCell>
                        <Grid item xs={6} sm={6}>
                          <TextField
                            label="Lot size"
                            name="lotsize"
                            type="number"
                            value={formData.lotsize??""}
                            onChange={handleChange}
                          />
                        </Grid>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Total lot</TableCell>
                      <TableCell>
                        <Grid item xs={6} sm={6}>
                          <TextField
                            label="Number of lot"
                            name="numberlot"
                            type="number"
                            value={formData.numberlot??""}
                            onChange={handleChange}
                          />
                        </Grid>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Buy Qty.</TableCell>
                      <TableCell>
                        <Grid item xs={6} sm={6}>
                          <TextField
                            label="BuyQty"
                            name="buyqty"
                            type="number"
                            value={formData.buyqty??""}
                            onChange={handleChange}
                          />
                        </Grid>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Buy price</TableCell>
                      <TableCell>
                        <Grid item xs={6} sm={6}>
                          <TextField
                            label="Buy price"
                            name="buyprice"
                            type="number"
                            value={formData.buyprice??""}
                            onChange={handleChange}
                          />
                        </Grid>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sell Qty.</TableCell>
                      <TableCell>
                        <Grid item xs={6} sm={6}>
                          <TextField
                            label="SellQty."
                            name="sellqty"
                            type="number"
                            value={formData.sellqty??""}
                            onChange={handleChange}
                          />
                        </Grid>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Sell price</TableCell>
                      <TableCell>
                        <Grid item xs={6} sm={6}>
                          <TextField
                            label="Sell price"
                            name="sellprice"
                            type="number"
                            value={formData.sellprice??""}
                            onChange={handleChange}
                          />
                        </Grid>
                      </TableCell>
                    </TableRow>
                <Box sx={{ pt: 2, display: "flex", width: "100%", justifyContent: "center" }}>
                  <Button type="submit" variant="contained" color="success">
                    Submit
                  </Button>
                </Box>
                  </TableBody>
                </Table>
              </form>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export default function CollapsibleTable({ row }: { row: any[] }) {
    console.log("THIS",row)
    const processedRows = Object.values(row).map((rowData) => {
      return createData(
        rowData.id,
        rowData.UID,
        dayjs(rowData.date),
        rowData.item,
        dayjs(rowData.expiry),
        rowData.lot_size,
        rowData.no_of_lot,
        rowData.buy_qty,
        rowData.buy_price,
        rowData.sell_qty,
        rowData.sell_price,
      );
    });
  
    console.log(processedRows, "processedRows");
  
    return (
      <TableContainer component={Paper}>
        <Table aria-label="collapsible table">
          <TableHead sx={{ backgroundColor: 'black', color: 'white' }}>
            <TableRow>
              <TableCell />
              <TableCell>Date</TableCell>
              <TableCell>Expiry</TableCell>
              <TableCell>Item</TableCell>
              <TableCell>Lot size</TableCell>
              <TableCell>Total lot</TableCell>
              <TableCell>Buy Qty.</TableCell>
              <TableCell>Buy price</TableCell>
              <TableCell>Sell Qty.</TableCell>
              <TableCell>Sell price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {processedRows ? Object.values(processedRows).map((rows) => (
              <Row key={rows.id} row={rows} />
            )):"Not Found"}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }
