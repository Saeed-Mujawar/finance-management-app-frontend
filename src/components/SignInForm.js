import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import { signIn } from '../api';
const SignInForm = ({onSuccess}) => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
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
      </Form>
    </div>
  );
};

export default SignInForm;
