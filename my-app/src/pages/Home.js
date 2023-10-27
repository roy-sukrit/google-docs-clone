import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { PlusOutlined, FileTextOutlined,
  EditOutlined, DeleteOutlined  } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col } from 'antd';

import axios from 'axios'
const Home = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate()
  const [data, setData] = useState([]);
  const [id, setId] = useState();

  useEffect(() => {
    //Fetching Latest Documents
   
    fetchData();
  }, [id,data]);


  async function fetchData() {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/documents`,{})
      .catch(error => console.error('Error fetching data:', error));
    if (response && response.data) {

      setData(response.data)

    }

  }
  //Redirecting User to /documents where a new uuid is page is created
  const handleOk = () => {
    navigate("/document", {
    });
    form.resetFields();
  };

  //Opens an existing documents
  const openDocument = (id) => {
    console.log("id", id);
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
 if(data === 'Success'){
  await fetchData()
 }

}

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1>Your Documents</h1>
      </div>
      <Row gutter={[20, 20]}>
      <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card
            style={{ width: '100%' ,height:'100%' }}
            onClick={handleOk}
            hoverable
          >
            <PlusOutlined style={{ fontSize: '48px' }} />

            <div style={{ textAlign: 'center', fontSize: '18px' }}>
              Create Document
            </div>
            <br/>
            <br/>

          </Card>
        </Col>
        {'Add null check'}
        {data.map((document, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6} xl={4}>
            <Card
              style={{ width: '100%',height:'100%' }}
              hoverable
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

export default Home
