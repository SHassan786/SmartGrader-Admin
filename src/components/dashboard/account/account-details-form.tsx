'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Unstable_Grid2';
import { API_URLS } from '@/api';
import axios from 'axios';
import { useState } from 'react';

// const states = [
//   { value: 'alabama', label: 'Alabama' },
//   { value: 'new-york', label: 'New York' },
//   { value: 'san-francisco', label: 'San Francisco' },
//   { value: 'los-angeles', label: 'Los Angeles' },
// ] as const;

export interface Profile {
  name: string;
  password: string;
}

export interface AccountDetailsFormProps {
  onUpdateUser: (user: { name: string; email: string }) => void;
}

const updateProfile = async ({ name, password }: Profile): Promise<void> => {
  try {
    // add token to the header as Bearer token
    const token = localStorage.getItem('custom-auth-token');
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const body = { name, password };
    console.log(body);
    const response = await axios.put(API_URLS.updateProfileDetails, body, { headers });
    if (response.status !== 200) {
      console.error('Error updating user:', response);
      return;
    }
    console.log(response.data);

    // update the local storage
    localStorage.setItem('user-name', name);

  } catch (error) {
    console.error('Error updating user:', error);
  }
}

export function AccountDetailsForm({ onUpdateUser }: AccountDetailsFormProps): React.JSX.Element {

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState(localStorage.getItem('user-name') || '');
  const [password, setPassword] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("pressed");
    await updateProfile({ name, password });
    onUpdateUser({ name, email: localStorage.getItem('user-email') || '' });
  }

  return (
    <form
      onSubmit={handleSubmit}
    >
      <Card>
        <CardHeader subheader="The information can be edited" title="Profile" />
        <Divider />
        <CardContent>
          <Grid container spacing={3}>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Name</InputLabel>
                <OutlinedInput 
                  label="Name" 
                  name="name" 
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Password</InputLabel>
                <OutlinedInput 
                  label="Password" 
                  name="password" 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  endAdornment={
                    <IconButton
                      edge="end"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                    </IconButton>
                  }
                />
              </FormControl>
            </Grid>
            {/* <Grid md={6} xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Email address</InputLabel>
                <OutlinedInput defaultValue={localStorage.getItem('user-email')} label="Email address" name="email" />
              </FormControl>
            </Grid> */}
            {/* <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <OutlinedInput label="Phone number" name="phone" type="tel" />
              </FormControl>
            </Grid> */}
            {/* <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>State</InputLabel>
                <Select defaultValue="New York" label="State" name="state" variant="outlined">
                  {states.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid> */}
            {/* <Grid md={6} xs={12}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <OutlinedInput label="City" />
              </FormControl>
            </Grid> */}
          </Grid>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button variant="contained" type="submit">
              Save details
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
