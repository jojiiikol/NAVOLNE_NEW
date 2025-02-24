import './App.css';
import '../src/css/custom.scss';
//import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/header';

import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import TokenCheck from './components/functions/TokenCheck';
import Footer from './components/footer';
function App() {
    TokenCheck();
    return (
        <div>
            <Header></Header>
            {/* <SimpleBar style={{ maxHeight: 1000 }}>
               
            </SimpleBar> */}
            {/* <Footer /> */}
        </div>
    );
}

export default App;
