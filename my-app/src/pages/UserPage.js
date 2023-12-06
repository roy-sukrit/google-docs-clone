import React, { useEffect, useState } from 'react';
import { Form, Space } from 'antd';
import { PlusOutlined, FileTextOutlined,
  EditOutlined, DeleteOutlined  } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col,message} from 'antd';
import { v4 as uuidV4 } from "uuid"

import axios from 'axios'
import { useSelector } from 'react-redux';
const UserPage = ({props}) => {

  console.log("props",props);
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [id, setId] = useState();
  const [users, setUser] = useState();

    //^Redirect if auth

    const { user } = useSelector((state) => ({ ...state }));
    // setUser(user)

    console.log("user ============>",user);

  const [messageApi, contextHolder] = message.useMessage();

  const [loadApi, contextHolderLoad] = message.useMessage();

  const key = 'updatable';

  const openMessage = async (operation) => {


    console.log("operation",operation);
    if(operation && operation === 'LOAD'){
    loadApi.open({
      key,
      type: 'loading',
      content: 'Loading...',
    });
  }

    if(operation && operation === 'LOADED'){
      console.log("operation in if",operation);

      loadApi.open({
        key,
        type: 'success',
        content: 'Documents Loaded!',
        duration: 2,
      });
    }
  }
  

  const success = () => {

    messageApi.open({
      type: 'success',
      content: 'Delete Succesful!',
    });
  };

  const error = () => {
    messageApi.open({
      type: 'error',
      content: 'Erro occured while deleteing',
    });
  };

  useEffect(() => {
    // const { user } = useSelector((state) => ({ ...state }));

    //Fetching Latest Documents
    fetchData('LOAD');
  }, [user]);


  
  async function fetchData(operation) {

    if(user){
    openMessage(operation)

    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/userDocuments`,{email:user.email})
      .catch(error => console.error('Error fetching data:', error));

      console.log("response",response);
    if (response && response.data) {

      setData(response.data)
      await openMessage('LOADED')

    
    }
  }


  }
  //Redirecting User to /documents where a new uuid is page is created
  const handleOk = (data) => {
    console.log("Called handleOk",data);
    //Added explicit uuid to prevent error 
    const generatedUuid = uuidV4();

    navigate(`/documents/${generatedUuid}`);

    // form.resetFields();
  };

  //Opens an existing documents
  const openDocument = (id) => {
    console.log("id", id);
    console.log("Called openDocument");
    navigate(`/documents/${id}`, {
    });

  };

  //Function to convert TZ to date format
  const formatDate = (data) => {
    const isoDateString = data;
    const formattedDate = new Date(isoDateString).toLocaleString('en-US', { dateStyle: 'short', timeStyle: 'short' });
    return formattedDate;
  }

const handleDelete =async (id) =>{
  console.log("id to delete",id);

 const data =  await axios.post(`${process.env.REACT_APP_API_URL}/api/delete`,{id})

 console.log("data",data);
 if(data?.data === 'Success'){
  success();

  await fetchData('DELETE')

 }
 else{
  error()
 }

}


  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1  style={{ fontFamily: "Verdana, Geneva, sans-serif" }}>Hello {user? user.name : 'Loading...'} 😊: Your Documents</h1>
      </div>
      <Row gutter={[20, 20]} >
      <Col key={'create'} xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card
            style={{ width: '100%' ,height:'100%' }}
            onClick={handleOk}
            hoverable
            key={'create'}
          >
            <PlusOutlined style={{ fontSize: '48px' }} />

            <div style={{ textAlign: 'center', fontSize: '18px',fontFamily: "Verdana, Geneva, sans-serif"  }}>
              Create Document
            </div>
            <br/>
            <br/>

          </Card>
        </Col>

         <Space key={'Space1'}>{contextHolderLoad}</Space>
        <Space key={'Space2'}>{contextHolder}</Space>  

        {data && data.map((document, index) => (
          <Col key={document._id} xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card
              style={{ width: '100%',height:'100%' }}
              hoverable
              key={document._id}
              actions={[
                <DeleteOutlined 
                onMouseEnter={(e) => (e.currentTarget.style.color = 'red')} // Change color to red on hover
                onMouseLeave={(e) => (e.currentTarget.style.color = '')} // Revert to the default color
                onClick={()=>handleDelete(document._id)} key="setting" />
               
              ]}
            >
              <Card.Meta
                avatar={<FileTextOutlined style={{ fontSize: '48px', color: '#1890ff' }} />}
                title={document._id}
                description={`Last modified: ${formatDate(document.updatedAt)}`}
                style={{ width: '100%',height:'100%' }}

                onClick={() => openDocument(document._id)}

              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

};

export default UserPage;
