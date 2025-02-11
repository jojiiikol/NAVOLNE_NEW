import React from 'react';
import {
    Row,
    Col,
    ButtonGroup,
    ToggleButton,
    Container,
} from 'react-bootstrap';
import Registration from '../components/forms/Registration';
import Login from '../components/forms/Login';
import { useState } from 'react';
import footage from '../images/surgut.mp4';
const AuthPage = () => {
    const [authMode, setAuthMode] = useState('login'); // По умолчанию показываем форму авторизации

    const handleToggle = (newMode) => {
        setAuthMode(newMode); // Используем коллбэк для обновления состояния
    };

    let authComponent;
    if (authMode === 'register') {
        authComponent = <Registration />;
    } else if (authMode === 'login') {
        authComponent = <Login />;
    }

    return (
        <div style={{ marginTop: '60px' }}>
            <Row md={2} xs={1}>
                <Col
                    style={{
                        height: '50rem',
                        background: '#E0F1EE',
                        borderRadius: '24px',
                        border: '1px solid rgba(0, 0, 0, 0.02)',
                    }}
                    md={4}
                    className="ms-4 me-4 mt-2 d-flex justify-content-center align-items-center"
                >
                    <Container
                        center
                        className="d-flex justify-content-center flex-column p-5"
                    >
                        <ButtonGroup toggle>
                            <ToggleButton
                                type="radio"
                                name="auth-mode"
                                value="login"
                                variant="outline-primary"
                                checked={authMode == 'login'}
                                onClick={() => handleToggle('login')}
                                className="fw-bold fs-4"
                                style={{ height: '3rem' }}
                            >
                                ВХОД
                            </ToggleButton>
                            <ToggleButton
                                type="radio"
                                name="auth-mode"
                                value="register"
                                variant="outline-primary"
                                checked={authMode == 'register'}
                                className="fw-bold fs-4"
                                style={{ height: '3rem' }}
                                onClick={() => handleToggle('register')}
                            >
                                РЕГИСТРАЦИЯ
                            </ToggleButton>
                        </ButtonGroup>

                        {authComponent}
                    </Container>
                </Col>
                <Col
                    style={{ padding: '0px' }}
                    className="d-none d-sm-block"
                    md={7}
                >
                    <section>
                        <video
                            style={{
                                objectFit: 'cover',
                                borderRadius: '24px',
                                border: '1px solid rgba(0, 0, 0, 0.02)',
                                width: '135vh',
                                height: '50rem',
                            }}
                            className=" mt-2 d-md-block"
                            autoPlay
                            loop
                            muted
                        >
                            <source src={footage} type="video/mp4" />
                        </video>
                    </section>
                </Col>
            </Row>
        </div>
    );
};

export default AuthPage;
