import React, { Component } from 'react'
import { MDBFooter } from 'mdb-react-ui-kit';

export default class footer extends Component {
	
	render() {
		return (
			<>
		    <MDBFooter bgColor='light' className='text-center text-lg-left mt-2'>
      <div className='text-center p-3 mt-auto' style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)'}}>
        &copy; {new Date().getFullYear()} Права защищены:{' '}
        <a className='text-dark' href='/Home'>
          NA VOLNE
        </a>
      </div>
    </MDBFooter>
			</>
		)
	}
}
