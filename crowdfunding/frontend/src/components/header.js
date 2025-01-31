import React, { Component } from 'react';
import {
    Container,
    FormControl,
    Nav,
    Navbar,
    Form,
    Button,
} from 'react-bootstrap';
import logo from '../logo512.png';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { PersonFill } from 'react-bootstrap-icons';

import About from '../pages/About';
import Courses from '../pages/Courses';
import Login from '../components/forms/Login';
import News from '../pages/News';
import Projects from '../pages/Projects';
import Registration from '../components/forms/Registration';
import Home from '../pages/Home';
import ProfileComponent from './ProfileComponent';
import ProjectPage from './ProjectPage';
import Create from '../components/forms/CreateComponent';
import SearchComponent from './SearchComponent';
import Category from './CategoryComponent';
import NotFoundComponent from './NotFoundComponent';
import AuthPage from '../pages/AuthPage';
import ProfileChangeRequests from './requests/ProfilesChangeRequests.';
import AdminComponent from './AdminComponent';
export default class header extends Component {
    render() {
        return (
            <>
                <Navbar
                    fixed="top"
                    collapseOnSelect
                    expand="md"
                    bg="white"
                    variant="light"
                    style={{
                        boxShadow: '0px 0px 10px #a8a8a8',
                    }}
                >
                    <Container>
                        <Navbar.Brand href="/home" className="fw-bold">
                            <img
                                src={logo}
                                height="30"
                                width="30"
                                className="d-inline-block align-top"
                                alt="Logo"
                            />{' '}
                            NA VOLNE
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto d-flex justify-content-between">
                                <Nav.Link href="/news" className="fw-bold">
                                    {' '}
                                    Новости{' '}
                                </Nav.Link>
                                <Nav.Link href="/projects" className="fw-bold">
                                    {' '}
                                    Проекты{' '}
                                </Nav.Link>
                                {/* <Nav.Link href="/courses" className="fw-bold">
                                    {' '}
                                    Курсы{' '}
                                </Nav.Link> */}
                                <Nav.Link href="/about" className="fw-bold">
                                    {' '}
                                    FAQ{' '}
                                </Nav.Link>
                            </Nav>
                            <Form className="d-flex">
                                <FormControl
                                    type="text"
                                    placeholder="Найти проект"
                                    className="me-sm-2"
                                />
                                <Button
                                    variant="outline-primary"
                                    className="me-sm-5"
                                    href="/search"
                                >
                                    Найти
                                </Button>
                            </Form>

                            <Nav className="d-flex ms-sm-5">
                                {!localStorage.getItem('accessToken') && (
                                    <div className="d-flex">
                                        <Button
                                            variant="outline-primary"
                                            className="me-sm-2"
                                            href="/auth"
                                        >
                                            Войти
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="me-sm-2"
                                            href="/auth"
                                        >
                                            Зарегистрироваться
                                        </Button>
                                    </div>
                                )}

                                {localStorage.getItem('accessToken') && (
                                    <a
                                        className="text-decoration-none"
                                        href={`/profile/${localStorage.getItem('user')}`}
                                    >
                                        <PersonFill color="#0E7580" size={45} />
                                    </a>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

                <Router>
                    <Switch>
                        <Route exact path="/News" component={News} />
                        <Route exact path="/projects" component={Projects} />
                        <Route exact path="/Courses" component={Courses} />
                        <Route exact path="/About" component={About} />
                        <Route exact path="/Login" component={Login} />
                        <Route exact path="/Auth" component={AuthPage} />
                        <Route
                            exact
                            path="/Registration"
                            component={Registration}
                        />
                        <Route exact path="/Home" component={Home} />
                        <Route exact path="/Create" component={Create} />
                        <Route
                            path="/profile/:profilename"
                            component={ProfileComponent}
                        />
                        <Route path="/projects/:slug" component={ProjectPage} />
                        <Route path="/search/" component={SearchComponent} />
                        <Route path="/category/" component={Category} />
                        <Route
                            path="/admin/:profilename"
                            component={AdminComponent}
                        />
                        <Route
                            path="/profile_change_requests/"
                            component={ProfileChangeRequests}
                        />
                        <Route exact path="*" component={NotFoundComponent} />
                    </Switch>
                </Router>
            </>
        );
    }
}
