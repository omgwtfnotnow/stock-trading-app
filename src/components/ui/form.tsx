"use client";

import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Grid,
  FormControl,
  ListItem,
  ListItemText,
  List,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { searchUser } from "@/helpers/search";

interface FormData {
  username: string;
  uid: number;
  date: Dayjs;
  item: string;
  expiry: Dayjs | null;
  lotsize: string;
  numberlot: string;
  buyqty: number;
  sellqty: string;
  sellprice: string;
  buyprice: string;
}

const Form: React.FC = () => {
  const [searchResults, setSearchResults] = useState<
    { id: number; username: string }[]
  >([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [userN, setuserN] = useState<string>("");

  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [formData, setFormData] = useState<FormData>({
    username: "",
    uid: 0,
    date: dayjs(),
    item: "",
    expiry: null,
    lotsize: "",
    numberlot: "",
    buyqty: 0,
    sellqty: "",
    sellprice: "",
    buyprice: "",
  });

  useEffect(() => {
    const lotsize = parseFloat(formData.lotsize) || 0;
    const numberlot = parseFloat(formData.numberlot) || 0;
    setFormData((prevData) => ({
      ...prevData,
      buyqty: lotsize * numberlot,
    }));
  }, [formData.lotsize, formData.numberlot]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (searchQuery.length > 2) {
        const data = await searchUser(searchQuery);
        setSearchResults(data);
      } else {
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  useEffect(() => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      uid: selectedUserId !== null ? selectedUserId : 0,
      username: userN,
    }));
  }, [selectedUserId]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const requiredFields: (keyof FormData)[] = [
      "username",
      "uid",
      "date",
      "item",
      "expiry",
      "lotsize",
      "numberlot",
      "buyqty",
      "buyprice",
    ];

    for (let key of requiredFields) {
      if (formData[key] === "" || formData[key] === null) {
        alert(`Please fill out the ${key} field.`);
        return;
      }
    }

    const dataToSubmit = {
      ...formData,
      date: formData.date.format("YYYY-MM-DD"),
      expiry: formData.expiry?.format("YYYY-MM-DD") || null,
      lotsize: parseFloat(formData.lotsize),
      numberlot: parseFloat(formData.numberlot),
      buyprice: parseFloat(formData.buyprice),
      sellqty: formData.sellqty === "" ? 0 : parseFloat(formData.sellqty),
      sellprice: formData.sellprice === "" ? 0 : parseFloat(formData.sellprice),
    };

    const response = await fetch("/api/savetrade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    });

    if (response.ok) {
      alert("Form submitted successfully");
    } else {
      alert("Failed to submit the form");
    }
  };

  const getLastThursdayOfMonth = (date: Dayjs): Dayjs => {
    const endOfMonth = date.endOf("month");
    let lastThursday = endOfMonth.subtract(1, "week").day(4);
    if (lastThursday.isAfter(endOfMonth)) {
      lastThursday = endOfMonth.subtract(1, "week").day(4);
    }
    return lastThursday;
  };

  useEffect(() => {
    if (formData.date) {
      const expiryDate = getLastThursdayOfMonth(formData.date);
      setFormData((prevData) => ({ ...prevData, expiry: expiryDate }));
    }
  }, [formData.date]);

  return (
    <Box sx={{ display: "flex", width: "100%", justifyContent: "center" }}>
      <Box maxWidth="md" width="100%">
        <Card elevation={4}>
          <CardHeader title="Trading Details" />
          <CardContent sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Search Username"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Username"
                    helperText="Username required"
                  />
                  {searchResults.length > 0 && (
                    <List>
                      {searchResults.map((user) => (
                        <ListItem
                          button
                          key={user.id}
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setuserN(user.username);
                          }}
                        >
                          <ListItemText primary={user.username} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <DatePicker
                      label="Date"
                      value={formData.date}
                      onChange={(date) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          date: date as Dayjs,
                        }))
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Item"
                    name="item"
                    type="text"
                    value={formData.item}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <DatePicker
                      label="Expiry (Last Thursday of the Month)"
                      value={formData.expiry}
                      onChange={(date) =>
                        setFormData((prevData) => ({
                          ...prevData,
                          expiry: date as Dayjs,
                        }))
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    required
                    label="Lot Size"
                    name="lotsize"
                    type="number"
                    value={formData.lotsize}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Number of Lots"
                    name="numberlot"
                    type="number"
                    value={formData.numberlot}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Buy Quantity"
                    name="buyqty"
                    type="number"
                    value={formData.buyqty}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Buy Price"
                    name="buyprice"
                    type="number"
                    value={formData.buyprice}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sell Quantity"
                    name="sellqty"
                    type="number"
                    value={formData.sellqty}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Sell Price"
                    name="sellprice"
                    type="number"
                    value={formData.sellprice}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <Box
                sx={{
                  pt: 2,
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                <Button type="submit" variant="contained" color="success">
                  Submit
                </Button>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default Form;
