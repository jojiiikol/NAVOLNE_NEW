
import './App.css';
import '../src/css/custom.scss'
//import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/header';
import Footer from './components/footer'
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';




function App() {

  return (
		<div >
			<SimpleBar style={{ maxHeight: 1000}}>
			<Header></Header>
			<Footer></Footer>
			</SimpleBar>
			
		
		</div>
  );
}

export default App;
