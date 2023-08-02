import React, { useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { Button, Form, Row, Col, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Message from '../components/Message';
import Loader from '../components/Loader';
import { getUserDetails, updateUserProfile } from './../actions/userActions';
import { listMyOrders } from './../actions/orderActions'
import { LinkContainer } from 'react-router-bootstrap';
import { USER_UPDATE_PROFILE_RESET } from '../constants/userConstants';

const ProfileScreen = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState(null)

    const dispatch = useDispatch()

    const userDetails = useSelector(state => state.userDetails)
    const { loading, error, user } = userDetails

    console.log('user: loading: ', loading, 'error: ', error, 'user: ', user);

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin

    console.log('userInfo: ', userInfo);

    const userUpdateProfile = useSelector(state => state.userUpdateProfile)
    const { success } = userUpdateProfile

    console.log('userUpdateProfile: success: ', success);

    const orderListMy = useSelector(state => state.orderListMy)
    const { loading:loadingOrders, error:errorOrders, orders } = orderListMy
    console.log('loading: ', loadingOrders, 'error: ', errorOrders, 'orders: ', orders);

    const navigate = useNavigate()
    useEffect( () => {
        if(!userInfo) {
            navigate('/login')
        } else {
            if(!user || !user.name) {
                // dispatch({ type: USER_UPDATE_PROFILE_RESET })
                dispatch(getUserDetails('profile'))
                dispatch(listMyOrders())
            } else {
                // console.log('user: ', user);
                setName(user.name)
                setEmail(user.email)
            }
        }
    }, [dispatch, navigate, userInfo, user])

    const submitHandler = (e) => {
        e.preventDefault()
        // console.log('data: ', name, email, password);
        // DISPATCH REGISTER
        if(password !== confirmPassword) {
            setMessage('Passwords do not match')
        } else {
            //DISPATCH UPDATE PROFILE
            dispatch(updateUserProfile({ id: user._id, name, email, password }))
        }

    }


  return (
    <Row>
        <Col md={3}>
            <h2>My Profile</h2>
            {error && <Message variant='danger'>{error}</Message>}
            {message && <Message variant='danger'>{message}</Message>}
            {success && <Message variant='success'>Profile Updated (Please Logout and Sign In again)</Message>}
            {loading && <Loader />}
            <Form onSubmit={submitHandler}>
                <Form.Group controlId='name'>
                    <Form.Label>Name</Form.Label>
                    <Form.Control 
                        type='name' 
                        placeholder='Enter Name' 
                        value={name} 
                        onChange={(e)=>setName(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='email'>
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control 
                        type='email' 
                        placeholder='Enter Email' 
                        value={email} 
                        onChange={(e)=>setEmail(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='password'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type='password' 
                        placeholder='Enter Password' 
                        value={password} 
                        onChange={(e)=>setPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Form.Group controlId='confirmPassword'>
                    <Form.Label>Password</Form.Label>
                    <Form.Control 
                        type='confirmPassword' 
                        placeholder='Confirm Password' 
                        value={confirmPassword} 
                        onChange={(e)=>setConfirmPassword(e.target.value)}
                    ></Form.Control>
                </Form.Group>

                <Button type='submit' variant='primary'>
                    Update
                </Button>
            </Form>
        </Col>
        <Col md={9} >
            <h2> My Orders</h2>
            {loadingOrders ? <Loader /> : errorOrders ? <Message variant='danger'>{errorOrders}</Message>:(
                <Table striped bordered hover responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders && orders.map(order => (
                            <tr key={order._id}>
                                <td>{order._id}</td>
                                <td>{order.createdAt.substring(0,10)}</td>
                                <td>{order.totalPrice}</td>
                                <td>{order.isPaid ? (
                                    order.paidAt.substring(0,10)
                                    ) : (
                                        <i className='fas fa-times' style={{ color:'red' }}></i>
                                    )}
                                </td>
                                <td>{order.isDelivered ? (
                                    order.deliveredAt.substring(0,10)
                                    ) : (
                                        <i className='fas fa-times' style={{ color:'red' }}></i>
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/order/${order._id}`}>
                                        <Button className='btn-sm' variant='light'>Details</Button>
                                    </LinkContainer>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </Col>
    </Row>

  )
}

export default ProfileScreen
