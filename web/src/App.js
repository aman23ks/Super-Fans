import logo from './logo.svg';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import Username from './Components/LoginSignup/Username';
import Register from './Components/LoginSignup/Register';
import Reset from './Components/LoginSignup/Reset';
import Recovery from './Components/LoginSignup/Recovery';
import Profile from './Components/LoginSignup/Profile';
import Password from './Components/LoginSignup/Password';
import PageNotFound from './Components/LoginSignup/PageNotFound';


/** root routes */
const router = createBrowserRouter([
  {
    path : '/',
    element : <Username></Username> 
  },
  {
    path : '/register',
    element : <Register></Register> 
  },
  {
    path : '/reset',
    element : <Reset></Reset>
  },
  {
    path : '/recovery',
    element : <Recovery></Recovery>
  },
  {
    path : '/profile',
    element : <Profile></Profile>
  },
  {
    path : '/password',
    element : <Password></Password>
  },
  {
    path : '/pageNotFound',
    element : <PageNotFound></PageNotFound>
  }
])

function App() {
  return (
    <main>
      <RouterProvider router={router}></RouterProvider>
    </main>
    
  );
}

export default App;
