import React, { Component } from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form'
import idea from '../images/idea.png'

export default class Registration extends Component {

	constructor(props) {
    super(props);
    this.state = {
      username: '',
      password_1: '',
			password_2: '',
      email: '',
			last_name:'',
			first_name:''
    };
  }
	componentDidMount() {
		if (localStorage.getItem('accessToken')!=='undefined' && localStorage.getItem('accessToken') ) {
			window.location.href =`/profile/${localStorage.getItem('user')}`;
    }
  }
  handleChange = event => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = event => {
    event.preventDefault();
    const { username, password_1, password_2, email, first_name, last_name } = this.state;
    fetch('http://localhost:8000/reg/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
				last_name,
				first_name,
        password_1,
				password_2,
        email
      })
    })
    .then(response => response.json())
    .then(data => {console.log(data); this.setState({errorMessage: data});})
    
		.catch(error => { 
     
			console.error(error);
    })
  };
	render() {
		
		return (
			<Container style={{marginTop:'60px'}}>
			
				<Row xs={1} md={2} className='g-4'>
					<Col>
					<h1 style={{marginBottom: '0.5em', fontWeight:'bold', fontSize:'55px'}}>
					Регистрация
					</h1>
						<div className='registration-pik-and-text' style={{display:'flex', alignItems:'center'}}>
							<img
								src={idea}
								height="180"
								width="180"
								className='d-inline-block align-top'
								alt='Logo'
								marginRight='15px'
							/>
							<div className='registration-pik-and-text-rectangle' 
							style={{
								width:'100%',
								height: '135px',
								border:'solid',
								borderColor:'#0d6efd',
								borderWidth: 'thin',
								borderRadius:'10px 10px 10px 0'
							}}
							>
								<p style={{marginLeft:'1em', marginTop:'1em'}}>Если вы уже зарегистрированы, просто войдите в свой аккаунт.</p>
								<Button style={{marginLeft:'1em'}} size="sm"  href='/Login' >Войти в аккаунт</Button>
							</div>
						</div>

						

						<Form onSubmit={this.handleSubmit}>
							<Form.Group className="mb-3" controlId="formBasicPassword">
								<Form.Label>Логин</Form.Label>
								<Form.Control name="username" value={this.state.username} onChange={this.handleChange}  type="text" placeholder="Введите логин" />
								{ this.state.errorMessage && <Form.Text className="text-danger"> { this.state.errorMessage.username } </Form.Text> }
								<div style={{display:'block'}}>
								
								<Form.Text className="text-muted">
									*имя, которое увидят другие пользователи
								
								</Form.Text>
								</div>
								
							</Form.Group>

							<Form.Group className="mb-3" controlId="formBasicEmail">
								<Form.Label>Email</Form.Label>
								<Form.Control type="email" name="email" value={this.state.email} onChange={this.handleChange} placeholder="Введите ваш email" />
								{this.state.errorMessage && <Form.Text className="text-danger"> { this.state.errorMessage.email } </Form.Text> }
							</Form.Group>

							<Form.Group className="mb-3" controlId="formBasicPassword">
								<Form.Label>Пароль</Form.Label>
								<Form.Control type="password" name="password_1" value={this.state.password_1} onChange={this.handleChange} placeholder="Введите сложный пароль" />
								{this.state.errorMessage && <Form.Text className="text-danger"> { this.state.errorMessage.password_1 } </Form.Text> }
							</Form.Group>

							<Form.Group className="mb-3" controlId="formBasicPassword">
								<Form.Label>Повторите пароль</Form.Label>
								<Form.Control type="password" name="password_2" value={this.state.password_2} onChange={this.handleChange} placeholder="Опять введите свой пароль)" />
								{this.state.errorMessage && <Form.Text className="text-danger"> { this.state.errorMessage.password_2 } </Form.Text> }
							</Form.Group>

							<Form.Group className="mb-3" controlId="formBasicPassword">
								<Form.Label>Фамилия</Form.Label>
								<Form.Control name="last_name" value={this.state.last_name} onChange={this.handleChange} type="text" placeholder="Введите фамилию" />
								{this.state.errorMessage && <Form.Text className="text-danger"> { this.state.errorMessage.last_name } </Form.Text> }
								<div style={{display:'block'}}>
								<Form.Text className="text-muted">
									*напишите свою настоящую фамилию
								</Form.Text>
								</div>
								
							</Form.Group>

							<Form.Group className="mb-3" controlId="formBasicPassword">
								<Form.Label>Имя</Form.Label>
								<Form.Control name="first_name" value={this.state.first_name} onChange={this.handleChange} type="text" placeholder="Введите имя" />
								{this.state.errorMessage && <Form.Text className="text-danger"> { this.state.errorMessage.first_name } </Form.Text> }
								<div style={{display:'block'}}>
								<Form.Text className="text-muted">
									*напишите своё настоящее имя
								</Form.Text>
								</div>
								
							</Form.Group>

							<Form.Group className="mb-3" controlId="formBasicCheckbox" style={{display:'flex'}}>
								<Form.Check type="checkbox" style={{marginRight:'1em'}}/>
								<Form.Label>Нажимая на кнопку «Зарегистрироваться», я соглашаюсь с <a href="https://vk.com/lastimperatorr">политикой по обработке персональных данных</a></Form.Label>
							</Form.Group>

							<Button variant="primary" type="submit">
								Зарегистрироваться
							</Button>

						</Form>
					</Col>


				</Row>
			
			</Container>
		)
	}
}
