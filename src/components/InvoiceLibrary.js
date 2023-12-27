import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Assetes/Styles/InvoiceLibrary.css';

const InvoiceLibrary = () => {
  const [invoices, setInvoices] = useState([]);
  const [filter, setFilter] = useState('');
  const [clientNumbers, setClientNumbers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/invoiceData');

        const uniqueClientNumbers = Array.from(new Set(response.data.map(item => item.client_number)));
        setClientNumbers(uniqueClientNumbers);

        setInvoices(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleClientNumberChange = (e) => {
    setFilter(e.target.value);
  };

  const handleDownload = async (filename) => {
    try {
      const iframe = document.createElement('iframe');
      iframe.setAttribute('style', 'display:none');
      document.body.appendChild(iframe);
      filename = filename.split('\\').pop();
      iframe.src = `http://localhost:3001/download/${filename}`;
    } catch (error) {
      console.error('Erro ao baixar o arquivo :', error);
    }
  };

  const handleGoBack = () => {
    navigate('/');
  };

  const filteredInvoices = invoices.filter(item =>
    filter === '' || item.client_number.toString() === filter
  );
 
  return (
    <div className="container">
      <h1>Invoice Library</h1>
      <label>
        Filtre as faturas pelo numero do cliente desejado:
        <select value={filter} onChange={handleClientNumberChange}>
          <option value="">Numero dos Clientes</option>
          {clientNumbers.map(clientNumber => (
            <option key={clientNumber} value={clientNumber}>
              {clientNumber}
            </option>
          ))}
        </select>
      </label>
      <button onClick={handleGoBack}>Lumi PDF Scrapper</button>
      <ul>
        {filteredInvoices.map((invoice) => (
          <li key={invoice.file_name}>
            <span>{invoice.file_name.split('\\').pop()}</span>
            <button onClick={() => handleDownload(invoice.file_name)} value={invoice.file_name}>
              Download
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvoiceLibrary;
