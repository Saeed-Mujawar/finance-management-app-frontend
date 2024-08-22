import React, { useState } from 'react';
import { Input, Button, Popover, Radio, Space, DatePicker } from 'antd';
import { SearchOutlined } from '@ant-design/icons';

const SearchPopover = ({ type, onSearch, onReset, placeholder, visible, onVisibleChange, searchApplied }) => {
  const [searchText, setSearchText] = useState('');
  const [isIncome, setIsIncome] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRole, setSelectedRole] = useState(null);

  const handleSearch = () => {
    if (type === 'amount' || type === 'category' || type === 'username') {
      onSearch(searchText);
    } else if (type === 'is_income') {
      onSearch(isIncome);
    } else if (type === 'date') {
      onSearch(selectedDate ? selectedDate.format('YYYY-MM-DD') : '');
    } else if (type === 'role') {
      onSearch(selectedRole);
    }
    onVisibleChange(false); 
  };

  const handleReset = () => {
    setSearchText('');
    setIsIncome(null);
    setSelectedDate(null);
    setSelectedRole(null);
    onReset();
    onVisibleChange(false); 
  };

  const handleIncomeChange = (e) => {
    setIsIncome(e.target.value);
    onSearch(e.target.value);
    onVisibleChange(false); 
  };
  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
    onSearch(e.target.value);
    onVisibleChange(false); 
  };

  return (
    <Popover
      content={
        <div>
          {type === 'amount' && (
            <>
              <Input
                placeholder={placeholder}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
              />
              <Button onClick={handleSearch} type="primary" style={{ marginTop: 8 }}>
                Search
              </Button>
              <Button onClick={handleReset} type="link" style={{ marginTop: 8 }}>
                Reset
              </Button>
            </>
          )}
          {type === 'category' && (
            <>
              <Input
                placeholder={placeholder}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
              />
              <Button onClick={handleSearch} type="primary" style={{ marginTop: 8 }}>
                Search
              </Button>
              <Button onClick={handleReset} type="link" style={{ marginTop: 8 }}>
                Reset
              </Button>
            </>
          )}
          {type === 'username' && (
            <>
              <Input
                placeholder="Search by username"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                onPressEnter={handleSearch}
              />
              <Button onClick={handleSearch} type="primary" style={{ marginTop: 8 }}>
                Search
              </Button>
              <Button onClick={handleReset} type="link" style={{ marginTop: 8 }}>
                Reset
              </Button>
            </>
          )}
          {type === 'is_income' && (
            <Space direction="vertical">
              <Radio.Group onChange={handleIncomeChange} value={isIncome}>
                <Radio value={true}>Income</Radio>
                <Radio value={false}>Expense</Radio>
              </Radio.Group>
              <Button onClick={handleReset} type="link" style={{ marginTop: 8 }}>
                Reset
              </Button>
            </Space>
          )}
          {type === 'date' && (
            <>
              <DatePicker
                format='YYYY-MM-DD'
                value={selectedDate}
                onChange={date => setSelectedDate(date)}
                style={{ width: '100%' }}
              />
              <Button onClick={handleSearch} type="primary" style={{ marginTop: 8 }}>
                Search
              </Button>
              <Button onClick={handleReset} type="link" style={{ marginTop: 8 }}>
                Reset
              </Button>
            </>
          )}
          {type === 'role' && (
            <Space direction="vertical">
              <Radio.Group onChange={handleRoleChange} value={selectedRole}>
                <Radio value="admin">Admin</Radio>
                <Radio value="user">User</Radio>
              </Radio.Group>
              <Button onClick={handleReset} type="link" style={{ marginTop: 8 }}>
                Reset
              </Button>
            </Space>
          )}
        </div>
      }
      title="Search"
      trigger="click"
      visible={visible}
      onVisibleChange={onVisibleChange}
    >
      <SearchOutlined style={{ marginLeft: 8, cursor: 'pointer', color: searchApplied ? '#1890ff' : 'black' }} />
    </Popover>
  );
};

export default SearchPopover;
