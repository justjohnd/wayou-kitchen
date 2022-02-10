import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const PrivateScreen = (props) => {
  const [error, setError] = useState('');
  const [data, setData] = useState('data');

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
        setData(data.data);
        props.idCallback(data.id);
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
      {data}
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default PrivateScreen;
