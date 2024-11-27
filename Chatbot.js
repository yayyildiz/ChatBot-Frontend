import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import ChatInput from './ChatInput';
import Sidebar from './Sidebar';
import axios from 'axios';

// Style definitions
const Container = styled.div`
  width: 100%;
  height: 100vh;
`;

const ChatbotContainer = styled.div`
  width: auto;
  height: 100vh;
  flex-direction: row;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ChatContainer = styled.div`
  flex: 1;
  flex-direction: column;
`;

const ChatLog = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  height: 80vh;
  border-bottom: 1px solid #ddd;
  background: #ccc;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Message = styled.div`
  margin-bottom: 15px;
  padding: 15px;
  background-color: ${props => (props.isUser ? '#DCF8C6' : '#f1f1f1')};
  align-self: ${props => (props.isUser ? 'flex-end' : 'flex-start')};
  border-radius: ${props => (props.isUser ? '20px 0 20px 0' : '0 20px 0 20px')};
  max-width: 90%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DataTable = ({ data }) => {
  if (!data || data.length === 0) return <div>No data available.</div>;

  const columns = Object.keys(data[0]);

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0', background: 'white' }}>
      <thead>
        <tr>
          {columns.map((column, index) => (
            <th key={index} style={{ border: '1px solid #ccc', padding: '4px 6px', textAlign: 'left' }}>
              {column}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={rowIndex}>
            {columns.map((column, colIndex) => {
              const value = item[column];
              return (
                <td key={colIndex} style={{ border: '1px solid #ccc', padding: '4px 6px', textAlign: 'left' }}>
                  {typeof value === 'number' ? value.toLocaleString() : value}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Fetch watch data from AI service
const fetchWatchData = async (text) => {
  try {
    const response = await axios.post(
      'XXXXXXXXX',
      { question: text },
      { timeout: 90000 }
    );

    if (response.status === 200) {
      return { data: response.data, status: response.status };
    }

    console.error('Failed to fetch watch data:', response.status);
    return { data: null, status: response.status };
  } catch (error) {
    const statusCode = error.response?.status || 500;
    console.error('Failed to fetch watch data:', error.message);
    return { data: null, status: statusCode };
  }
};

const Chatbot = ({ username }) => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [watchData, setWatchData] = useState(null);
  const chatLogRef = useRef(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (message) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, isUser: true }]);

    const { data, status } = await fetchWatchData(message);

    try {
      const parsedData = typeof data === 'string' ? JSON.parse(data) : data;

      if (Array.isArray(parsedData) && parsedData.length > 0) {
        setWatchData(parsedData);
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: '', isUser: false, tableData: parsedData },
        ]);
      } else {
        throw new Error('Unexpected data format received.');
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `Data not found for ${message}.`, isUser: false },
      ]);
    }

    setInputValue('');
  };

  return (
    <Container>
      <ChatbotContainer>
        <ChatContainer>
          <ChatLog ref={chatLogRef}>
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                {!message.tableData && (
                  <Message isUser={message.isUser}>
                    {message.text}
                  </Message>
                )}
                {message.tableData && <DataTable data={message.tableData} />}
              </React.Fragment>
            ))}
          </ChatLog>
          <ChatInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onSend={() => handleSendMessage(inputValue)}
          />
        </ChatContainer>
      </ChatbotContainer>
    </Container>
  );
};

export default Chatbot;



