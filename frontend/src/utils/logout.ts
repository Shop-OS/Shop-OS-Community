import Cookies from 'js-cookie';

export default function logout() {
    Cookies.remove('hom_email');
    Cookies.remove('hom_token');
    Cookies.remove('hom_isEmailNotVerified');
}