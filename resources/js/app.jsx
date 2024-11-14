import React from 'react';
import { createRoot } from 'react-dom/client';
import EmployeeList from './components/employees/EmployeeList';
import EmployeeDetails from './components/employees/EmployeeDetails';
import EmployeeForm from './components/employees/EmployeeForm';
import RequestList from './components/requests/RequestList';
import TrainingList from './components/trainings/TrainingList';
import PaymentRequestList from './components/payment/PaymentRequestList';
import PaymentOrderList from './components/orderpayment/paymentOrderList';
import EngagementList from './components/engagement/EngagementList';
import './bootstrap';
import '../css/app.css';
// Montre le composant EmployeeList
if (document.getElementById('employee-list')) {
  const root = createRoot(document.getElementById('employee-list'));
  root.render(<EmployeeList />);

}


// Montre le composant RequestList dans la div 'request-list'
if (document.getElementById('request-list')) {
  const root = createRoot(document.getElementById('request-list'));
  root.render(<RequestList />);
}

// Montre le composant TrainingList dans la div 'training-list'
if (document.getElementById('training-list')) {
  const root = createRoot(document.getElementById('training-list'));
  root.render(<TrainingList />);
}

// Montre le composant PaymentRequestList dans la div 'payment-request-list'
if (document.getElementById('payment-request-list')) {
  const root = createRoot(document.getElementById('payment-request-list'));
  root.render(<PaymentRequestList />);
}


// Montre le composant PaymentRequestList dans la div 'payment-order-list'
if (document.getElementById('payment-order-list')) {
  const root = createRoot(document.getElementById('payment-order-list'));
  root.render(<PaymentOrderList />);
}

if (document.getElementById('engagement-list')) {
  const root = createRoot(document.getElementById('engagement-list'));
  root.render(<EngagementList />);
}
