import React, { useEffect, useState } from 'react';
import { Form, Input, Checkbox, Button, DatePicker, Select } from 'antd';
import dayjs from 'dayjs';
import './styles.css';

const { Option } = Select;

const TransactionForm = ({ fetchTransactions, editingTransaction, handleFormSubmit, handleCancelEdit }) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState(['Food', 'Transportation', 'Rent', 'Utilities', 'Other']);
  const [isOtherCategory, setIsOtherCategory] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      form.setFieldsValue({
        amount: editingTransaction.amount,
        category: editingTransaction.category,
        description: editingTransaction.description,
        is_income: editingTransaction.is_income,
        date: dayjs(editingTransaction.date),
      });
      setIsOtherCategory(editingTransaction.category === 'Other');
    } else {
      form.resetFields();
      setIsOtherCategory(false);
    }
  }, [editingTransaction, form]);

  const handleCategoryChange = (value) => {
    setIsOtherCategory(value === 'Other');
  };

  const handleFinish = async (values) => {
    
    const formattedValues = {
      ...values,
      date: values.date ? values.date.format('YYYY-MM-DD') : '',
    };

    
    if (isOtherCategory && values.custom_category) {
      formattedValues.category = values.custom_category;
    } else {
      formattedValues.category = values.category;
    }

    
    formattedValues.is_income = !!formattedValues.is_income;

    await handleFormSubmit(formattedValues);
    form.resetFields();
  };

  return (
    <Form
      form={form}
      onFinish={handleFinish}
      layout="vertical"
    >
      <h4 className="bg-primary text-white p-3 rounded mb-4 text-center">
        {editingTransaction ? "Update Transaction Form" : "Transaction Entry Form"}
      </h4>
      <Form.Item
        name="amount"
        label="Transaction Amount"
        rules={[{ required: true, message: 'Please input the amount!' }]}
      >
        <Input type="number" />
      </Form.Item>

      <Form.Item
        name="category"
        label="Expense Category"
        rules={[{ required: true, message: 'Please select a category!' }]}
      >
        <Select placeholder="Select a category" onChange={handleCategoryChange}>
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      </Form.Item>

      {isOtherCategory && (
        <Form.Item
          name="custom_category"
          label="Specify Other Category"
          rules={[{ required: true, message: 'Please specify the custom category!' }]}
        >
          <Input placeholder="Enter custom category" />
        </Form.Item>
      )}

      <Form.Item
        name="description"
        label="Transaction Description"
        rules={[{ required: true, message: 'Please specify the Description!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="is_income"
        valuePropName="checked"
        label="Is Income?"
      >
        <Checkbox />
      </Form.Item>

      <Form.Item
        name="date"
        label="Transaction Date"
        rules={[{ required: true, message: 'Please select the date!' }]}
      >
        <DatePicker format='YYYY-MM-DD' />
      </Form.Item>

      <Form.Item>
        {editingTransaction ? (
          <>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
            <Button type="default" onClick={handleCancelEdit} style={{ marginLeft: '8px' }}>
              Cancel
            </Button>
          </>
        ) : (
          <Button type="primary" htmlType="submit" style={{ marginLeft: '8px' }}>
            Submit
          </Button>
        )}

      </Form.Item>
    </Form>
  );
};

export default TransactionForm;
