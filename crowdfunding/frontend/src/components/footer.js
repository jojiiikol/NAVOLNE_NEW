import { Navbar } from 'react-bootstrap';
import logo from '../logo512.png';

const Footer = () => {
    console.log('sad');
    return (
        <Navbar
            bg="white"
            variant="light"
            className="d-flex justify-content-center"
            style={{
                boxShadow: '0px 0px 10px #a8a8a8',
                height: '50px',
            }}
        >
            <Navbar.Brand className="text-secondary">
                &copy; Права защищены:
            </Navbar.Brand>
            <Navbar.Brand href="/home" className="fw-bold">
                <img
                    src={logo}
                    height="30"
                    width="30"
                    className="d-inline-block align-top"
                    alt="Logo"
                />{' '}
                NA VOLNE
            </Navbar.Brand>
        </Navbar>
    );
};

export default Footer;
