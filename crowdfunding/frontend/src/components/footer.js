import React from 'react';
import { Container, Row, Col, Navbar, Nav } from 'react-bootstrap';

import logo from '../logo512.png';
const Footer = () => {
    return (
        <Navbar
            bg="white"
            variant="light"
            className="mt-5"
            style={{
                boxShadow: '0px 0px 10px #a8a8a8',
            }}
        >
            <div className="d-flex justify-content-center">
                <Navbar.Brand href="/" className="fw-bold">
                    <img
                        src={logo}
                        height="30"
                        width="30"
                        className="d-inline-block align-top"
                        alt="Logo"
                    />{' '}
                    NA VOLNE
                </Navbar.Brand>{' '}
                <p className="align-text-center">&copy;</p>
            </div>
        </Navbar>
    );
};

export default Footer;
