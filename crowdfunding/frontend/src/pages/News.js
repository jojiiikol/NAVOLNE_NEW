import React, { Component } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import PostCard from '../components/cards/PostCard';

import url from '../components/functions/globalURL';

class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: null,
        };
    }

    componentDidMount() {
        fetch(url + `/posts/`) // замените на URL вашего DRF API и ID проекта
            .then((response) => response.json())
            .then((data) => {
                this.setState({ posts: data.results });
                console.log(this.state.posts);
            })
            .catch((error) => console.error('Ошибка:', error));
    }

    render() {
        const { posts } = this.state;
        if (!posts) {
            return <div>Loading...</div>;
        }

        return (
            <>
                <Container
                    fluid
                    style={{
                        marginTop: '80px',
                    }}
                >
                    <p className="fs-2 fw-bold mb-0 ">Новости по проектам:</p>

                    {this.state.posts && (
                        <Row xs={1} md={3} className="g-4 mt-2 mb-3">
                            {this.state.posts.map((post) => (
                                <Col>
                                    <PostCard
                                        slug={post.pk}
                                        name={post.name}
                                        description={post.description}
                                        image={post.image}
                                        date={post.date}
                                        user={post.user}
                                    />
                                </Col>
                            ))}
                        </Row>
                    )}
                </Container>
            </>
        );
    }
}

export default News;
