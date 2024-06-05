import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  CubeIcon, // Barang
  ArrowsRightLeftIcon, // Transaksi
  ListBulletIcon, // Kategori Produk
  UserIcon, // User
  DocumentTextIcon, // Laporan
  ClockIcon, // History Transaksi
  ArrowRightOnRectangleIcon, // Logout
  HomeIcon, // Dashboard
} from "@heroicons/react/24/solid";
import { NavLink } from 'react-router-dom';
import { Button,Typography } from "@material-tailwind/react";// Replace with your actual button component import
import { getToken, getEmployeeId } from '@/commons/authService';

const icon = {
  className: "w-5 h-5 text-inherit",
};

const iconMapping = {
  CubeIcon,
  ArrowsRightLeftIcon,
  ListBulletIcon,
  UserIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowRightOnRectangleIcon,
  HomeIcon,
};

const MenuItems = () => {
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jwtToken = await getToken();  
        const EmployeeId =  await getEmployeeId();

        const url = 'http://localhost:7110/Gateway/api/menu/tree';

        const headers = {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        };

        const body = {
          id: EmployeeId
        };

        const response = await axios.post(url, body, { headers });
        if (response.data.code === 1) {
          setMenuItems(response.data.data);
        } else {
          console.error('Unexpected response code:', response.data.code);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ul className="mb-4 flex flex-col gap-1">
      {menuItems.map(item => {
        const IconComponent = iconMapping[item.iconClass];
        return (
          <li key={item.id}>
            <NavLink to={`/${item.controller}`}>
              {({ isActive }) => (
                <Button
                  variant={isActive ? "gradient" : "text"}
                  color={
                    isActive
                      ? "sidenavColor"
                      : "sidenavType" === "dark"
                      ? "white"
                      : "blue-gray"
                  }
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                >
                  {IconComponent && <IconComponent {...icon} />}
                  <Typography
                        color="inherit"
                        className="font-medium capitalize"
                      >
                        {item.name}
                      </Typography>
                </Button>
              )}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
};

export default MenuItems;