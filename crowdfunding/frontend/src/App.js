import './App.css';
import '../src/css/custom.scss';
//import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/header';
import Footer from './components/footer';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import TokenCheck from './components/functions/TokenCheck';

function App() {
    TokenCheck();
    return (
        <div>
            <SimpleBar style={{ maxHeight: 1000 }}>
                <Header></Header>
            </SimpleBar>
            <Footer />
        </div>
    );
}

export default App;
