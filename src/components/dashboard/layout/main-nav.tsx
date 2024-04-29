'use client';

import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { Bell as BellIcon } from '@phosphor-icons/react/dist/ssr/Bell';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import { Users as UsersIcon } from '@phosphor-icons/react/dist/ssr/Users';
import axios from 'axios';
import { API_URLS } from '@/api';

import { usePopover } from '@/hooks/use-popover';

import { MobileNav } from './mobile-nav';
import { UserPopover } from './user-popover';

export function MainNav(): React.JSX.Element {
  const [openNav, setOpenNav] = React.useState<boolean>(false);
  const [pfppath, setPfppath] = React.useState<string>('');

  const userPopover = usePopover<HTMLDivElement>();

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

  React.useEffect(() => {
    fetchData();
  }, []);


  return (
    <React.Fragment>
      <Box
        component="header"
        sx={{
          borderBottom: '1px solid var(--mui-palette-divider)',
          backgroundColor: 'var(--mui-palette-background-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 'var(--mui-zIndex-appBar)',
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{ alignItems: 'center', justifyContent: 'space-between', minHeight: '64px', px: 2 }}
        >
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <IconButton
              onClick={(): void => {
                setOpenNav(true);
              }}
              sx={{ display: { lg: 'none' } }}
            >
              <ListIcon />
            </IconButton>
            <Tooltip title="Search">
              <IconButton>
                <MagnifyingGlassIcon />
              </IconButton>
            </Tooltip>
          </Stack>
          <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
            <Tooltip title="Contacts">
              <IconButton>
                <UsersIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <Badge badgeContent={4} color="success" variant="dot">
                <IconButton>
                  <BellIcon />
                </IconButton>
              </Badge>
            </Tooltip>
            {
              (<Avatar
                onClick={userPopover.handleOpen}
                ref={userPopover.anchorRef}
                // if the profile picture is not available, use the default avatar
                src={`${pfppath}`}

                sx={{ cursor: 'pointer' }}
              />)
            }
          </Stack>
        </Stack>
      </Box>
      <UserPopover anchorEl={userPopover.anchorRef.current} onClose={userPopover.handleClose} open={userPopover.open} email={localStorage.getItem('user-email') || ''} name={localStorage.getItem('user-name') || ''} />
      <MobileNav
        onClose={() => {
          setOpenNav(false);
        }}
        open={openNav}
      />
    </React.Fragment>
  );
}
