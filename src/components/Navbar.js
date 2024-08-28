import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { UserOutlined, LogoutOutlined, DeleteOutlined } from '@ant-design/icons';
import { Modal, Form, Input, Button, Typography, notification } from 'antd';
import { updateUser, deleteUser, verifyOtp } from '../api';
import LoadingOverlay from './LoadingOverlay';
import './styles.css'; 

const { Title } = Typography;

const Navbar = ({ authenticated, setAuthenticated, setIsSignUpDisabled }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [otp, setOtp] = useState('');
  const [tempUserId, setTempUserId] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();

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

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsOtpModalVisible(false);
  }

  const handleProfileClick = () => showModal();

  const handleSignOut = () => {
    localStorage.clear();
    setIsModalVisible(false);
    setAuthenticated(false);
    navigate('/');
  };

  const handleOtpSubmit = async (otpValues) => {
    setIsLoading(true);
    try {
      await verifyOtp({tempUserId, otp: otpValues.otp});
      notification.success({
        message: 'Email Verified',
        description: 'Your email has been verified successfully. Please login again',
      });
      
      setIsOtpModalVisible(false);
      setIsModalVisible(false); 
      otpForm.resetFields();
      setAuthenticated(false);
    } catch (error) {
      notification.error({
        message: 'Verification Failed',
        description: 'There was an error verifying your email. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      setIsLoading(true);
      const currentEmail = localStorage.getItem('email');
      const currentUsername = localStorage.getItem('username');

      const emailChanged = values.email !== currentEmail;
      const usernameChanged = values.username !== currentUsername;

      if (emailChanged || usernameChanged) {
        // OTP is required if either email is changed or both email and username are changed
        if (emailChanged) {        
          const response = await updateUser(localStorage.getItem('userId'), values);
          setTempUserId(response.temp_user_id);
          setIsOtpModalVisible(true); 
        } else {
          // Directly update if only username is changed          
          await updateUser(localStorage.getItem('userId'), values);
  
          notification.success({
            message: 'Profile Updated',
            description: 'Your profile has been updated successfully.',
          });
  
          localStorage.setItem('username', values.username);
          setIsModalVisible(false);
        }
      } 
    } catch (error) {
      notification.error({
        message: 'Update Failed',
        description: 'There was an error updating your profile. Please try again.',
      });
    } finally {
      setIsLoading(false);
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
    setIsLoading(true);
    try {
      await deleteUser(localStorage.getItem('userId'));
      notification.success({
        message: 'Account Deleted',
        description: 'Your account and transactions have been deleted.',
      });
      localStorage.clear();
      setAuthenticated(false);
      setIsModalVisible(false);
      setIsSignUpDisabled(false);
      navigate('/');
    } catch (error) {
      notification.error({
        message: 'Deletion Failed',
        description: 'There was an error deleting your account. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <nav className='navbar navbar-dark sticky-top'>
        <div className='container-fluid'>
          <a className='navbar-brand'>
            <span>Spend Smart</span>
            <span>- Track | Save | Grow</span>
          </a>
          <div className='profile-hover d-flex align-items-center ml-auto m-3'>
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
            type='link'
            onClick={handleSignOut}
            icon={<LogoutOutlined />}
            style={{ marginTop: '20px' }}
          >
            Sign Out
          </Button>

          <Button
            className='btn-hover'
            type='link'
            danger
            onClick={handleDelete}
            icon={<DeleteOutlined />}
            style={{ marginTop: '20px' }}
          >
            Delete Account
          </Button>

        </div>
      </Modal>

      <Modal
        title="Verify Email"
        visible={isOtpModalVisible}
        onCancel={() => setIsOtpModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <div className='container mt-4'>
          <Title level={2}>Verify Email</Title>
          <Form form = {otpForm} onFinish={handleOtpSubmit}>
            <Form.Item
              label='OTP'
              name='otp'
              rules={[{ required: true, message: 'Please enter the OTP sent to your email!' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit' className="w-100" loading={isLoading}>
                Verify OTP
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>


      {isLoading && <LoadingOverlay />}
    </>
  );
};

export default Navbar;
