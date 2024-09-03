import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Image, Row, Col, Button } from 'react-bootstrap'
import ProgressBar from './progress-bar.component';

const SearchComponent = () => {

	const { slug } = useParams();
	const [data, setData] = useState(null);


	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch(`http://localhost:8000/projects/all?search=${slug}`);
			const data = await response.json();
			setData(data);
		};
		console.log(slug);
		fetchData();
	}, [slug]);



	return (

		<Container style={{ marginTop: '80px' }}>

				{/* {data && <div>
					<Image style={{ width: '100%', height: '200px', objectFit: 'cover' }} src="https://png.pngtree.com/back_origin_pic/00/02/16/cd1f6288c79730c5c2e50e9498dbb00b.jpg" rounded />

					<Row xs={1} md={2} className='g-4 mt-3'>
						<Col>
							<p className='fs-1 fw-bold mb-0'>{data.project.name}</p>
							<p className='fs-5 text-secondary '>{data.project.small_description}</p>
							<div className='d-flex'>
								{data.project.category.map((category, index) => (
									<div className="badge bg-primary text-wrap ms-1 mb-1" style={{ width: "6rem" }} key={index}>{category}</div>
								))}
							</div>
							<ProgressBar bgcolor={"#0d6efd"} completed={Math.round((data.project.collected_money / data.project.need_money) * 100)} completed_money={data.project.collected_money} need_money={data.project.need_money} />
						</Col>

						<Col style={{ paddingLeft: '10px' }} >
							<span className='text-secondary fs-3 d-flex flex-row-reverse'>Контактная информация:</span>
							<div className='d-flex flex-row-reverse'>
								<span className='fs-4 ms-2' > <a href={`/profile/${data.project.user.username}`}>{data.project.user.first_name} {data.project.user.last_name}</a></span>
								<span className='text-secondary fs-4 '>Автор: </span>
							</div>

							<div className='d-flex flex-row-reverse'>
								<p className="d-flex align-items-center ms-1 align-middle my-auto fs-5">{data.project.user.email}</p>
								<span className="material-symbols-outlined my-auto">mail</span>

							</div>
							<div className='d-flex flex-row-reverse'>
								<Button size='lg' className='mt-3' href="#">Поддержать проект</Button>
							</div>



						</Col>
					</Row>

					<div className=' mt-3 d-block' >
						<span className='text-secondary fs-3 '>О проекте:</span>

					</div>
					<span className='fs-5 '>{data.project.description}</span>
				</div>}


 */}


		</Container>


	)

}

export default SearchComponent;