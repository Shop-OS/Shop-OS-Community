import { LoadingOutlined } from '@ant-design/icons';
import { Button, Input, Spin } from 'antd';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { memo, use, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import GlowingButton from '@/components/GlowingButton';
import GlowingButtonStatic from '@/components/GlowingButton/GlowingButtonStatic';
import AxiosProvider from '@/utils/axios';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';

import { genSize, useStyles } from './style';
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const LogoThree = dynamic(() => import('@lobehub/ui/es/LogoThree'));
const LogoSpline = dynamic(() => import('@lobehub/ui/es/LogoThree/LogoSpline'));

const Hero = memo<{ mobile?: boolean; width: number }>(({ width, mobile }) => {
  const size: any = {
    base: genSize(width / 3.5, 240),
    desc: genSize(width / 50, 14),
    logo: genSize(width / 2.5, 180),
    title: genSize(width / 20, 32),
  };

  size.marginTop = mobile ? -size.logo / 9 : -size.logo / 3;
  size.marginBottom = mobile ? -size.logo / 9 : -size.logo / 4;
  const router = useRouter();

  const { styles } = useStyles(size.base);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [emailExists, setEmailExists] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      loginBtn();
    }
  };
  const loginBtn = async () => {
    try {
      if (!email || !password) {
        toast.error('Email and password are required');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        toast.error('Invalid email format');
        return;
      }

      // const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

      // if (!passRegex.test(password)) {
      //   toast.error('Invalid Password format');
      //   return;
      // }

      setIsLoading(true);
      const response = await AxiosProvider.post(`/api/auth/login`, {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const userExists = await AxiosProvider.get(`/api/auth/userinfo?email=${email}`);
        Cookies.set('hom_isEmailNotVerified', `${!userExists.data.verified}`);
        localStorage.setItem('hom_token', response.data.token);
        Cookies.set('hom_token', response.data.token);
        Cookies.set('hom_email', email);
        router.push('/welcome');
        setIsLoading(false);
      } else {
        // Handle error
        setIsLoading(false);
        console.log('Error', response.status);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response.data.error);
    }
  };

  const login = useGoogleLogin({
    onSuccess: async (credentialResponse: any) => {
      setIsGoogleLoading(true);
      try {
        const res = await axios
          .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${credentialResponse.access_token}`, {
            headers: {
              Authorization: `Bearer ${credentialResponse.access_token}`,
              Accept: 'application/json'
            }
          })

        const userExists = await AxiosProvider.get(`/api/auth/userinfo?email=${res.data.email}`);

        if (userExists.status === 204) {
          const response = await AxiosProvider.post(
            `/api/auth/create`,
            {
              email: res.data.email,
              type: 'google-oauth',
              google_access_token: credentialResponse.access_token,
            });
          if (response.status !== 200) {
            setIsGoogleLoading(false);
            toast.error("Failed to authenticate. Please try again later.");
            return;
          }
        }

        const response = await AxiosProvider.post(
          `/api/auth/login`,
          {
            email: res.data.email,
            type: 'google-oauth',
            google_access_token: credentialResponse.access_token,
          });

        if (response.status === 200) {
          localStorage.setItem('hom_token', response.data.token);
          toast.success('Logging you in...');
          Cookies.set('hom_token', response.data.token);
          Cookies.set('hom_email', res.data.email);
          router.push('/welcome');
          setIsGoogleLoading(false);
        } else {
          // Handle error
          setIsGoogleLoading(false);
          console.log('Error', response.status);
        }
      } catch (error: any) {
        setIsGoogleLoading(false);
        toast.error("Can't find account with google login. Try using email and password.");
      }
    },
    onError: () => {
      console.log('Login Failed');
      toast.error("Something want wrong. Try agin after sometime.")
    }
  });

  return (
    <>
      <div
        className={styles.title}
        style={{
          fontSize: size.title,
          background: 'linear-gradient(98.14deg, #FFFFFF 28.88%, rgba(255, 255, 255, 0) 132.27%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '40px',
        }}
      >
        Login to your account
      </div>

      <div>
        <Input
          onChange={(e: any) => {
            setEmail(e.target.value);
          }}
          size="small"
          style={{
            border: '#2A2A2A 1px solid',
            background: '#222224',
            borderRadius: '4px',
            padding: '10px 15px',
            marginTop: '4px',
            marginBottom: '15px',
          }}
          placeholder="Email"
          onKeyDown={handleKeyDown}
        />
        <Input.Password
          onChange={(e: any) => {
            setPassword(e.target.value);
          }}
          security="password"
          size="small"
          placeholder="Password"
          style={{
            border: '#2A2A2A 1px solid',
            background: '#222224',
            borderRadius: '4px',
            padding: '10px 15px',
            marginTop: '4px',
            marginBottom: '20px',
          }}
          onKeyDown={handleKeyDown}
        />
      </div>
      {isLoading ? (
        <GlowingButton
          style={{
            width: '374px'
          }}
          onClick={() => {
            if (isLoading) {
              return;
            }

            loginBtn();
          }}
        >
          Login
        </GlowingButton>
      ) : (
        <GlowingButtonStatic
          width='374px'
          onClick={() => {
            if (isLoading) {
              return;
            }
            loginBtn();
          }}
        >
          Login
        </GlowingButtonStatic>
      )}
      <div style={{ paddingTop: '10px' }}>
        <span
          style={{
            fontWeight: 'normal',
            color: 'rgba(92, 92, 92, 1)',
            whiteSpace: 'pre-wrap',
            flexGrow: 0,
            flexShrink: 0,
            flexBasis: 'auto',
            marginTop: '2.5rem',
          }}
        >
          <span
            style={{
              marginRight: 10,
              marginTop: 10,
              color: '#d3d3d3'
            }}
          >
            Not a member yet?{' '}
          </span>
          <span></span>
          <span
            onClick={() => router.push('/signup')}
            style={{
              cursor: 'pointer',
              color: '#ffffff',
              textDecoration: 'underline',
            }}
          >
            Register Now
          </span>
        </span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '374px',
        padding: '20px 0',
      }}>
        <div style={{
          flex: 1,
          height: '1px',
          backgroundColor: '#222224',
        }} />
        <div style={{
          padding: '0 10px',
        }}>
          Or
        </div>
        <div style={{
          flex: 1,
          height: '1px',
          backgroundColor: '#222224',
        }} />
      </div>

      <button
        style={{
          backgroundColor: '#222224', // Google blue
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          padding: '10px 20px',
          fontSize: '14px',
          cursor: 'pointer',
          fontFamily: 'BDO Grotesk, sans-serif',
        }}
        onClick={() => {
          if (isGoogleLoading) {
            return;
          }
          login()
        }}
      >
        {isGoogleLoading ? <Spin indicator={<LoadingOutlined style={{ color: 'white' }} />} /> :
          <>
            <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-webinar-optimizing-for-success-google-business-webinar-13.png" alt="Google logo" style={{
              width: '20px',
              height: '20px',
              marginRight: '10px',
              verticalAlign: 'middle',
            }} />
            Continue with Google
          </>}
      </button>

      {/* <GoogleLogin
        theme='outline'
        shape='circle'
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
          const { credential } = credentialResponse;
          const decoded: any = jwtDecode(credential || "");

          if (!decoded.email) {
            console.log('Email not found');
            return;
          } else {
            console.log(decoded.email);
          }

        }}
        onError={() => {
          console.log('Login Failed');
          toast.error("Something want wrong. Try agin after sometime.")
        }}
      /> */}
    </>
  );
});

export default Hero;
