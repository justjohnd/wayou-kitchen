import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const PrivateScreen = () => {
  const [error, setError] = useState('');
  const [privateData, setPrivateData] = useState('');

  let navigate = useNavigate();

  useEffect(() => {
    const fetchPrivateDate = async () => {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      };

      try {
        const { data } = await axios.get('/api/private', config);
        console.log(data);
        setPrivateData(data.data);
      } catch (error) {
        localStorage.removeItem('authToken');
        setError('You are not authorized please login');
      }
    };

    fetchPrivateDate();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate("/login");
  }

  return error ? (
    <span className="error-message">{error}</span>
  ) : (
    <div>
      {privateData}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default PrivateScreen;
