import React, { useState, useEffect, useMemo } from 'react';
import { Table, Button, Select, Modal, Form, notification, Empty } from 'antd';
import { getAllUsers, updateUserRole, deleteUser, getUserWithTransactions } from '../api';
import { DeleteOutlined, SwapOutlined, SearchOutlined } from '@ant-design/icons';
import SearchPopover from './SearchPopover';

const { Option } = Select;

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm(); 
  const [searchText, setSearchText] = useState(''); 
  const [selectedRole, setSelectedRole] = useState(null);
  const [popoverVisible, setPopoverVisible] = useState({
    username: false,
    role: false,
  });
  const [searchApplied, setSearchApplied] = useState({
    username: false,
    role: false,
  });
  const [userTransactions, setUserTransactions] = useState([]);
  const [transactionsModalVisible, setTransactionsModalVisible] = useState(false);
  
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await getAllUsers();
        const filteredUsers = usersData
          .filter(user => user.id !== parseInt(currentUserId, 10))
          .filter(user => user.username.includes(searchText)) 
          .filter(user => selectedRole ? user.role === selectedRole : true); 
        setUsers(filteredUsers);
      } catch (error) {
        console.error('Failed to fetch users', error);
      }
    };

    fetchUsers();
  }, [searchText, selectedRole, currentUserId]);

  const showModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields(); 
      if (selectedUser) {
        await updateUserRole(selectedUser.id, values.role); 
        
        setUsers(users.map(user =>
          user.id === selectedUser.id ? { ...user, role: values.role } : user
        ));
        setIsModalVisible(false); 
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const handleCancel = () => setIsModalVisible(false);

  const handleDelete = (userId) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this account?',
      content: 'This action cannot be undone. All user related  data will be permanently removed.',
      okText: 'Yes, delete it',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk: () => handleConfirmDelete(userId),
      onCancel: () => {
        console.log('Deletion cancelled');
      },
    });
  };

  const handleConfirmDelete = async (userId) => {
    try {
        await deleteUser(userId); 
        notification.success({
            message: 'Account Deleted',
            description: 'Your account and transactions have been deleted.',
        });
        setUsers(users.filter(user => user.id !== userId));
        setUsers(prevUsers => prevUsers.filter(user => user.id !== parseInt(currentUserId, 10)));
        setIsModalVisible(false);
    } catch (error) {
        notification.error({
            message: 'Deletion Failed',
            description: 'There was an error deleting your account. Please try again.',
        });
    }
  };

  const handleSearchUsername = (text) => {
    setSearchText(text);
    setSearchApplied(prev => ({ ...prev, username: !!text }));
  };

  const handleSearchRole = (role) => {
    setSelectedRole(role);
    setSearchApplied(prev => ({ ...prev, role: !!role }));
  };

  const handleReset = () => {
    setSearchText('');
    setSelectedRole(null);
    setSearchApplied({ username: false, role: false });
  };

  const handleShowTransactions = async (userId) => {
    try {
      const user = await getUserWithTransactions(userId);
      setUserTransactions(user.transactions);
      setTransactionsModalVisible(true);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to fetch transactions.',
      });
    }
  };
  
  const columns =useMemo(()=> [
    { 
        title: (
            <div className="d-flex justify-content-between align-items-center">
              Username
              <SearchPopover
                type="username"
                onSearch={handleSearchUsername}
                onReset={handleReset}
                placeholder="Search username"
                visible={popoverVisible.username}
                onVisibleChange={(visible) => setPopoverVisible(prev => ({ ...prev, username: visible }))}
                searchApplied={searchApplied.username}
                prefixIcon={<SearchOutlined />}
              />
            </div>
          ),
          dataIndex: 'username',
          key: 'username',

    },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: (
        <div className="d-flex justify-content-between align-items-center">
          Role
          <SearchPopover
            type="role"
            onSearch={handleSearchRole}
            onReset={handleReset}
            placeholder="Filter role"
            visible={popoverVisible.role}
            onVisibleChange={(visible) => setPopoverVisible(prev => ({ ...prev, role: visible }))}
            searchApplied={searchApplied.role}
            prefixIcon={<SearchOutlined />}
          />
        </div>
      ),
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (text, record) => (
        <div>
          <Button icon={<SwapOutlined />} onClick={() => showModal(record)}>
            Role
          </Button>
          <Button
            style={{ marginLeft: '8px' }}
            onClick={() => handleShowTransactions(record.id)}            
          >
            Transactions
          </Button>
          <Button 
            type="text" 
            icon={<DeleteOutlined />} 
            onClick={() => handleDelete(record.id)} 
            style={{ marginLeft: '8px' }}
          />
        </div>
      ),
    },
  ],[users, popoverVisible, searchApplied]);
  
  const transactionColumns = [
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Date', dataIndex: 'date', key: 'date' },
  ];


  return (
    <div>
        <Table 
            dataSource={users} 
            columns={columns} 
            rowKey="id" 
            pagination={{ pageSize: 7 }}
            bordered
            className="table table-bordered"
            locale={{ emptyText: <Empty description="No Data" /> }}
        />
        <Modal
            title="Change User Role"
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
        >
            <Form
            form={form} 
            initialValues={{ role: selectedUser?.role }} 
            >
            <Form.Item
                label="Role"
                name="role" 
                rules={[{ required: true, message: 'Please select a role!' }]}
            >
                <Select>
                <Option value="admin">Admin</Option>
                <Option value="user">User</Option>
                </Select>
            </Form.Item>
            </Form>
        </Modal>
        <Modal
          title={`Transactions for ${selectedUser?.username}`}
          visible={transactionsModalVisible}
          onCancel={() => setTransactionsModalVisible(false)}
          footer={null}
        >
          <Table
            dataSource={userTransactions}
            columns={transactionColumns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
            bordered
            className="table table-bordered"
            locale={{ emptyText: <Empty description="No Transactions" /> }}
          />
        </Modal>
    </div>
  );
};

export default AdminPanel;