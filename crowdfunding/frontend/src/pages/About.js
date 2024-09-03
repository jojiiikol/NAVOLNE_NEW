import React, { Component } from 'react'
import { Container } from 'react-bootstrap'
import Carousel from 'react-bootstrap/Carousel';
export default class About extends Component {
	render() {
		return (
			<Container>


<Carousel data-bs-theme="white" style={{ marginTop: '80px' }}>
					<Carousel.Item style={{ backgroundColor: '#000' }}>
						<img style={{ height: 350, objectFit: 'cover', opacity: '0.7' }}
							className="d-block w-100"
							src="https://sun9-69.userapi.com/impg/GrZIn5oj68-zsPwjEWgnqHA-IiPS2nxpzQpI2Q/SJpVi32HAvo.jpg?size=1778x1332&quality=96&sign=b38093ddbff7be56d00595c3796a38d6&type=album"
							alt="First slide"
						/>
						<Carousel.Caption className=' h-100 d-flex flex-column justify-content-center align-items-center'>
							<h1 style={{ fontWeight: 'bold', fontSize: '55px' }}>Первые на рынке</h1>
							<h4>на рынке хмао ихиххихихих.</h4>
						</Carousel.Caption>
					</Carousel.Item>
					<Carousel.Item style={{ backgroundColor: '#000' }}>
						<img style={{ height: 350, objectFit: 'cover', opacity: '0.7' }}
							className="d-block w-100"
							src="https://sun3-4.userapi.com/impg/ytP-eVv0t4uKkC4RL_e5t8LGc9uBIzzpEYlYvw/knLdiSu6Z9o.jpg?size=301x167&quality=96&sign=7560ee0aa288b200028e21fd92f0a2e9&type=album"
							alt="Second slide"
						/>
						<Carousel.Caption className='h-100 d-flex flex-column justify-content-center align-items-center'>
							<h1 style={{ fontWeight: 'bold', fontSize: '55px' }}>Продам пенсионерку</h1>
							<h4>звонить по номеру +7 982 526-01-31</h4>
						</Carousel.Caption>
					</Carousel.Item >
					<Carousel.Item style={{ backgroundColor: '#000' }}>
						<img style={{ height: 350, objectFit: 'cover', opacity: '0.7' }}

							className="d-block w-100"
							src="https://sun9-26.userapi.com/impf/-LINEyKbMli6c9E8vIC0K555zOpz3vNXIwF7vg/3x1CDNzXV2Q.jpg?size=807x538&quality=95&sign=36b9f24494de2c0dc916f64d452f3501&type=album"
							alt="Third slide"
						/>
						<Carousel.Caption className='h-100 d-flex flex-column justify-content-center align-items-center'>
							<h1 style={{ fontWeight: 'bold', fontSize: '55px' }}>Я не буду делать</h1>
							<h4>сайт говна.</h4>
						</Carousel.Caption>
					</Carousel.Item>
				</Carousel>



			</Container>
		)
	}
}
