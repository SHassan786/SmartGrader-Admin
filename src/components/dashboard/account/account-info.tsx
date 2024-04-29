'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import axios from 'axios';
import { API_URLS } from '@/api';

// const dummy_user = {
//   name: 'Sofia Rivers',
//   avatar: '/assets/avatar.png',
//   jobTitle: 'Senior Developer',
//   country: 'USA',
//   city: 'Los Angeles',
//   timezone: 'GTM-7',
// } as const;


export function AccountInfo({ user }: { user: { name: string; email: string } }): React.JSX.Element {
  const [pfppath, setPfppath] = React.useState<string>('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    try {
      // add token to the header as Bearer token
      const userName = localStorage.getItem('user-name');
      const userEmail = localStorage.getItem('user-email');
      const token = localStorage.getItem('custom-auth-token');
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const profileResponse = await axios.get(API_URLS.getProfile, { headers });
      if (profileResponse.status !== 200) {
        console.error('Error fetching user:', profileResponse);
        return;
      }
      let pfppath = profileResponse.data.teacher?.profile_picture?.path;

      pfppath = pfppath ? API_URLS.baseUrl + "/" + pfppath.replace(/\\/g, "/") : '';
      // use this path to get the profile picture and set it to the avatar
      console.log("Profile Picture Path", pfppath);
      setPfppath(pfppath);


    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      console.log("Selected file:", file);
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }
    console.log("Selected file:", selectedFile);
    try {
      const token = localStorage.getItem('custom-auth-token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      };

      const formData = new FormData();
      
      formData.append('profile_picture', selectedFile);

      const response = await axios.put(API_URLS.updateProfile, formData, { headers });

      console.log("Profile updated:", response.data);

      // Fetch the updated profile data to update the avatar
      fetchData();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);
  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar src={`${pfppath}`} sx={{ height: '80px', width: '80px' }} />
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user.email}
            </Typography>
            {/* <Typography color="text.secondary" variant="body2">
              {localStorage.getItem('user-name')}
            </Typography> */}
          </Stack>
        </Stack>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          fullWidth
          variant="text"
          onClick={() => fileInputRef.current?.click()}
        >
          Upload picture
        </Button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
        <Button fullWidth variant="contained" onClick={handleUpload}>
          Save picture
        </Button>
      </CardActions>
    </Card>
  );
}
