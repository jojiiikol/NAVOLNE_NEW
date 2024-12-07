import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            accessToken: localStorage.getItem('accessToken'),
        };
    }
    componentDidMount() {
        if (
            localStorage.getItem('accessToken') !== 'undefined' &&
            localStorage.getItem('accessToken')
        ) {
            window.location.href = `/profile/${localStorage.getItem('user')}`;
        }
    }
    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { username, password } = this.state;
        fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.access != null) {
                    localStorage.setItem('accessToken', data.access);
                    localStorage.setItem('refreshToken', data.refresh);
                    localStorage.setItem('user', username);
                }

                this.setState({ errorMessage: data });
                if (localStorage.getItem('accessToken') !== null) {
                    window.location.href = `/profile/${localStorage.getItem('user')}`;
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        return (
            <Container style={{ marginTop: '60px' }}>
                <h1
                    style={{
                        marginBottom: '0.5em',
                        fontWeight: 'bold',
                        fontSize: '55px',
                    }}
                >
                    Вход
                </h1>

                <Row xs={1} md={2} className="g-4">
                    <Col>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group
                                className="mb-3"
                                controlId="formBasicEmail"
                            >
                                <Form.Label>Логин</Form.Label>
                                <Form.Control
                                    name="username"
                                    value={this.state.username}
                                    onChange={this.handleChange}
                                    type="text"
                                    placeholder="Введите имя пользователя"
                                />
                                {this.state.errorMessage && (
                                    <Form.Text className="text-danger">
                                        {' '}
                                        {this.state.errorMessage.username}{' '}
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formBasicPassword"
                            >
                                <Form.Label>Пароль</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    placeholder="Введите ваш пароль"
                                />
                                {this.state.errorMessage && (
                                    <Form.Text className="text-danger">
                                        {' '}
                                        {this.state.errorMessage.password}{' '}
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formBasicPassword"
                            >
                                {this.state.errorMessage && (
                                    <Form.Text className="text-danger">
                                        {' '}
                                        {this.state.errorMessage.detail}{' '}
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formBasicPassword"
                            >
                                {this.state.access && (
                                    <Form.Text className="text-danger">
                                        {' '}
                                        {this.state.access}
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Войти
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}
