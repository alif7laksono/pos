import PropTypes from "prop-types";
import React, { useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
  Alert,
} from "@material-tailwind/react";

import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import MenuItems from '@/widgets/layout/menuItem'; // Adjust the import path according to your project structure

export function Sidenav({ brandImg, brandName, routes }) {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavColor, sidenavType, openSidenav } = controller;
  const [openAlert, setOpenAlert] = React.useState(false);
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-gray-800 to-gray-900",
    white: "bg-white shadow-sm",
    transparent: "bg-transparent",
  };

  return (
    <aside
      className={`${sidenavTypes[sidenavType]} ${
        openSidenav ? "translate-x-0" : "-translate-x-80"
      } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-72 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}
    >
      <div
        className={`relative`}
      >
        <Link to="/" className="py-6 px-8 text-center">
          <Typography
            variant="h6"
            color={sidenavType === "dark" ? "white" : "blue-gray"}
          >
            
            {brandName}
          </Typography>
        </Link>
        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>
      </div>
     
      <div className="m-4">
      <MenuItems />
      </div>
      <Alert
            open={openAlert}
            className="mt-auto"
            onClose={() => setOpenAlert(false)}
          >
            <ExclamationTriangleIcon className="mb-4 h-12 w-12" />
            <Typography variant="h6" className="mb-1">
            Kamu Belum Tutup Toko Kemarin
            </Typography>
            <Typography variant="small" className="font-normal opacity-80">
              Jangan lupa tutup toko dan input sisa uang di laci.
            </Typography>
            <div className="mt-4 flex gap-3">
             
              <Button
                as="a"
                href="#"
                variant="outlined"
                size="sm"
                className="font-medium text-white" 
                
              >
                Input Sekarang
              </Button>
            </div>
          </Alert>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "E-Retail",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
