import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Button, Typography, notification } from 'antd';
import { LogoutOutlined, DeleteOutlined } from '@ant-design/icons';
import { updateUser, deleteUser, verifyOtp } from '../api';
import LoadingOverlay from './LoadingOverlay';
import './styles.css';

const { Title } = Typography;

const ProfileModal = ({ visible, onCancel, onSignOut, setAuthenticated, setIsSignUpDisabled }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [tempUserId, setTempUserId] = useState('');
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();

  useEffect(() => {
    if (visible) {
      fetchUserData();
    }
  }, [visible]);

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

  const handleOtpSubmit = async (otpValues) => {
    setIsLoading(true);
    try {
      await verifyOtp({ tempUserId, otp: otpValues.otp });
      notification.success({
        message: 'Email Verified',
        description: 'Your email has been verified successfully. Please login again.',
      });
      
      setIsOtpModalVisible(false);
      onCancel(); 
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
      const currentEmail = localStorage.getItem('email');
      const currentUsername = localStorage.getItem('username');

      const emailChanged = values.email !== currentEmail;
      const usernameChanged = values.username !== currentUsername;

      if (emailChanged || usernameChanged) {
        if (emailChanged) {
          const response = await updateUser(localStorage.getItem('userId'), values);
          setTempUserId(response.temp_user_id);
          setIsOtpModalVisible(true); 
        } else {
          await updateUser(localStorage.getItem('userId'), values);

          notification.success({
            message: 'Profile Updated',
            description: 'Your profile has been updated successfully.',
          });

          localStorage.setItem('username', values.username);
          onCancel();
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
      onCancel();
      setIsSignUpDisabled(false);
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
      <Modal
        title="Edit Profile"
        visible={visible}
        onCancel={onCancel}
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
            onClick={onSignOut}
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
          <Form form={otpForm} onFinish={handleOtpSubmit}>
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

export default ProfileModal;
