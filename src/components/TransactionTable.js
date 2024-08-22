import React, { useState, useMemo, useEffect } from 'react';
import { Table, Empty, Button } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import SearchPopover from './SearchPopover';

const TransactionTable = ({ transactions, onEdit, onDelete }) => {
  const [filteredData, setFilteredData] = useState(transactions);

  const [popoverVisible, setPopoverVisible] = useState({
    amount: false,
    category: false,
    is_income: false,
    date: false,
  });

  const [searchApplied, setSearchApplied] = useState({
    amount: false,
    category: false,
    is_income: false,
    date: false,
  });

  useEffect(() => {
    setFilteredData(transactions);
  }, [transactions]);

  const handleSearchAmount = (value) => {
    const filtered = transactions.filter(transaction =>
      transaction.amount.toString().toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered.sort((a, b) => a.amount - b.amount));
    setSearchApplied(prev => ({ ...prev, amount: true }));
  };

  const handleSearchCategory = (value) => {
    const filtered = transactions
      .filter(transaction => transaction.category.toLowerCase().includes(value.toLowerCase()))
      .sort((a, b) => a.category.localeCompare(b.category));
    setFilteredData(filtered);
    setSearchApplied(prev => ({ ...prev, category: true }));
  };

  const handleSearchIsIncome = (value) => {
    setFilteredData(transactions.filter(transaction => transaction.is_income === value));
    setSearchApplied(prev => ({ ...prev, is_income: true }));
  };

  const handleSearchDate = (value) => {
    setFilteredData(transactions.filter(transaction => transaction.date === value));
    setSearchApplied(prev => ({ ...prev, date: true }));
  };

  const handleReset = () => {
    setFilteredData(transactions);
    setSearchApplied({
      amount: false,
      category: false,
      is_income: false,
      date: false,
    });
  };

  const columns = useMemo(() => [
    {
      title: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Transaction Amount
          <SearchPopover
            type="amount"
            onSearch={handleSearchAmount}
            onReset={handleReset}
            placeholder="Search amount"
            visible={popoverVisible.amount}
            onVisibleChange={(visible) => setPopoverVisible(prev => ({ ...prev, amount: visible }))}
            searchApplied={searchApplied.amount}
          />
        </div>
      ),
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Expense Category
          <SearchPopover
            type="category"
            onSearch={handleSearchCategory}
            onReset={handleReset}
            placeholder="Search category"
            visible={popoverVisible.category}
            onVisibleChange={(visible) => setPopoverVisible(prev => ({ ...prev, category: visible }))}
            searchApplied={searchApplied.category}
          />
        </div>
      ),
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: (
        <div>
          Transaction Description
        </div>
      ),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Is Income?
          <SearchPopover
            type="is_income"
            onSearch={handleSearchIsIncome}
            onReset={handleReset}
            placeholder="Filter income"
            visible={popoverVisible.is_income}
            onVisibleChange={(visible) => setPopoverVisible(prev => ({ ...prev, is_income: visible }))}
            searchApplied={searchApplied.is_income}
          />
        </div>
      ),
      dataIndex: 'is_income',
      key: 'is_income',
      render: (text) => (text ? 'Yes' : 'No'),
    },
    {
      title: (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Transaction Date
          <SearchPopover
            type="date"
            onSearch={handleSearchDate}
            onReset={handleReset}
            placeholder="Search date"
            visible={popoverVisible.date}
            onVisibleChange={(visible) => setPopoverVisible(prev => ({ ...prev, date: visible }))}
            searchApplied={searchApplied.date}
          />
        </div>
      ),
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Manage',
      key: 'manage',
      render: (_, record) => (
        <div>
          <Button
            type="text"            
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            aria-label="Edit"
          />
          <Button
            type="text"
            
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
            aria-label="Delete"
            style={{ marginLeft: 8 }}
          />
        </div>
      ),
    },
  ], [transactions, popoverVisible, searchApplied]);

  return (
    <Table
      columns={columns}
      dataSource={filteredData}
      rowKey="id"
      pagination={{ pageSize: 7 }}
      bordered
      className="table table-bordered"
      locale={{ emptyText: <Empty description="No Data" /> }}
    />
  );
};

export default TransactionTable;
