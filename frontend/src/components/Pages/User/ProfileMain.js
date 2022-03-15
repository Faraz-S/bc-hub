import React from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
const Profilemain = () => {
    return (
        <div id='ProfileMain'> 
            <Container className='d-flex align-items-center justify-content-center pt-5 ' align={"center"}>
                <img className='square mx-5' src='https://media.altchar.com/prod/images/620_350/gm-96146c1a-36df-4399-b6d1-84d4a30512cb-genshin-impact-shogun-raiden-baal.jpg' alt = ''
                />
                <Col className='col-2' >
                    <h4>0</h4>
                    <h3 style={{fontWeight: 'normal'}}>Posts</h3>
                </Col>

                <Col className='col-2'>
                    <h4>0</h4>
                    <h3 style={{fontWeight: 'normal'}}>Followers</h3>
                </Col>
                
                <Col className='col-2'>
                    <h4>0</h4>
                    <h3 style={{fontWeight: 'normal'}}>Following</h3>
                </Col>

            </Container>
            <div style={{ marginTop: 50}}>
                <h2>BioName: The Ei</h2>
                <h5 style={{fontStyle: 'italic', color:'grey'}}>BioDescription: When you hear the thunder, remember me..</h5>
            </div>
            <hr style={{zIndex: -2}}/>

            
        </div>
    );
}

export default Profilemain;
