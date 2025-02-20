import React, { Component } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import MyCard from '../components/cards/CardComponent';
import '../css/home.css';
import footage from '../images/surgut.mp4';
import url from '../components/functions/globalURL';
//import { CSSTransition } from 'react-transition-group';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: null,
            project_close: null,
            project_new: null,
            //showElement: false,
        };
    }

    componentDidMount() {
        //setTimeout(() => this.setState({ showElement: true }), 1000);

        fetch(url + '/projects/?ordering=-views&status_code=2') // замените на URL вашего DRF API и ID проекта
            .then((response) => response.json())
            .then((data) => {
                this.setState({ project: data.results });
            })
            .catch((error) => console.error('Ошибка:', error));
        fetch(url + '/projects/?ordering=-views&status_code=4') // замените на URL вашего DRF API и ID проекта
            .then((response) => response.json())
            .then((data) => {
                this.setState({ project_close: data.results });
                console.log(this.state.project_close);
            })
            .catch((error) => console.error('Ошибка:', error));
        fetch(url + '/projects/?ordering=-start_date&status_code=2') // замените на URL вашего DRF API и ID проекта
            .then((response) => response.json())
            .then((data) => {
                this.setState({ project_new: data.results });
                console.log(this.state.project_new);
            })
            .catch((error) => console.error('Ошибка:', error));
    }

    render() {
        const { project, project_close, project_new } = this.state;

        if (!project) {
            return <div>Loading...</div>;
        }
        if (!project_close) {
            return <div>Loading...</div>;
        }
        if (!project_new) {
            return <div>Loading...</div>;
        }

        return (
            <>
                {/* <CSSTransition
                    in={showElement}
                    timeout={1000}
                    classNames="fade"
                > */}
                {/* <section> */}
                <div className="element">
                    {' '}
                    <video
                        style={{
                            marginTop: '50px',
                            padding: '0',
                            height: '80vh',
                            objectFit: 'cover',
                        }}
                        className="w-100"
                        autoPlay
                        loop
                        muted
                    >
                        <source
                            src={footage}
                            type="video/mp4"
                            allowFullScreen
                        />
                    </video>
                    <div className="float-center">
                        <h1 className="video-h1-center">NA VOLNE</h1>
                        <h2 className="video-h2-center">
                            Инвестиции в будущее
                        </h2>
                        <h3 className="video-h3-center">
                            Мы помогаем инвесторам, компаниям малого и среднего
                            бизнеса быстро, и безопасно провести сделки по
                            привлечению капитала в ХМАО
                        </h3>
                    </div>
                </div>

                {/* </section> */}
                {/* </CSSTransition> */}

                <Container
                    fluid
                    style={{
                        marginTop: '50px',
                    }}
                >
                    <div className="mb-5">
                        <div className="d-flex justify-content-between mt-4 mb-4">
                            <h1 className="all-projects-h1">
                                Популярные проекты
                            </h1>
                            <a href="/projects" className="all-projects-href-p">
                                Все проекты
                            </a>
                        </div>

                        <Row xs={1} md={3} className="g-4">
                            {project.map((project) => (
                                <Col>
                                    <MyCard
                                        key={project.pk}
                                        slug={project.slug}
                                        collected_money={
                                            project.collected_money
                                        }
                                        need_money={project.need_money}
                                        name={project.name}
                                        category={project.category}
                                        small_description={
                                            project.small_description
                                        }
                                        views={project.views}
                                        image={project.image}
                                        code={project.status_code.code}
                                        start_date={project.start_date}
                                        end_date={project.end_date}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </div>

                    <div className="mb-5">
                        {' '}
                        <div className="d-flex justify-content-between mt-5 mb-4">
                            <h1 className="all-projects-h1">Новые проекты</h1>
                            <a href="/projects" className="all-projects-href-p">
                                Все проекты
                            </a>
                        </div>
                        <Row xs={1} md={3} className="g-4">
                            {project_new.map((project) => (
                                <Col>
                                    <MyCard
                                        key={project.pk}
                                        slug={project.slug}
                                        collected_money={
                                            project.collected_money
                                        }
                                        need_money={project.need_money}
                                        name={project.name}
                                        category={project.category}
                                        small_description={
                                            project.small_description
                                        }
                                        views={project.views}
                                        image={project.image}
                                        code={project.status_code.code}
                                        start_date={project.start_date}
                                        end_date={project.end_date}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </div>

                    <div className="mb-5">
                        {' '}
                        <div className="d-flex justify-content-between mt-5 mb-4">
                            <h1 className="all-projects-h1">Сбор окончен</h1>
                            <a href="/projects" className="all-projects-href-p">
                                Все проекты
                            </a>
                        </div>
                        <Row xs={1} md={3} className="g-4">
                            {project_close.map((project) => (
                                <Col>
                                    <MyCard
                                        key={project.pk}
                                        slug={project.slug}
                                        collected_money={
                                            project.collected_money
                                        }
                                        need_money={project.need_money}
                                        name={project.name}
                                        category={project.category}
                                        small_description={
                                            project.small_description
                                        }
                                        views={project.views}
                                        image={project.image}
                                        code={project.status_code.code}
                                        start_date={project.start_date}
                                        end_date={project.end_date}
                                    />
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Container>
            </>
        );
    }
}

export default Home;
