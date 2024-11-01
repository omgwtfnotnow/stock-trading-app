"use client";
import React, { useState, useMemo, useEffect } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Grid from '@mui/material/Grid';
import { debounce } from '@mui/material/utils';
import { searchUser } from '@/helpers/search';

// Placeholder function for requesting username list from the backend
const requestUsernameList = async (input: string): Promise<{ id: string; username: string }[]> => {
  try {
    if (input.length > 0) {
      const data = await searchUser(input);
      if (Array.isArray(data)) {
        return data.map((user: { id: number; username: string }) => ({
          id: user.id.toString(),
          username: user.username
        }));
      } else {
        console.error('Unexpected data format:', data);
      }
    }
    return [];
  } catch (error) {
    console.error('Error fetching username list:', error);
    return [];
  }
};

// Define types for the username option
interface UsernameOption {
  id: string;
  username: string;
}

interface UsernameSearchProps {
  handleUID: (id: string) => void;
}

const UsernameSearch: React.FC<UsernameSearchProps> = ({ handleUID }) => {
  const [value, setValue] = useState<UsernameOption | null>(null);
  const [inputValue, setInputValue] = useState<string>('');
  const [options, setOptions] = useState<UsernameOption[]>([]);

  const fetch = useMemo(
    () =>
      debounce((input: string, callback: (results: UsernameOption[]) => void) => {
        requestUsernameList(input).then(callback);
      }, 400),
    [],
  );

  useEffect(() => {
    let active = true;

    if (inputValue === '') {
      setOptions(value ? [value] : []);
      return;
    }

    fetch(inputValue, (results) => {
      if (active) {
        const newOptions = value ? [value, ...results] : results;
        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  return (
    <Autocomplete
      id="username-search"
      getOptionLabel={(option) => option.username}
      filterOptions={(x) => x}
      options={options}
      autoComplete
      includeInputInList
      filterSelectedOptions
      value={value}
      noOptionsText="No usernames"
      fullWidth
      onChange={(event, newValue) => {
        setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        if (newValue) {
          handleUID(newValue.id);
        }
      }}
      onInputChange={(event, newInputValue) => {
        setInputValue(newInputValue);
      }}
      renderInput={(params) => <TextField {...params} label="Search usernames" fullWidth />}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          <Grid container alignItems="center">
            <Grid item>
              <Box component="span" sx={{ fontWeight: 'bold', marginRight: 1 }}>
                {option.username}
              </Box>
            </Grid>
          </Grid>
        </li>
      )}
    />
  );
};

export default UsernameSearch;
