import React, { Component } from 'react';
import { Container, Card, Col, Row } from 'react-bootstrap';
import ProgressBar from '../components/progress-bar.component';
import MyCard from '../components/cards/CardComponent';
import '../css/home.css';
import footage from '../images/surgut.mp4';
import { Link } from 'react-router-dom';
import url from '../globalURL';
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: null,
        };
    }

    componentDidMount() {
        fetch(url + '/projects') // замените на URL вашего DRF API и ID проекта
            .then((response) => response.json())
            .then((data) => {
                this.setState({ project: data.results });
            });
    }

    render() {
        const { project } = this.state;
        if (!project) {
            return <div>Loading...</div>;
        }

        return (
            <>
                <section>
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
                </section>

                <Container
                    fluid
                    style={{
                        marginTop: '50px',
                        paddingLeft: '100px',
                        paddingRight: '100px',
                    }}
                >
                    <div className="d-flex justify-content-between mt-4 mb-4">
                        <h1 style={{ fontSize: '75px' }}>Проекты</h1>
                        <a
                            className="text-decoration-none fs-2 align-self-center"
                            href="/projects"
                        >
                            Все проекты
                        </a>
                    </div>

                    <Row xs={1} md={3} className="g-4">
                        {project.map((project) => (
                            <Col>
                                <MyCard
                                    key={project.pk}
                                    slug={project.slug}
                                    collected_money={project.collected_money}
                                    need_money={project.need_money}
                                    name={project.name}
                                    category={project.category}
                                    small_description={
                                        project.small_description
                                    }
                                    views={project.views}
                                    image={project.image}
                                    code={project.status_code.code}
                                />
                            </Col>
                        ))}
                    </Row>
                </Container>
            </>
        );
    }
}

export default Home;
