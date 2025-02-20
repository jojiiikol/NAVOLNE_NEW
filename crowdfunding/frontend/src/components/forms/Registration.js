import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import idea from '../../images/idea.png';
import url from '../functions/globalURL';

export default class Registration extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password_1: '',
            password_2: '',
            email: '',
            last_name: '',
            first_name: '',
            skills: [],
            info_cat: '',
            groups: [0],
            info_groups: [],
            isChecked: false,
        };
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }
    componentDidMount() {
        fetch(url + '/additional/') // замените на URL вашего DRF API и ID проекта
            .then((response) => response.json())
            .then((data) => {
                this.setState({ info_cat: data.skills });
            });
        fetch(url + '/additional/') // замените на URL вашего DRF API и ID проекта
            .then((response) => response.json())
            .then((data) => {
                this.setState({ info_groups: data.groups });
                //console.log(data);
            });
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
        const {
            username,
            password_1,
            password_2,
            email,
            first_name,
            last_name,
            skills,
            groups,
        } = this.state;
        fetch(url + '/profiles/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                last_name,
                first_name,
                password_1,
                password_2,
                email,
                groups,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                this.setState({ errorMessage: data });
                if (data.email == this.state.email) {
                    alert(
                        'На вашу почту выслано письмо, подтвердите свою регистрацию'
                    );
                    window.location.href = `/auth/`;
                }
            })

            .catch((error) => {
                console.error(error);
            });
    };

    handleRadioChange = (event) => {
        let target = event.target;

        let value = target.type === 'checkbox' ? target.checked : target.value;
        this.setState({ info_cat: value });
        // console.log(this.state.info_cat);

        this.state.groups.pop();
        this.state.groups.push(value);
    };
    handleCheckboxChange(e) {
        this.setState({ isChecked: e.target.checked });
    }
    render() {
        const { isChecked } = this.state;
        return (
            <Container style={{}}>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Я:</Form.Label>
                        {this.state.info_groups.length === 0 ? (
                            <div> No data for collection </div>
                        ) : (
                            <div>
                                <Form.Check
                                    type="radio"
                                    value={[this.state.info_groups[0].id]}
                                    checked={
                                        this.state.info_cat ==
                                        this.state.info_groups[0].id
                                    }
                                    label={this.state.info_groups[0].name}
                                    onChange={this.handleRadioChange.bind(this)}
                                />
                                <Form.Check
                                    type="radio"
                                    value={this.state.info_groups[1].id}
                                    checked={
                                        this.state.info_cat ==
                                        this.state.info_groups[1].id
                                    }
                                    label={this.state.info_groups[1].name}
                                    onChange={this.handleRadioChange.bind(this)}
                                />
                            </div>
                        )}
                        {this.state.errorMessage && (
                            <Form.Text className="text-danger">
                                {' '}
                                {this.state.errorMessage.groups}{' '}
                            </Form.Text>
                        )}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Control
                            name="username"
                            value={this.state.username}
                            onChange={this.handleChange}
                            type="text"
                            placeholder="Введите логин"
                        />
                        {this.state.errorMessage && (
                            <Form.Text className="text-danger">
                                {' '}
                                {this.state.errorMessage.username}{' '}
                            </Form.Text>
                        )}
                        <div style={{ display: 'block' }}>
                            <Form.Text className="text-muted">
                                *имя, которое увидят другие пользователи
                            </Form.Text>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        {/* <Form.Label>Email</Form.Label> */}
                        <Form.Control
                            type="email"
                            name="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            placeholder="Введите ваш email"
                        />
                        {this.state.errorMessage && (
                            <Form.Text className="text-danger">
                                {' '}
                                {this.state.errorMessage.email}{' '}
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
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
                                {' '}
                                {this.state.errorMessage.password_1}{' '}
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
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
                                {' '}
                                {this.state.errorMessage.password_2}{' '}
                            </Form.Text>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        {/* <Form.Label>Фамилия</Form.Label> */}
                        <Form.Control
                            name="last_name"
                            value={this.state.last_name}
                            onChange={this.handleChange}
                            type="text"
                            placeholder="Введите фамилию"
                        />
                        {this.state.errorMessage && (
                            <Form.Text className="text-danger">
                                {' '}
                                {this.state.errorMessage.last_name}{' '}
                            </Form.Text>
                        )}
                        <div style={{ display: 'block' }}>
                            <Form.Text className="text-muted">
                                *напишите свою настоящую фамилию
                            </Form.Text>
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        {/* <Form.Label>Имя</Form.Label> */}
                        <Form.Control
                            name="first_name"
                            value={this.state.first_name}
                            onChange={this.handleChange}
                            type="text"
                            placeholder="Введите имя"
                        />
                        {this.state.errorMessage && (
                            <Form.Text className="text-danger">
                                {' '}
                                {this.state.errorMessage.first_name}{' '}
                            </Form.Text>
                        )}
                        <div style={{ display: 'block' }}>
                            <Form.Text className="text-muted">
                                *напишите своё настоящее имя
                            </Form.Text>
                        </div>
                    </Form.Group>

                    <Form.Group
                        className="mb-3"
                        controlId="formBasicCheckbox"
                        style={{ display: 'flex' }}
                    >
                        <Form.Check
                            type="checkbox"
                            style={{ marginRight: '1em' }}
                            onChange={this.handleCheckboxChange}
                        />
                        <Form.Label>
                            Нажимая на кнопку «Зарегистрироваться», я соглашаюсь
                            с{' '}
                            <a href="https://vk.com/lastimperatorr">
                                политикой по обработке персональных данных
                            </a>
                        </Form.Label>
                    </Form.Group>

                    <Button
                        variant="primary"
                        type="submit"
                        disabled={!isChecked}
                    >
                        Зарегистрироваться
                    </Button>
                </Form>
            </Container>
        );
    }
}

{
    /* <div
                            className="registration-pik-and-text"
                            style={{ display: 'flex', alignItems: 'center' }}
                        >
                            <img
                                src={idea}
                                height="180"
                                width="180"
                                className="d-inline-block align-top"
                                alt="Logo"
                                marginRight="15px"
                            />
                            <div
                                className="registration-pik-and-text-rectangle"
                                style={{
                                    width: '100%',
                                    height: '135px',
                                    border: 'solid',
                                    borderColor: '#0d6efd',
                                    borderWidth: 'thin',
                                    borderRadius: '10px 10px 10px 0',
                                }}
                            >
                                <p
                                    style={{
                                        marginLeft: '1em',
                                        marginTop: '1em',
                                    }}
                                >
                                    Если вы уже зарегистрированы, просто войдите
                                    в свой аккаунт.
                                </p>
                                <Button
                                    style={{ marginLeft: '1em' }}
                                    size="sm"
                                    href="/Login"
                                >
                                    Войти в аккаунт
                                </Button>
                            </div>
                        </div> */
}
