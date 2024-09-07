import React from 'react'
import { Link } from 'react-router-dom'
import { Card, Image, ListGroup } from 'react-bootstrap'


const ContactCard = (props) => {
	const { email, first_name, last_name, username, image, slug } = props;
	return (
		<div>
			<Card style={{ width: '400px' }} className='shadow border-0 rounded-4'>
				<Card.Body >
					<Card.Title className='fs-4 center text-center'>Контактная информация</Card.Title>
					<ListGroup className="list-group-flush">
						<ListGroup.Item></ListGroup.Item>
						<ListGroup.Item className=''>
							<span className='text-secondary fs-5'>СОЗДАТЕЛЬ </span>
							<div className='mt-2 d-flex justify-content-between'>
								<a href={`/profile/${username}`}>
								<Image src={image} roundedCircle style={{ width: '80px', height: '80px' }} className='border border-primary border-3 shadow-sm' href={`/profile/${username}`}></Image>
								</a>
							
								<div>

									<p className='fs-5 fw-bold mb-0'>{first_name} {last_name}</p>
									
									<div className='d-flex '>
										<span className="material-symbols-outlined my-auto text-secondary">person</span>
										<p className='text-secondary mb-0 ms-1' >{username}</p>
									</div>

									<div className='d-flex '>
										<span className="material-symbols-outlined my-auto text-secondary">mail</span>
										<p className="d-flex align-items-center ms-1 align-middle my-auto text-secondary">{email}</p>
									</div>
									
								</div>



							</div>
						</ListGroup.Item>

					</ListGroup>
				</Card.Body>

			</Card>
		</div>


	)


}

export default ContactCard;