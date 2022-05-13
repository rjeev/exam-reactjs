import React from 'react';
// import Navbar from './navbar'
// import Footer from './footer'
import { styled, useTheme } from '@mui/material/styles';


const drawerWidth = 240;

export default function LoginLayout({ children }) {

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  return (
    <>
      <main>{children}</main>
    </>
  )
}
