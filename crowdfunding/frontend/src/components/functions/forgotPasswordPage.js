import React, { Component } from 'react';
import { Container, Row, Col, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import url from '../functions/globalURL';

import { withRouter } from 'react-router-dom';

export default class ForgotPasswordPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password_1: '',
            password_2: '',
        };
    }

    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const { token } = this.props.match.params;
        console.log(token);
        const { password_1, password_2 } = this.state;

        this.setState({ errorFlag: false });
        fetch(url + '/reset_password/' + token, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                //Authorization: 'Bearer ' + accessToken,
            },
            body: JSON.stringify({
                password_1,
                password_2,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({ errorMessage: data });
                console.log(data);
                if (data[0] == 'Пароль был успешно изменен') {
                    alert('Пароль был успешно изменен');
                    window.location.href = '/';
                } else {
                    alert('Проверьте корректность введенного пароля');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        return (
            <Container style={{ marginTop: '60px' }}>
                <Row xs={1} md={2} className="g-4">
                    <Col>
                        <h1
                            style={{
                                marginBottom: '0.5em',
                                fontWeight: 'bold',
                                fontSize: '55px',
                            }}
                        >
                            Смена пароля
                        </h1>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group
                                className="mb-3"
                                controlId="formBasicPassword"
                            >
                                {/* <Form.Label>Пароль</Form.Label> */}
                                <Form.Control
                                    type="password"
                                    name="password_1"
                                    value={this.state.password_1}
                                    onChange={this.handleChange}
                                    placeholder="Введите пароль"
                                />
                                {this.state.errorMessage && (
                                    <Form.Text className="text-danger">
                                        {this.state.errorMessage.password_1}
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formBasicPassword"
                            >
                                {/* <Form.Label>Повторите пароль</Form.Label> */}
                                <Form.Control
                                    type="password"
                                    name="password_2"
                                    value={this.state.password_2}
                                    onChange={this.handleChange}
                                    placeholder="Повторите пароль"
                                />
                                {this.state.errorMessage && (
                                    <Form.Text className="text-danger">
                                        {this.state.errorMessage.password_2}
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Button variant="primary" type="submit">
                                Отправить
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}
