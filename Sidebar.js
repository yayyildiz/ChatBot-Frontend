import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Stil tanımlamaları
const CurrencyItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #000; /* Arka plan rengini koyu yapın, yoksa beyaz görünür */
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`;

const AddButton = styled.button`
  background-color: #007BFF;
  color: #ffffff;
  border: 1px solid #ffffff;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  &:hover {
    background-color: #17D5FF;
  }
`;

// Yeni kripto para ekleme işlevini temsil eden bir modal veya form bileşeni
const AddSymbolModal = ({ onAdd }) => {
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');

  // Sembolün değişimini işler
  const handleSymbolChange = (e) => {
    const value = e.target.value.toUpperCase(); // Harfleri büyük yap
    if (value.length <= 4) {
      setSymbol(value);
    } else {
      alert('Sembol 4 karakterden uzun olamaz.');
    }
  };

  // İsimlerin değişimini işler
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 25) {
      setName(value);
    } else {
      alert('İsim 25 karakterden uzun olamaz.');
    }
  };

  // Formu gönderme işlemi
  const handleSubmit = (e) => {
    e.preventDefault();
    if (symbol && name) {
      onAdd({ symbol, name });
      setSymbol('');
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Sembol" 
        value={symbol}
        onChange={handleSymbolChange}
        maxLength="4"
        onKeyPress={(e) => {
          if (symbol.length >= 4 && e.key !== 'Backspace' && e.key !== 'Tab') {
            e.preventDefault();
            alert('Sembol 4 karakterden uzun olamaz.');
          }
        }}
      />
      <input 
        type="text" 
        placeholder="İsim" 
        value={name}
        onChange={handleNameChange}
        maxLength="25"
        onKeyPress={(e) => {
          if (name.length >= 25 && e.key !== 'Backspace' && e.key !== 'Tab') {
            e.preventDefault();
            alert('İsim 25 karakterden uzun olamaz.');
          }
        }}
      />
      <button type="submit">Ekle</button>
    </form>
  );
};

const Sidebar = ({ onSelectCurrency }) => {
  const [currencies, setCurrencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // API'den veri çekme işlevi
  const fetchCurrencies = async () => {
    // API isteği yapma kodu...
  };

  // Bileşen yüklendiğinde veri çekme
  useEffect(() => {
    const fetchInterval = async () => {
      while (true) {
        await fetchCurrencies();
        await new Promise((resolve) => setTimeout(resolve, 10000)); // 10 saniye bekle
      }
    };

    fetchInterval();

    // Bileşen unmounted olduğunda interval temizlenir
    return () => clearInterval(fetchInterval);
  }, []);

  // Yeni bir kripto para ekler
  const handleAddCurrency = async (newCurrency) => {
    // Yeni kripto para ekleme kodu...
  };

  
  if (loading) {
    return <div></div>; // Mavi kutu yerine düz bir div
  }

  if (error) {
    return <div>Hata: {error}</div>; // Mavi kutu yerine düz bir div
  }

  
  return (
    <>
      <AddButton onClick={() => setShowAddModal(true)}>+</AddButton>
      {showAddModal && (
        <AddSymbolModal 
          onAdd={(newCurrency) => {
            handleAddCurrency(newCurrency);
            setShowAddModal(false);
          }} 
        />
      )}
      {currencies.length > 0 ? (
        currencies.map((currency, index) => (
          <CurrencyItem 
            key={index}
            onClick={() => onSelectCurrency(currency.symbol)}
          >
            {currency.symbol} - {currency.name}
          </CurrencyItem>
        ))
      ) : (
        <div>Kripto para verisi bulunamadı.</div>
      )}
    </>
  );
};

export default Sidebar;
