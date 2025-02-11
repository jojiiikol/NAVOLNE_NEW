import React, { Component } from 'react';
import { Container, Row, Col, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import url from '../../globalURL';

export default class Create extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            small_description: '',
            description: '',
            need_money: '',
            collected_money: '',
            start_date: new Date().toISOString().slice(0, 10),
            end_date: '',
            category: [],
            image: '',
            info_cat: [],
            cat_meow: false,
            closure_type: '',
            files: [],
        };
    }

    componentDidMount() {
        fetch(url + '/additional/') // замените на URL вашего DRF API и ID проекта
            .then((response) => response.json())
            .then((data) => {
                this.setState({ info_cat: data.category });
            });

        if (!localStorage.getItem('accessToken')) {
            window.location.href = `/login`;
        }
    }
    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
    };
    handleFileChange = (event) => {
        // Получаем все файлы из input
        const newFiles = Array.from(event.target.files);
        this.setState({ ['files']: newFiles });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        const accessToken = localStorage.getItem('accessToken');
        const {
            name,
            small_description,
            description,
            need_money,
            collected_money,
            start_date,
            end_date,
            category,
            image,
            closure_type,
            files,
        } = this.state;

        const formData = new FormData();
        if (this.state.files) {
            const imageObjects = files.map((file) => ({ image: file }));

            console.log(imageObjects);
            imageObjects.forEach((image, index) => {
                formData.append(
                    `project_images[${index}]image`,
                    event.target.image2.files[index]
                );
            });
            // console.log(result);
        }
        formData.append('name', name);
        formData.append('small_description', small_description);
        formData.append('description', description);
        formData.append('need_money', need_money);
        formData.append('collected_money', collected_money);
        formData.append('start_date', start_date);
        formData.append('end_date', end_date);
        category.forEach((cat) => formData.append('category', cat));
        formData.append('image', event.target.image.files[0]);
        formData.append('closure_type', closure_type);

        for (var pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }
        this.setState({ errorFlag: false });
        fetch(url + '/projects/', {
            method: 'POST',
            headers: {
                //'Content-Type': 'application/json',
                Authorization: 'Bearer ' + accessToken,
            },
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                this.setState({ errorMessage: data });
                console.log(data);

                if (data.name == this.state.name) {
                    alert('Ваш проект находится на рассмотрении');
                    window.location.href =
                        '/profile/' + localStorage.getItem('user');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    onChange(e) {
        const category = this.state.category;

        let index;
        if (e.target.checked) {
            category.push(Number(e.target.name));
        } else {
            index = category.indexOf(Number(e.target.name));
            category.splice(index, 1);
        }

        this.setState({ category: category });
    }

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
                            Создание проекта
                        </h1>
                        <Form onSubmit={this.handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Название проекта</Form.Label>
                                <Form.Control
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                    type="text"
                                    placeholder="Введите название"
                                />
                                {this.state.errorMessage && (
                                    <Form.Text className="text-danger">
                                        {' '}
                                        {this.state.errorMessage.name}{' '}
                                    </Form.Text>
                                )}
                                <div style={{ display: 'block' }}>
                                    <Form.Text className="text-muted">
                                        *название вашего проекта
                                    </Form.Text>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Короткое описание проекта
                                </Form.Label>
                                <Form.Control
                                    name="small_description"
                                    value={this.state.small_description}
                                    onChange={this.handleChange}
                                    as="textarea"
                                    placeholder="Введите короткое описание"
                                />
                                {this.state.errorMessage && (
                                    <Form.Text className="text-danger">
                                        {' '}
                                        {
                                            this.state.errorMessage
                                                .small_description
                                        }{' '}
                                    </Form.Text>
                                )}
                                <div style={{ display: 'block' }}>
                                    <Form.Text className="text-muted">
                                        *это описание увидят пользователи на
                                        карточке вашего проекта
                                    </Form.Text>
                                </div>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Полное описание проекта</Form.Label>
                                <Form.Control
                                    rows={5}
                                    name="description"
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                    as="textarea"
                                    placeholder="Введите полное описание проекта"
                                />
                                {this.state.errorMessage && (
                                    <Form.Text className="text-danger">
                                        {' '}
                                        {
                                            this.state.errorMessage.description
                                        }{' '}
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Необходимое количество средств
                                </Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        name="need_money"
                                        value={this.state.need_money}
                                        onChange={this.handleChange}
                                        type="number"
                                        placeholder="Надо денег"
                                    />
                                    <InputGroup.Text>₽</InputGroup.Text>
                                    {this.state.errorMessage && (
                                        <Form.Text className="text-danger">
                                            {' '}
                                            {
                                                this.state.errorMessage
                                                    .need_money
                                            }{' '}
                                        </Form.Text>
                                    )}
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Уже собранное количество средств
                                </Form.Label>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        name="collected_money"
                                        value={this.state.collected_money}
                                        onChange={this.handleChange}
                                        type="number"
                                        placeholder="Не надо денег"
                                    />
                                    <InputGroup.Text>₽</InputGroup.Text>
                                    {this.state.errorMessage && (
                                        <Form.Text className="text-danger">
                                            {' '}
                                            {
                                                this.state.errorMessage
                                                    .collected_money
                                            }{' '}
                                        </Form.Text>
                                    )}
                                </InputGroup>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Дата начала реализации проекта
                                </Form.Label>
                                <Form.Control
                                    name="start_date"
                                    value={this.state.start_date}
                                    onChange={this.handleChange}
                                    type="date"
                                    placeholder="Дата начала реализации проекта"
                                    readOnly
                                />
                                {this.state.errorMessage && (
                                    <Form.Text className="text-danger">
                                        {' '}
                                        {
                                            this.state.errorMessage.start_date
                                        }{' '}
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Дата конца реализации проекта
                                </Form.Label>
                                <Form.Control
                                    name="end_date"
                                    value={this.state.end_date}
                                    onChange={this.handleChange}
                                    type="date"
                                    placeholder="Дата конца реализации проекта"
                                />
                                {this.state.errorMessage && (
                                    <Form.Text className="text-danger">
                                        {' '}
                                        {this.state.errorMessage.end_date}{' '}
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Выберите категории</Form.Label>
                                {this.state.info_cat.length === 0 ? (
                                    <div> No data for collection </div>
                                ) : (
                                    this.state.info_cat.map((cat) => (
                                        <div key={cat.id}>
                                            <Form.Check
                                                type="checkbox"
                                                name={cat.id}
                                                onChange={this.onChange.bind(
                                                    this
                                                )}
                                                label={cat.name}
                                            />
                                        </div>
                                    ))
                                )}
                                {this.state.errorMessage && (
                                    <Form.Text className="text-danger">
                                        {' '}
                                        {this.state.errorMessage.category}{' '}
                                    </Form.Text>
                                )}
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>
                                    Фотография для карточки вашего проекта
                                </Form.Label>
                                <Form.Control
                                    accept="image/jpeg,image/png,image/gif"
                                    name="image"
                                    value={this.state.image}
                                    onChange={this.handleChange}
                                    type="file"
                                    placeholder="Дата конца реализации проекта"
                                />
                                {this.state.errorMessage && (
                                    <Form.Text className="text-danger">
                                        {' '}
                                        {this.state.errorMessage.image}{' '}
                                    </Form.Text>
                                )}
                            </Form.Group>
                            <Form.Group className="mb-2">
                                <Form.Label>Фотографии на шапку:</Form.Label>
                                <Form.Control
                                    multiple
                                    accept="image/jpeg,image/png,image/gif"
                                    name="image2"
                                    type="file"
                                    onChange={this.handleFileChange}
                                />
                                <div style={{ display: 'block' }}>
                                    <Form.Text className="text-muted">
                                        *вы можете выбрать несколько файлов
                                    </Form.Text>
                                </div>
                                {this.state.errorMessage && (
                                    <Form.Text className="text-danger">
                                        {' '}
                                        {this.state.errorMessage.add_image}{' '}
                                    </Form.Text>
                                )}
                            </Form.Group>
                            <div>
                                <Form.Check
                                    name="closure_type"
                                    type="radio"
                                    value={'BY_AMOUNT'}
                                    checked={
                                        this.state.closure_type === 'BY_AMOUNT'
                                    }
                                    label={'По окончанию сбора средств'}
                                    onChange={this.handleChange}
                                />
                                <Form.Check
                                    name="closure_type"
                                    type="radio"
                                    value={'BY_TIME'}
                                    checked={
                                        this.state.closure_type === 'BY_TIME'
                                    }
                                    label={'По времени'}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <Form.Group
                                className="mb-3"
                                controlId="formBasicCheckbox"
                                style={{ display: 'flex' }}
                            >
                                <Form.Label>
                                    Нажимая на кнопку «Создать, я соглашаюсь с{' '}
                                    <a href="https://vk.com/lastimperatorr">
                                        политикой по обработке персональных
                                        данных
                                    </a>
                                </Form.Label>
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Создать
                            </Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        );
    }
}
