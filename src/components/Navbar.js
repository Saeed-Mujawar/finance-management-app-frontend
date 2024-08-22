import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { UserOutlined, LogoutOutlined, DeleteOutlined} from '@ant-design/icons';
import { Modal, Form, Input, Button, Typography, notification} from 'antd';
import { updateUser, deleteUser } from '../api';

const { Title } = Typography;

const Navbar = ({ authenticated, setAuthenticated, setIsSignUpDisabled}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (isModalVisible) {    
      fetchUserData();
    }
  }, [isModalVisible, form]);

  const fetchUserData = () => {
    try {
      const username = localStorage.getItem('username');
      const email = localStorage.getItem('email');
      form.setFieldsValue({
        username: username || '',
        email: email || '',
      });
    } catch (error) {
      console.error('Failed to load user data', error);
    }
  };
  
  const showModal = () => setIsModalVisible(true);

  const handleCancel = () => setIsModalVisible(false);

  const handleProfileClick = () => showModal();

  const handleSignOut = () => {
    localStorage.clear();
    setIsModalVisible(false);
    setAuthenticated(false);
    navigate('/');
  };

  const onFinish = async (values) => {
    try {
      await updateUser(localStorage.getItem('userId'), values); 

      notification.success({
        message: 'Profile Updated',
        description: 'Your profile has been updated successfully.',
      });
      localStorage.setItem('username', values.username);
      localStorage.setItem('email', values.email);
      setIsModalVisible(false);
    } catch (error) {
      notification.error({
        message: 'Update Failed',
        description: 'There was an error updating your profile. Please try again.',
      });
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this account?',
      content: 'This action cannot be undone. All user-related data will be permanently removed.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => handleConfirmDelete(),
    });
  };

  const handleConfirmDelete = async () => {
    try {
     
      await deleteUser(localStorage.getItem('userId')); 
      notification.success({
        message: 'Account Deleted',
        description: 'Your account and transactions have been deleted.',
      });
      localStorage.clear();
      setAuthenticated(false);
      setIsModalVisible(false);
      setIsSignUpDisabled(false)
      navigate('/');
    } catch (error) {
      notification.error({
        message: 'Deletion Failed',
        description: 'There was an error deleting your account. Please try again.',
      });
    }
  };



  return (
    <>
      <nav className='navbar navbar-dark bg-primary sticky-top'>
        <div className='container-fluid'>
          <a className='navbar-brand'>
            <span style={{ fontWeight: 'bold', fontSize: '1.5em' }}>Spend Smart</span>
            <span style={{ fontSize: '1em', marginLeft: '10px' }}>- Track | Save | Grow</span>
          </a>
          <div className='d-flex align-items-center ml-auto m-3'>
            {authenticated && (
              <span className='text-white' onClick={handleProfileClick} style={{ cursor: 'pointer' }}>
                <UserOutlined style={{ fontSize: '1.4em' }} />
                <span style={{ fontSize: '1em', marginLeft: '5px' }}>{localStorage.getItem('username')}</span>
              </span>
            )}
          </div>
        </div>
      </nav>

      <Modal
        title="Edit Profile"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <div className='container mt-4'>
          <Title level={2}>Edit Profile</Title>
          <Form
            form={form}
            onFinish={onFinish}
            layout='vertical'
            style={{ maxWidth: '600px', margin: 'auto' }}
          >
            <Form.Item
              label='Username'
              name='username'
              rules={[{ required: true, message: 'Please enter your username!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label='Email'
              name='email'
              rules={[{ required: true, type: 'email', message: 'Please enter a valid email!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Save Changes
              </Button>
            </Form.Item>
          </Form>

          <Button
            className='btn-hover'
            type='text'
            onClick={handleSignOut}
            icon={<LogoutOutlined />}
            style={{ marginTop: '20px' }}
          >
            Sign Out
          </Button>

          <Button
            className=' btn-hover'
            type='text'
            onClick={handleDelete}
            icon={<DeleteOutlined />}
            style={{ marginTop: '20px' }}
          >
            Delete Account
          </Button>

        </div>
      </Modal>

      
    </>
  );
};

export default Navbar;
