import React, { useState } from 'react';
import { Form, Input, Button, notification, Modal } from 'antd';
import { signIn, forgotPassword, resetPassword } from '../api';
import LoadingOverlay from './LoadingOverlay';

const SignInForm = ({onSuccess}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotPasswordModalVisible, setIsForgotPasswordModalVisible] = useState(false);
  const [isOtpModalVisible, setIsOtpModalVisible] = useState(false);
  const [isPasswordResetLoading, setIsPasswordResetLoading] = useState(false);
  const [tempUserId, setTempUserId] = useState('');
  const [otpForm] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await signIn(values);
      const {id, access_token, username, email, role } = response;
      // localStorage.setItem('password', values.password);
      localStorage.setItem('userId', id);
      localStorage.setItem('token', access_token);
      localStorage.setItem('username', username);
      localStorage.setItem('email', email);
      localStorage.setItem('role', role);
      notification.success({
        message: 'Login Successful',
        description: 'You have successfully logged in.',
      });
      form.resetFields();
      onSuccess();
    } catch (error) {
      notification.error({
        message: 'Login Failed',
        description: 'There was an error logging in. Please check your credentials and try again.',
      });
    }finally {
      setIsLoading(false);
    }
  };

  // Show the forgot password modal
  const handleForgotPasswordClick = () => {
    setIsForgotPasswordModalVisible(true);
  };

  // Handle forgot password modal cancel
  const handleForgotPasswordCancel = () => {
    setIsForgotPasswordModalVisible(false);
  };

  // Handle OTP modal cancel
  const handleOtpModalCancel = () => {
    setIsOtpModalVisible(false);
    otpForm.resetFields();
    resetPasswordForm.resetFields();
  };

  // Handle OTP submission
  const handleOtpSubmit = async (values) => {
    setIsPasswordResetLoading(true);
    try {
      await resetPassword({
        tempUserId,
        otp: values.otp,
        new_password: values.new_password,
      });
      notification.success({
        message: 'Password Reset Successful',
        description: 'Your password has been reset successfully.',
      });
      setIsOtpModalVisible(false);
      setIsForgotPasswordModalVisible(false);
      form.resetFields();
      otpForm.resetFields();
      resetPasswordForm.resetFields();
    } catch (error) {
      notification.error({
        message: 'Password Reset Failed',
        description: 'There was an error resetting your password. Please try again.',
      });
    } finally {
      setIsPasswordResetLoading(false);
    }
  };

  // Handle request for OTP
  const handleForgotPasswordSubmit = async (values) => {
    setIsLoading(true);
    try {
      const response = await forgotPassword(values.email);
      setTempUserId(response.temp_user_id);
      setIsForgotPasswordModalVisible(false);
      setIsOtpModalVisible(true);
    } catch (error) {
      notification.error({
        message: 'Forgot Password Failed',
        description: 'There was an error requesting the password reset. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Sign In</h2>
      <Form
        form={form}
        name="signin"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please enter your username!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-100">
            Sign In
          </Button>
        </Form.Item>
        <Form.Item>
          <Button type="link" onClick={handleForgotPasswordClick} className="w-100">
            Forgot Password?
          </Button>
        </Form.Item>
      </Form>

      {isLoading && <LoadingOverlay />}
      {/* Forgot Password Modal */}
      <Modal
        title="Forgot Password"
        visible={isForgotPasswordModalVisible}
        onCancel={handleForgotPasswordCancel}
        footer={null}
      >
        <Form
          name="forgotPassword"
          onFinish={handleForgotPasswordSubmit}
          layout="vertical"
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please enter your email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-100" loading={isLoading}>
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* OTP and New Password Modal */}
      <Modal
        title="Reset Password"
        visible={isOtpModalVisible}
        onCancel={handleOtpModalCancel}
        footer={null}
      >
        <Form
          form={otpForm}
          name="otp"
          onFinish={handleOtpSubmit}
          layout="vertical"
        >
          <Form.Item
            label="OTP"
            name="otp"
            rules={[{ required: true, message: 'Please enter the OTP sent to your email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="New Password"
            name="new_password"
            rules={[{ required: true, message: 'Please enter your new password!' }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-100" loading={isPasswordResetLoading}>
              Reset Password
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SignInForm;
