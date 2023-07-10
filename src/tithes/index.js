import React, { useState } from 'react';
import { Container, Form, Button, Table } from 'react-bootstrap';

import { ReactComponent as Image } from '../assets/working.svg';
import './style.scss';

const TithesPage = () => {
  const [date, setDate] = useState('');
  const [memberName, setMemberName] = useState('');
  const [amount, setAmount] = useState('');
  const [tithes, setTithes] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new tithe object
    const newTithe = {
      date,
      memberName,
      amount
    };

    // Add the new tithe to the tithes array
    setTithes([...tithes, newTithe]);

    // Reset the form fields after submission
    setDate('');
    setMemberName('');
    setAmount('');
  };

  return(
    <div className=''>
    <div>
      <h1 className="text-center">Under Construction</h1>
      <p className="text-center">We're sorry, but this page is currently under construction. Please check back later for updates.</p>
    </div>    
    <div className="image-container">
      <Image className="image" />
    </div>
      
    </div>
  )

  return (
    <div className="tithes-page-container animate__animated animate__fadeIn">
      <h1 className="text-center mb-4">Member Tithes</h1>
      <Form className="tithes-form" onSubmit={handleSubmit}>
        <Form.Group controlId="date">
          <Form.Label>Date:</Form.Label>
          <Form.Control
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="memberName">
          <Form.Label>Member Name:</Form.Label>
          <Form.Control
            type="text"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="amount">
          <Form.Label>Amount:</Form.Label>
          <Form.Control
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </Form.Group>

        <div className="text-center">
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </div>
      </Form>

      {/* Additional useful information for the admin */}
      <div className="tithes-info mt-5">
        <h2 className="text-center mb-4">Recent Tithes</h2>
        <Table className="tithes-table" striped bordered hover responsive>
          <thead>
            <tr>
              <th>Date</th>
              <th>Member Name</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {tithes.map((tithe, index) => (
              <tr key={index}>
                <td>{tithe.date}</td>
                <td>{tithe.memberName}</td>
                <td>{tithe.amount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <div className="tithes-info mt-5">
        <h2 className="text-center mb-4">Summary</h2>
        {/* Display summary information, such as total tithes collected */}
      </div>
    </div>
  );
};

export default TithesPage;
