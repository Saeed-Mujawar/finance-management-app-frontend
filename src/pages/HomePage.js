import React, { useState, useEffect } from 'react';
import TransactionForm from '../components/TransactionForm';
import TransactionTable from '../components/TransactionTable';
import SignUpForm from '../components/SignUpForm';
import SignInForm from '../components/SignInForm';
import AdminPanel from '../components/AdminPanel';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../api';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [authenticated, setAuthenticated] = useState(() => !!localStorage.getItem('authenticated')); 
  const [isSignUpDisabled, setIsSignUpDisabled] = useState(false); 
  const [userRole, setUserRole] = useState(() => localStorage.getItem('role'));

  const fetchTransactions = async () => {
    try {
      const response = await getTransactions();
      setTransactions(response);
    } catch (error) {
      console.error('Failed to fetch transactions', error);
    }
  };

  useEffect(() => {
    if (authenticated) {
      fetchTransactions();
      fetchUserRole();
    }
  }, [authenticated]);

  const fetchUserRole = async () => {
    try {
      const role = localStorage.getItem('role'); 
      setUserRole(role);
    } catch (error) {
      console.error('Failed to fetch user role', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTransaction(id);
      fetchTransactions();
    } catch (error) {
      console.error('Failed to delete transaction', error);
    }
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleCancelEdit = () => {
    setEditingTransaction(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, formData);
        setEditingTransaction(null);
      } else {
        await createTransaction(formData);
      }
      fetchTransactions();
    } catch (error) {
      console.error('Failed to submit form', error);
    }
  };

  const handleSignUpSuccess = () => {
    setIsSignUpDisabled(true); 
  };

  const handleSignInSuccess = () => {
    setAuthenticated(true); 
    localStorage.setItem('authenticated', 'true');

  };

  return (
    <div>
      <Navbar authenticated={authenticated} setAuthenticated={setAuthenticated} setIsSignUpDisabled={setIsSignUpDisabled}/>
      <div className='container d-flex flex-column align-items-center'>
        {!authenticated ? (
          <div className='row w-100 justify-content-center p-3'>
            <div className='col-md-5 d-flex justify-content-center mb-4'>
              <div
                className='border p-4 rounded shadow bg-white'
                style={{ width: '100%', opacity: isSignUpDisabled ? 0.5 : 1, pointerEvents: isSignUpDisabled ? 'none' : 'auto' }}
              >
                <SignUpForm onSuccess={handleSignUpSuccess} disabled={isSignUpDisabled} />
              </div>
            </div>

            <div className='col-md-5 d-flex justify-content-center mb-4'>
              <div className='border p-4 rounded shadow bg-white' style={{ width: '100%' }}>
                <SignInForm onSuccess={handleSignInSuccess} />
              </div>
            </div>
          </div>
        ) : (
<>
  <div className="container mt-4">
    <div className="row">
      {userRole === 'admin' && ( 
        <div className="col-md-8">
          <div className="border p-4 rounded shadow bg-white">
            <AdminPanel />
          </div>
        </div>
      )}
      <div className={userRole === 'admin' ? 'col-md-4' : 'col-12'}>
        <div className="border p-4 rounded shadow bg-white">
          <TransactionForm
            fetchTransactions={fetchTransactions}
            editingTransaction={editingTransaction}
            handleFormSubmit={handleFormSubmit}
            handleCancelEdit={handleCancelEdit}
          />
        </div>
      </div>
    </div>
    <div className="border p-4 rounded shadow mb-4 bg-white mt-4">
      <TransactionTable
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  </div>
</>

        )}
      </div>
    </div>
  );
};

export default HomePage;
