import React, { useEffect, useState } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import MyCard from '../components/cards/CardComponent';
import '../css/home.css';
import footage from '../images/surgut.mp4';
import url from '../components/functions/globalURL';
import { InView } from 'react-intersection-observer';
import 'aos/dist/aos.css';
import AOS from 'aos';

const Home = () => {
    const [project, setProject] = useState(null);
    const [projectClose, setProjectClose] = useState(null);
    const [projectNew, setProjectNew] = useState(null);

    useEffect(() => {
        AOS.init({
            duration: 1000, // продолжительность анимации
            once: false, // анимация срабатывает каждый раз
        });

        // Загружаем данные о проектах
        fetch(url + '/projects/?ordering=-views_count&status_code__code=1')
            .then((response) => response.json())
            .then((data) => {
                setProject(data.results);
                AOS.refresh(); // обновляем AOS после загрузки данных
            })
            .catch((error) => console.error('Ошибка:', error));

        fetch(url + '/projects/?ordering=-views_count&status_code__code=3')
            .then((response) => response.json())
            .then((data) => {
                setProjectClose(data.results);
                AOS.refresh(); // обновляем AOS после загрузки данных
            })
            .catch((error) => console.error('Ошибка:', error));

        fetch(url + '/projects/?ordering=-start_date&status_code__code=1')
            .then((response) => response.json())
            .then((data) => {
                setProjectNew(data.results);
                AOS.refresh(); // обновляем AOS после загрузки данных
            })
            .catch((error) => console.error('Ошибка:', error));
    }, []); // Пустой массив зависимостей, чтобы вызвать один раз

    if (!project || !projectClose || !projectNew) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <InView
                triggerOnce={true}
                onChange={(inView, entry) => {
                    if (inView) {
                        entry.target.classList.add('fade-in');
                    }
                }}
            >
                <div className="element" data-aos="fade-up">
                    <div className="element">
                        <video
                            style={{
                                marginTop: '50px',
                                padding: '0',
                                height: '95vh',
                                objectFit: 'cover',
                            }}
                            className="w-100  d-none d-sm-block"
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
                        <img
                            style={{
                                marginTop: '50px',
                                padding: '0',
                                height: '95vh',
                                objectFit: 'cover',
                            }}
                            src="https://russiatrek.org/blog/wp-content/uploads/2020/03/nizhnevartovsk-city-russia-8.jpg"
                            className="w-100  d-block d-sm-none"
                        />
                        <div className="float-center">
                            <h1 className="video-h1-center">NA VOLNE</h1>
                            <h2
                                className="video-h2-center"
                                style={{ marginTop: '1.5rem' }}
                            >
                                Инвестиции в будущее
                            </h2>
                            <h3
                                className="video-h3-center"
                                style={{ marginTop: '3rem' }}
                            >
                                Мы помогаем инвесторам, компаниям малого и
                                среднего бизнеса быстро, и безопасно провести
                                сделки по привлечению капитала в ЮГРЕ
                            </h3>
                        </div>
                    </div>
                </div>
            </InView>

            <Container fluid style={{ marginTop: '50px' }}>
                {/* Популярные проекты */}
                <div className="mb-5">
                    <div className="d-flex justify-content-between mt-4 mb-4">
                        <h1
                            className="all-projects-h1"
                            data-aos="fade-right"
                            data-aos-duration="700" // продолжительность 1 секунда
                            data-aos-delay="50" // задержка 200ms
                            data-aos-offset="100" // отступ 150px
                        >
                            Популярные проекты
                        </h1>
                        <a
                            href="/projects"
                            className="all-projects-href-p"
                            data-aos="fade-left"
                            data-aos-duration="700" // продолжительность 1 секунда
                            data-aos-delay="50" // задержка 200ms
                            data-aos-offset="100" // отступ 150px
                        >
                            Все проекты
                        </a>
                    </div>

                    <Row xs={1} md={3} className="g-4">
                        {project.map((project) => (
                            <Col key={project.pk}>
                                <MyCard
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
                                    start_date={project.start_date}
                                    end_date={project.end_date}
                                />
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Новые проекты */}
                <div className="mb-5">
                    <div className="d-flex justify-content-between mt-4 mb-4">
                        <h1
                            className="all-projects-h1"
                            data-aos="fade-right"
                            data-aos-duration="700" // продолжительность 1 секунда
                            data-aos-delay="50" // задержка 200ms
                            data-aos-offset="100" // отступ 150px
                        >
                            Новые проекты
                        </h1>
                        <a
                            href="/projects"
                            className="all-projects-href-p"
                            data-aos="fade-left"
                            data-aos-duration="700" // продолжительность 1 секунда
                            data-aos-delay="50" // задержка 200ms
                            data-aos-offset="100" // отступ 150px
                        >
                            Все проекты
                        </a>
                    </div>
                    <Row xs={1} md={3} className="g-4">
                        {projectNew.map((project) => (
                            <Col key={project.pk}>
                                <MyCard
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
                                    start_date={project.start_date}
                                    end_date={project.end_date}
                                    data-aos="fade-up" // добавлен атрибут для анимации
                                />
                            </Col>
                        ))}
                    </Row>
                </div>

                {/* Закрытые проекты */}
                <div className="mb-5">
                    <div className="d-flex justify-content-between mt-4 mb-4">
                        <h1
                            className="all-projects-h1"
                            data-aos="fade-right"
                            data-aos-duration="700" // продолжительность 1 секунда
                            data-aos-delay="50" // задержка 200ms
                            data-aos-offset="100" // отступ 150px
                        >
                            Сбор окончен
                        </h1>
                        <a
                            href="/projects"
                            className="all-projects-href-p"
                            data-aos="fade-left"
                            data-aos-duration="700" // продолжительность 1 секунда
                            data-aos-delay="50" // задержка 200ms
                            data-aos-offset="100" // отступ 150px
                        >
                            Все проекты
                        </a>
                    </div>
                    <Row xs={1} md={3} className="g-4">
                        {projectClose.map((project) => (
                            <Col key={project.pk}>
                                <MyCard
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
                                    start_date={project.start_date}
                                    end_date={project.end_date}
                                    data-aos="fade-up" // добавлен атрибут для анимации
                                />
                            </Col>
                        ))}
                    </Row>
                </div>
            </Container>
        </>
    );
};

export default Home;
