import React, { useState } from "react";
import { Input, Menu ,Progress,Switch} from "antd";
// import firebase from 'firebase'

import firebase from 'firebase/compat/app'
import {useDispatch,useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'
import {
  AppstoreOutlined,
  SettingOutlined,
  UserOutlined,
  UserAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { SubMenu, Item } = Menu;



const Header = () => {
  const [current, setCurrent] = useState("home");
  const [theme, setTheme] = useState("dark")
  let dispatch=useDispatch();
  let history=useNavigate();
  let {user}=useSelector((state)=>({...state}));

  const handleClick = (e) => {
    // console.log(e.key);
    setCurrent(e.key);
  };

  const logout=()=>{
    firebase.auth().signOut();
    dispatch({
      type:"LOGOUT",
      payload:null

    })
    history.push("/login")
  }


  const handlethemeChange = (value) => {
     value ? setTheme('dark') : setTheme('light')

  }

  return (
    <Menu  theme ={theme} onClick={handleClick} selectedKeys={[current]} mode="horizontal">
    
    
      <Item key="home" icon={<AppstoreOutlined />}>
        <Link to="/">Home</Link>
      </Item>

        


      {!user && 
      <Item key="register" icon={<UserAddOutlined />} className="float-right">
        <Link to="/register">Register</Link>
      </Item>
      }
     

      {!user &&

      <Item key="login" icon={<UserOutlined />}  className="float-right">
        <Link to="/login">Login</Link>
      </Item>
      }





      {user &&
      <SubMenu icon={<SettingOutlined />} title={user.email && user.email.split('@')[0]} className="float-right">
       
        {user && (
           <Item key="setting:1">
           <Link to="user/history">Dashboard</Link>
           </Item>
        )}

       
        <Item icon={<LogoutOutlined />} onClick={logout} disabled>Logout</Item>

      </SubMenu>
      }


      <span className="float-right mr-3">
      <Switch
      checked={theme === 'dark'}
      onChange={handlethemeChange}
      checkedChildren="Dark"
      unCheckedChildren="Light"
    /></span>
   
    
    </Menu>

    
  );
};

export default Header;
