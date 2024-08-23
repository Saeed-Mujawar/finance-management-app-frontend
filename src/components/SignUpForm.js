import React from 'react';
import { Form, Input, Button, notification, Modal } from 'antd';
import { useState } from 'react';
import { signUp, verifyOtp } from '../api';
import LoadingOverlay from './LoadingOverlay';

const SignUpForm = ({ onSuccess, disabled }) => {
  const [form] = Form.useForm();
  const [otpForm] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    try {
      const response = await signUp(values);
      setTempUserId(response.temp_user_id);
      setIsModalVisible(true);
    } catch (error) {
      notification.error({
        message: 'Signup Failed',
        description: error.message || 'There was an error signing up. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (otpValues) => {
    setIsLoading(true);
    try {
      
      await verifyOtp({ tempUserId, otp: otpValues.otp });
      notification.success({
        message: 'Signup Successful',
        description: 'OTP Verified. You have successfully signed up. Now please sign in.',
      });
      setIsModalVisible(false);
      form.resetFields();
      otpForm.resetFields();
      onSuccess();
    } catch (error) {
      notification.error({
        message: 'OTP Verification Failed',
        description: error.message || 'Invalid OTP. Please try again.',
      });
    }finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <Form
        form={form}
        name="signup"
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please enter your username!' }]}
        >
          <Input disabled={disabled}/>
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please enter your email!' }]}
        >
          <Input type="email" disabled={disabled}/>
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please enter your password!' }]}
        >
          <Input.Password disabled={disabled}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-100" disabled={disabled}>
            Sign Up
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title="Enter OTP"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={otpForm} onFinish={handleOtpSubmit}>
          <Form.Item
            label="OTP"
            name="otp"
            rules={[{ required: true, message: 'Please enter the OTP sent to your email!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-100">
              Verify OTP
            </Button>
          </Form.Item>
        </Form>
      </Modal>
      {isLoading && <LoadingOverlay />}
    </div>
  );
};

export default SignUpForm;
