
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Image, Button, ListGroup, ListGroupItem } from 'react-bootstrap'


const ProfileComponent = () => {
	// useEffect(() => {
	// 	if (!localStorage.getItem('accessToken')) {
	// 		window.location.href = `/login`; }
	// }, []);
	const { profilename } = useParams();
	const [data, setData] = useState(null);

	const [isCleared, setIsCleared] = useState(false);

	const clearLocalStorage = () => {
		if (!isCleared) {
			localStorage.clear();
			setIsCleared(true);
			window.location.href = `/home`;
		}
	};

	useEffect(() => {
		const fetchData = async () => {
			const accessToken = localStorage.getItem('accessToken');
			if (localStorage.getItem('accessToken')) {
				const response = await fetch('http://localhost:8000/profile/' + profilename, {
					headers: {
						'Content-Type': 'application/json',
							'Authorization': 'Bearer ' + accessToken
					}
				});
				const data = await response.json();
			setData(data);
			console.log(data);
			}
			if (!localStorage.getItem('accessToken')) {
				const response = await fetch('http://localhost:8000/profile/' + profilename, {
					headers: {
						'Content-Type': 'application/json',
					}
				});
				const data = await response.json();
			setData(data);
			console.log(data);
			}
		};
		fetchData();
	}, [profilename]);


	return (

		<Container style={{ marginTop: '80px' }}>
			{data && <div>

				<div className='d-flex'>
					<div>
						<Image style={{ width: '300px', height: '300px', objectFit: 'cover' }} className='me-5' src="https://sun9-39.userapi.com/impf/c639516/v639516440/2c3d1/bO6A6_2iA1g.jpg?size=2560x1920&quality=96&sign=36cdf1e80389044a86f527f9b693eb77&type=album" rounded />
						<p className='fs-5 fw-normal text-secondary mt-3' style={{ width: '300px' }}>Поддержал проекты на сумму: {data.user_info.total_money_sent}</p>
						{data.is_owner && <div className='d-flex'><p className='fs-5 fw-normal text-secondary ' style={{ width: '300px' }}>Баланс: </p><p className='fs-5 fw-normal text-normal '> {data.user_info.money}</p></div>}

						{data.is_owner &&
							<div className='d-flex justify-content-between me-3' style={{ width: '300px' }}>
								<Button variant="danger" onClick={clearLocalStorage}>Выйти</Button>
								<Button variant='secondary'>Редактировать</Button>
								<Button variant='primary' href='/create'>Создать</Button>
							</div>
						}
					</div>
					<div>
						<p className='fs-1 fw-bold mb-0'>{data.user_info.first_name} {data.user_info.last_name}</p>
						<p className='fs-5 fw-normal text-secondary'>Автор присоединился {data.user_info.date_joined}</p>
						{data.user_info.about &&
							<div >
								<p className='fs-5 fw-normal text-secondary'>О себе: </p>
								<p className='fs-5 fw-normal '>{data.user_info.about}</p>
							</div>
						}

						{!data.user_info.about &&
							<div >
								<p className='fs-5 fw-normal text-secondary'>О себе: </p>
								<p className='fs-5 fw-normal'>пользователь любит анонимность, поэтому ничего о себе решил не рассказывать</p>
							</div>
						}

						{data.user_info.sex &&
							<div className='d-flex' >
								<p className='fs-5 fw-normal text-secondary'>Пол: </p>
								<p className='fs-5 fw-normal ms-1'>{data.user_info.sex}</p>
							</div>
						}

						{!data.user_info.sex &&
							<div className='d-flex' >
								<p className='fs-5 fw-normal text-secondary'>Пол: </p>
								<p className='fs-5 fw-normal ms-1'>всё сложно...</p>
							</div>
						}

						{data.user_info.skill.length === 0 &&
							<div className='d-flex' >
								<p className='fs-5 fw-normal text-secondary'>Навыки: </p>
								<p className='fs-5 fw-normal ms-1'>пользователь ничего не умеет</p>
							</div>
						}

						{data.user_info.skill.length !== 0 &&
							<div className='d-flex' >
								<p className='fs-5 fw-normal text-secondary'>Навыки: </p>

								<p className='fs-5 fw-normal text-normal ms-1'>{data.user_info.skill.join(", ")}</p>
							</div>
						}


					</div>

				</div>

				<div>
					<p className='fs-1 fw-bold mb-0 text-center'>Проекты пользователя:</p>

					<ListGroup>

						{data.user_info.projects.length === 0 &&
							<p className='fs-3 fw-normal mb-0 text-center'>У {data.user_info.first_name} еще нет проектов... Не будь как {data.user_info.first_name}, скорее <a href='/create'>создавай проект</a> </p>}
						{data.user_info.projects.length !== 0 && data.user_info.projects.map(project => (
							<ListGroupItem href={`/projects/${project.slug}`} key={project.url} action>{project.name}</ListGroupItem>
						))}

					</ListGroup>
				</div>
			</div>
			}

		</Container>

	)

}

export default ProfileComponent;