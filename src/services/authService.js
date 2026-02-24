import axios from 'axios';

export const loginUser = async (username, password) => {
  const response = await axios.post(
    'http://127.0.0.1:8000/api/auth/login/',
    {
      username,
      password,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data;
};
