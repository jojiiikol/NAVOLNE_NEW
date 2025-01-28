import React, { useEffect, useState } from 'react';
import { Container, Row, Col, InputGroup } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import url from '../globalURL';

const Category = () => {
    const [name, setName] = useState('');
    const [small_description, setSmall_Description] = useState('');
    const [description, setDescription] = useState('');
    const [need_money, setNeed_mMoney] = useState('');
    const [collected_money, setCollected_Money] = useState('');
    const [start_date, setStart_Date] = useState('');
    const [end_date, setEnd_Date] = useState('');
    const [category, setCategory] = useState(1);
    const [image, setImage] = useState('');
    const [info_cat, setInfo_Cat] = useState(null);

    useEffect(() => {
        if (!localStorage.getItem('accessToken')) {
            window.location.href = `/login`;
        }
        fetch(url + '/') // замените на URL вашего DRF API и ID проекта
            .then((response) => response.json())
            .then((data) => this.setState({ info_cat: data }));
    }, []);
    // handleChange = (event) => {
    //     const { name, value } = event.target;
    //     this.setState({ [name]: value });
    // };

    // handleSubmit = (event) => {
    //     event.preventDefault();
    //     const accessToken = localStorage.getItem('accessToken');
    //     const {
    //         name,
    //         small_description,
    //         description,
    //         need_money,
    //         collected_money,
    //         start_date,
    //         end_date,
    //         category,
    //         image,
    //     } = this.state;
    //     const formData = new FormData();
    //     formData.append('name', name);
    //     formData.append('small_description', small_description);
    //     formData.append('description', description);
    //     formData.append('need_money', need_money);
    //     formData.append('collected_money', collected_money);
    //     formData.append('start_date', start_date);
    //     formData.append('end_date', end_date);
    //     formData.append('category', category);
    //     formData.append('image', event.target.image.files[0]);
    //     console.log(formData);
    //     for (var pair of formData.entries()) {
    //         console.log(pair[0] + ', ' + pair[1]);
    //     }
    //     fetch(url + '/projects/create', {
    //         method: 'POST',
    //         headers: {
    //             Authorization: 'Bearer ' + accessToken,
    //         },
    //         body: formData,
    //     })
    //         .then((response) => response.json())
    //         .then((data) => {
    //             console.log(data);
    //             this.setState({ errorMessage: data });
    //         })

    //         .catch((error) => {
    //             console.error(error);
    //         });
    // };

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
                    {/* <Form onSubmit={this.handleSubmit}> */}
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Название проекта</Form.Label>
                            <Form.Control
                                name="name"
                                value={this.state.name}
                                // onChange={this.handleChange}
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
                            <Form.Label>Короткое описание проекта</Form.Label>
                            <Form.Control
                                name="small_description"
                                value={this.state.small_description}
                                // onChange={this.handleChange}
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
                                // onChange={this.handleChange}
                                as="textarea"
                                placeholder="Введите полное описание проекта"
                            />
                            {this.state.errorMessage && (
                                <Form.Text className="text-danger">
                                    {' '}
                                    {this.state.errorMessage.description}{' '}
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
                                    // onChange={this.handleChange}
                                    type="number"
                                    placeholder="Надо денег"
                                />
                                <InputGroup.Text>₽</InputGroup.Text>
                                {this.state.errorMessage && (
                                    <Form.Text className="text-danger">
                                        {' '}
                                        {
                                            this.state.errorMessage.need_money
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
                                    // onChange={this.handleChange}
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
                                Дата начала реализации проектаа
                            </Form.Label>
                            <Form.Control
                                name="start_date"
                                value={this.state.start_date}
                                // onChange={this.handleChange}
                                type="date"
                                placeholder="Дата начала реализации проекта"
                            />
                            {this.state.errorMessage && (
                                <Form.Text className="text-danger">
                                    {' '}
                                    {this.state.errorMessage.start_date}{' '}
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
                                // onChange={this.handleChange}
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

                            {/* <ToggleButton
          id="toggle-check"
          type="checkbox"
          variant="secondary"
          checked={checked}
          value="1"
          onChange={(e) => setChecked(e.currentTarget.checked)}
        >
          Checked
        </ToggleButton> */}
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
                                // onChange={this.handleChange}
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

                        <Form.Group
                            className="mb-3"
                            controlId="formBasicCheckbox"
                            style={{ display: 'flex' }}
                        >
                            <Form.Label>
                                Нажимая на кнопку «Создать, я соглашаюсь с{' '}
                                <a href="https://vk.com/lastimperatorr">
                                    политикой по обработке персональных данных
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
};

export default Category;
