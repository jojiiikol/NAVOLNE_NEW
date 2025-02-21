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
import News from '../pages/News';
import Projects from '../pages/Projects';
import Home from '../pages/Home';
import ProfileComponent from '../pages/ProfileComponent';
import ProjectPage from '../pages/ProjectPage';
import Create from '../components/forms/CreateComponent';
import SearchComponent from '../pages/SearchComponent';
import Category from './CategoryComponent';
import NotFoundComponent from './functions/NotFoundComponent';
import AuthPage from '../pages/AuthPage';
import ProfileChangeRequests from './requests/ProfilesChangeRequests.';
import AdminComponent from '../pages/AdminComponent';
import ProjectChangeRequests from './requests/ProjectChangeRequest';
import ShowProfileRequests from './requests/ShowProfileRequests';
import ConfirmedProjects from './requests/ConfirmedProjects';
import ShowClosureAllProjects from './requests/ShowClosureAllProjects';
import Verify from './functions/VerifyEmail';
import ConfirmUsers from './requests/ConfirmUsers';
import PostPage from '../pages/PostPage';
import ForgotPasswordPage from './functions/forgotPasswordPage';

export default class header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: '',
        };
    }
    handleChange = (event) => {
        const { name, value } = event.target;
        this.setState({ [name]: value });
        console.log(this.state.search);
    };

    handleSubmit = (event) => {
        event.preventDefault();
        window.location.href = '/search/' + this.state.search;
        this.state.search = '';
    };
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
                        <Navbar.Brand href="/" className="fw-bold">
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
                            <Form
                                className="d-flex"
                                onSubmit={this.handleSubmit}
                            >
                                <FormControl
                                    type="text"
                                    placeholder="Найти проект"
                                    className="me-sm-2"
                                    name="search"
                                    value={this.state.search}
                                    onChange={this.handleChange}
                                />
                                <Button
                                    variant="outline-primary"
                                    className="me-sm-5 ms-1 ms-lg-0"
                                    onClick={this.handleSubmit}
                                >
                                    Найти
                                </Button>
                            </Form>

                            <Nav className="d-flex ms-sm-5 mt-2 mt-lg-0">
                                {!localStorage.getItem('accessToken') && (
                                    <div className="d-flex ">
                                        <Button
                                            variant="outline-primary"
                                            className="me-2 me-lg-2 "
                                            href="/auth"
                                        >
                                            Войти
                                        </Button>
                                        <Button
                                            variant="primary"
                                            className="me-sm-2 "
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

                        <Route exact path="/Auth" component={AuthPage} />

                        <Route exact path="/" component={Home} />
                        <Route exact path="/Create" component={Create} />
                        <Route
                            path="/profile/:profilename"
                            component={ProfileComponent}
                        />
                        <Route path="/verify/:token" component={Verify} />
                        <Route path="/projects/:slug" component={ProjectPage} />
                        <Route path="/posts/:slug" component={PostPage} />
                        <Route
                            path="/search/:slug"
                            component={SearchComponent}
                        />
                        <Route
                            path="/reset_password/:token"
                            component={ForgotPasswordPage}
                        />
                        <Route path="/category/" component={Category} />
                        <Route
                            path="/admin/:profilename"
                            component={AdminComponent}
                        />
                        <Route
                            path="/profile_change_requests/"
                            component={ProfileChangeRequests}
                        />
                        <Route
                            path="/project_change_requests/"
                            component={ProjectChangeRequests}
                        />
                        <Route
                            path="/show_profile_requests/"
                            component={ShowProfileRequests}
                        />
                        <Route
                            path="/not_confirmed_projects/"
                            component={ConfirmedProjects}
                        />
                        <Route
                            path="/not_confirmed_users/"
                            component={ConfirmUsers}
                        />
                        <Route
                            path="/project_closure_requests/"
                            component={ShowClosureAllProjects}
                        />
                        <Route exact path="*" component={NotFoundComponent} />
                    </Switch>
                </Router>
            </>
        );
    }
}
