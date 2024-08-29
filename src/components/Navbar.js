import React from 'react';
import { UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './Profile';
import './styles.css';

const Navbar = ({ authenticated, setAuthenticated, setIsSignUpDisabled }) => {
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const navigate = useNavigate();

  const handleProfileClick = () => setIsModalVisible(true);

  const handleSignOut = () => {
    localStorage.clear();
    setIsModalVisible(false);
    setAuthenticated(false);
    navigate('/');
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

      <ProfileModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSignOut={handleSignOut}
        setAuthenticated={setAuthenticated}
        setIsSignUpDisabled={setIsSignUpDisabled}
      />
    </>
  );
};

export default Navbar;
