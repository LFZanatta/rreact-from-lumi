import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Chart from 'react-apexcharts';
import { Link, useNavigate } from 'react-router-dom';
import '../Assetes/Styles/Dashboard.css'

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [invoiceData, setInvoiceData] = useState([]);
  const [filter, setFilter] = useState('');
  const [clientNumbers, setClientNumbers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/api/invoiceData');

        const uniqueClientNumbers = Array.from(new Set(response.data.map(item => item.client_number)));
        setClientNumbers(uniqueClientNumbers);

        setInvoiceData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados :', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClientNumberChange = (e) => {
    setFilter(e.target.value);
  };

  const handleGoToInvoiceLibrary = () => {
    navigate(`/invoice-library?filter=${filter}`);
  };

  const filteredData = invoiceData.filter(item =>
    filter === '' || item.client_number.toString() === filter
  );

  const options = {
    xaxis: {
      categories: filteredData.map(item => item.month_ref),
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '14px',
      fontFamily: 'Helvetica, Arial',
      fontWeight: 400,
      offsetY: 30, 
    },
  };

  const series = [
    {
      name: 'Consumo de Energia Elétrica em kWh',
      data: filteredData.map(item => {
        let electricity_quantity = parseFloat(item.electricity_quantity);
        let sceee_quantity = parseFloat(item.sceee_quantity);

        let electricity_consumption = electricity_quantity + sceee_quantity;

        return electricity_consumption;
      }),
    },
    {
      name: 'Energia Compensada em kWh',
      data: filteredData.map(item => item.comp_gd_i_quantity),
    },
    {
      name: 'Valor Total sem GD em R$',
      data: filteredData.map(item => {
        let electricity_total_value = parseFloat(item.electricity_total_value);
        let sceee_total_value = parseFloat(item.sceee_total_value);
        let cont_public_ilu_value = parseFloat(item.cont_public_ilu_value);

        let total_value_without_gd = electricity_total_value + sceee_total_value + cont_public_ilu_value;

        return total_value_without_gd.toFixed(2);
      }),
    },
    {
      name: 'Economia GD R$',
      data: filteredData.map(item => item.comp_gd_i_total_value),
    },
  ];

  return (
    <div className="container">
      <h1>Lumi PDF Scrapper</h1>
      <div>
        <select value={filter} onChange={handleClientNumberChange}>
          <option value="">Numero dos Clientes</option>
          {clientNumbers.map(clientNumber => (
            <option key={clientNumber} value={clientNumber}>
              {clientNumber}
            </option>
          ))}
        </select>
        <button onClick={handleGoToInvoiceLibrary}>Invoice Library</button>
      </div>
      {loading ? (
        <p>Carregando...</p>
      ) : (
        <Chart options={options} series={series} type="bar" height={1000} width={2500}/>
      )}
    </div>
  );
};

export default Dashboard;
