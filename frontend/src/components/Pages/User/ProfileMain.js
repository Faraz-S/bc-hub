import React from 'react';
import { Container, Col, Row, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'
import ProfileLink from './ProfileLink';
import { useState } from 'react';
import FollowButton from './FollowButton';
import FollowList from './FollowList';
import useFetch from "../../../hooks/useFetch"


const Profilemain = ({userName, userNickName, userId, followerNum, followingNum, emailAddr, profilePic, isOwner, isLoggedIn}) => {
    const [openModal, setOpenModal] = useState(false);
    const [followersModal, setFollowersModal] = useState(false);
    const [followingModal, setFollowingModal] = useState(false);
    const {data: userPosts, isLoading, error}  = useFetch('http://localhost:5000/community/user-posts/' + userId);



    const attemptChangeAvatar = () => {
        // console.log('blah bah blah',isOwner)
        if (isOwner){
            setFollowersModal(false)
            setFollowingModal(false)
            setOpenModal(true)
        }
    }

    return (
        <div id='ProfileMain'> 
        {openModal && <ProfileLink closeModal={setOpenModal} />}
        {followersModal && <FollowList closeModal={setFollowersModal} type={'Followers'} userId={userId} />}
        {followingModal && <FollowList closeModal={setFollowingModal} type={'Following'} userId={userId} />}
            <Container className='d-flex align-items-center justify-content-center pt-5 ' align={"center"}>
                {isLoggedIn.loggedIn && isLoggedIn.user._id === userId ?
                    <a className=''> 
                        <img className='square mx-5 rounded-cricle btn hov shadow' src={profilePic} alt = 'Not Found' width={200} height={200} onClick={attemptChangeAvatar} />
                    </a>
                    :
                    <img className='square mx-5 rounded-cricle btn shadow pe-none' src={profilePic} alt = 'Not Found' width={200} height={200} />
                }
                

                <Col className='col-2' >
                    {!isLoading && userPosts &&
                    <>
                        <h4>{userPosts.length}</h4>
                        <h3 style={{fontWeight: 'normal'}}>Posts</h3>
                    </>
                    }
                </Col>

                <Col className='col-2 follow-list' onClick={() => {
                                                        setOpenModal(false)
                                                        setFollowingModal(false)
                                                        setFollowersModal(true)
                                                        }}>
                    <h4>{followerNum}</h4>
                    <h3 style={{fontWeight: 'normal'}}>Followers</h3>
                </Col>
                
                <Col className='col-2 follow-list' onClick={() => {
                                                        setOpenModal(false)
                                                        setFollowersModal(false)
                                                        setFollowingModal(true)
                                                        }}>
                    <h4>{followingNum}</h4>
                    <h3 style={{fontWeight: 'normal'}}>Following</h3>
                </Col>

            </Container>
            <div style={{ marginTop: 50}}>
                <div className="d-flex justify-content-between">
                    <h2>{userName}</h2>
                    {isLoggedIn.loggedIn && isLoggedIn.user._id !== userId && <FollowButton user={isLoggedIn.user} id={userId}/>}
                </div>
                <h5 style={{fontStyle: 'italic', color:'grey'}}>{userNickName}</h5>
                {isLoggedIn.loggedIn && isLoggedIn.user._id === userId && 
                    <>
                        <h5>Email Address: {emailAddr}</h5>
                    </>
                }   
            </div>

            <hr style={{zIndex: -2}}/>

            
        </div>
    );
}

export default Profilemain;
