import { LoadingOutlined } from '@ant-design/icons';
import { Button, Input, Spin } from 'antd';
import axios from 'axios';
import { set } from 'lodash';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { memo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flexbox } from 'react-layout-kit';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import GlowingButton from '@/components/GlowingButton';
import GlowingButtonStatic from '@/components/GlowingButton/GlowingButtonStatic';

import { genSize, useStyles } from './style';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import AxiosProvider from '@/utils/axios';

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
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      signUpBtn();
    }
  };

  const signUpBtn = async () => {
    try {
      if (!firstName || !lastName) {
        toast.error('Enter valid first name and last name');
        return;
      }

      if (!email || !password || !confirmPassword) {
        toast.error('Enter valid email and password');
        return;
      }

      if (password !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        toast.error('Invalid email format');
        return;
      }

      setIsLoading(true);
      setShowPasswordError(false);
      const response = await AxiosProvider.post(
        `/api/auth/create`,
        {
          email: email,
          password: password,
          name: `${firstName} ${lastName}`,
        },
      );

      if (response.status === 200) {

        const response = await AxiosProvider.post(
          `/api/auth/login`,
          {
            email: email,
            password: password,
            type: 'email-password',
          });

        if (response.status === 200) {
          clearTourCookie();
          toast.success('Account created successfully');
          const userExists = await AxiosProvider.get(`/api/auth/userinfo?email=${email}`);
          Cookies.set('hom_isEmailNotVerified', `${!userExists.data.verified}`);
          localStorage.setItem('hom_token', response.data.token);
          Cookies.set('hom_token', response.data.token);
          Cookies.set('hom_email', email);
          router.push('/welcome');
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
        toast.error(response.data.error);
      }
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.response.data.error);
    }
  };

  const clearTourCookie = () => {
    const cookies = Cookies.get();
    for (let cookieName in cookies) {
      if (cookieName.startsWith('hom_tour_')) {
        Cookies.remove(cookieName);
      }
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

        console.log(res.data);

        const userExists = await AxiosProvider.get(`/api/auth/userinfo?email=${res.data.email}`);

        if (userExists.status === 204) {
          const response = await AxiosProvider.post(
            `/api/auth/create`,
            {
              email: res.data.email,
              type: 'google-oauth',
              google_access_token: credentialResponse.access_token,
              name: `${res.data.name}`
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
          clearTourCookie();
          localStorage.setItem('hom_token', response.data.token);
          toast.success('Account created successfully');
          Cookies.set('hom_token', response.data.token);
          Cookies.set('hom_email', res.data.email);
          router.push('/welcome');
          setIsGoogleLoading(false);
        } else {
          setIsGoogleLoading(false);
          toast.error(response.data.error);
        }
      } catch (error: any) {
        setIsGoogleLoading(false);
        toast.error(error.response.data.error);
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
        onKeyDown={handleKeyDown}
      >
        Sign up
      </div>

      <div style={{ maxWidth: '450px' }}>
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Input
            onChange={(e: any) => {
              setFirstName(e.target.value);
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
            placeholder="First Name"
            onKeyDown={handleKeyDown}
          />
          <Input
            onChange={(e: any) => {
              setLastName(e.target.value);
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
            placeholder="Last Name"
            onKeyDown={handleKeyDown}
          />
        </div>
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
            const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\S])[A-Za-z\d\S]{8,}$/;

            if (!passRegex.test(e.target.value)) {
              setShowPasswordError(true);
            } else {
              setShowPasswordError(false);
            }

            if (e.target.value.length === 0) {
              setShowPasswordError(false);
            }
            setPassword(e.target.value);
          }}
          size="small"
          placeholder="Password"
          style={{
            border: '#2A2A2A 1px solid',
            background: '#222224',
            borderRadius: '4px',
            padding: '10px 15px',
            marginTop: '4px',
            marginBottom: '15px',
          }}
        />
        <Input.Password
          onChange={(e: any) => {
            setConfirmPassword(e.target.value);
          }}
          size="small"
          placeholder="Confirm Password"
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
        {showPasswordError &&
          <ul style={{ fontSize: "12px", paddingInlineStart: "16px" }}>
            <li>At least 8 characters long</li>
            <li>Contains both uppercase and lowercase letters</li>
            <li>Has at least one digit</li>
            <li>Includes at least one special character</li>
          </ul>
        }
      </div>
      {isLoading ? (
        <GlowingButton
          onClick={() => {
            signUpBtn();
          }}
          style={{ maxWidth: '400px', width: '374px' }}

        >
          Signup
        </GlowingButton>
      ) : (
        <GlowingButtonStatic
          onClick={() => {
            signUpBtn();
          }}
        >
          Signup
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
          <span style={{}}>Already a Member? </span>
          <span></span>
          <span
            onClick={() => router.push('/login')}
            style={{
              cursor: 'pointer',
              color: '#ffffff',
              textDecoration: 'underline',
            }}
          >
            Login Now
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
          </>
        }
      </button>


      {/* <GoogleLogin
        theme='filled_black'
        shape='pill'
        text="signup_with"
        onSuccess={credentialResponse => {
          console.log(credentialResponse);
        }}
        onError={() => {
          toast.error("Something want wrong. Try agin after sometime.")
        }}
      /> */}
    </>
  );
});

export default Hero;
