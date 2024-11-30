import AxiosProvider from '@/utils/axios';
import { Alert, Button } from 'antd'
import Cookies, { set } from 'js-cookie';
import { usePathname, useSearchParams } from 'next/navigation';
import React, { use, useEffect } from 'react'

function AlertComponent() {
    const [isEmailNotVerified, setIsEmailNotVerified] = React.useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [disableSendEmail, setDisableSendEmail] = React.useState(false);
    const [timer, setTimer] = React.useState<any>(60);

    const intervalRef = React.useRef<any>();

    useEffect(() => {
        if (disableSendEmail == false) return;
        let interval: any;
        if (disableSendEmail) {
            interval = setInterval(() => {
                if (timer > 0) {
                    setTimer((prev: any) => prev - 1);
                } else {
                    setDisableSendEmail(false);
                    clearInterval(interval);
                }
            }, 1000);
        }
        return () => {
            clearInterval(interval);
        }
    }, [disableSendEmail, timer])


    const resendEmail = async () => {
        if (disableSendEmail) return;
        await AxiosProvider.post('api/auth/resend', { email: Cookies.get("hom_email") });
        setDisableSendEmail(true);
        setTimer(60);
    };

    useEffect(() => {
        setIsEmailNotVerified(Cookies.get("hom_isEmailNotVerified") == "true");
    }, [pathname]);

    const checkVerification = async () => {
        const email = Cookies.get("hom_email");
        const userExists = await AxiosProvider.get(`/api/auth/userinfo?email=${email}`);
        Cookies.set('hom_isEmailNotVerified', `${!userExists.data.verified}`);
        setIsEmailNotVerified(!userExists.data.verified);

        if (userExists.data.verified) {
            clearInterval(intervalRef.current);
        }
    };

    useEffect(() => {
        const verified = searchParams.get('verified');
        if (verified) {
            checkVerification();
            // const userExists = await AxiosProvider.get(`/api/auth/userinfo?email=${email}`);
            // Cookies.set('hom_isEmailNotVerified', `${!userExists.data.verified}`);
            // // Cookies.remove('hom_isEmailNotVerified');
            // setIsEmailNotVerified(false);
        }
    }, [searchParams]);

    useEffect(() => {
        const email = Cookies.get("hom_email");
        if (!email) {
            clearInterval(intervalRef.current);
            return;
        }
        intervalRef.current = setInterval(() => {
            checkVerification();
        }, 2000);

        return () => {
            clearInterval(intervalRef.current);
        }
    }, []);

    return (
        <>{isEmailNotVerified &&
            <Alert
                banner

                message={<div><>
                    We've sent you an email. Please verify your email to proceed.
                    <Button disabled={disableSendEmail} size="small" type="text"
                        style={{
                            fontFamily: "'BDO Grotesk', sans-serif",
                            fontSize: "16px",
                            marginLeft: "10px",

                        }}
                        onClick={resendEmail}
                    >
                        Resend Email
                    </Button>
                </>
                    {disableSendEmail && <p style={{
                        fontFamily: "'BDO Grotesk', sans-serif",
                        fontSize: "14px",
                        marginTop: "5px",
                    }}>Resend Email in {timer} seconds</p>}
                </div>}
                type="info"

                style={{
                    width: "100%",
                    textAlign: "center",
                    fontFamily: "'BDO Grotesk', sans-serif",
                    fontSize: "16px",
                    display: "flex",
                    color: "#BD9531",
                }}
            />
        }</>
    )
}

export default AlertComponent