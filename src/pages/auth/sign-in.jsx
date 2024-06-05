import React, { useState } from 'react';
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { login, logout } from '@/commons/authService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/commons/authContext';

export function SignIn() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  logout();

  const handleLogin = async (event) => {
    event.preventDefault();
    handleChange();

    const formData = new FormData(event.target);
    const res = await login(formData);

    if (res.code === 1 ){
      setAuth(res.data.jwtToken);
      navigate('/dashboard/home');
    }else if(res.code === -6 ) {
      setGeneralError(res.message);
    } else if (res.code === -1) {
      setPasswordError(res.message);
    } else{
      setUsernameError(res.message);
    } 

  };
    const handleChange = () => {
    setUsernameError('');
    setPasswordError('');
    setGeneralError('');
    };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign In</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Enter your username and password to Sign In.
          </Typography>
        </div>
        <div>
          <form onSubmit={handleLogin} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <div className="mb-1 flex flex-col gap-6">
              {generalError && (
                <div className="rounded-none border-l-4 border-red-500 bg-red-500/10 p-2 font-medium text-red-500">
                  {generalError}
                </div>
              )}
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Your Username
              </Typography>
              <Input
                name="username"
                size="lg"
                placeholder="name@mail.com"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                onChange={handleChange}
              />
              {usernameError && (
                <div className="rounded-none border-l-4 border-red-500 bg-red-500/10 p-2 font-medium text-red-500">
                  {usernameError}
                </div>
              )}
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Password
              </Typography>
              <Input
                name="password"
                type="password"
                size="lg"
                placeholder="********"
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                onChange={handleChange}
              />
              {passwordError && (
                <div className="rounded-none border-l-4 border-red-500 bg-red-500/10 p-2 font-medium text-red-500">
                  {passwordError}
                </div>
              )}
            </div>
            <Button type="submit" className="mt-6" fullWidth>
              Sign In
            </Button>
          </form>
        </div>
      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
    </section>
  );
}

export default SignIn;
