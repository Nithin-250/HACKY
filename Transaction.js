import React, { useState, useContext } from "react";
import styled from "styled-components";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import PinModal from "../components/PinModal";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Form = styled.form`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border: 1px solid #eee;
  border-radius: 8px;
  background: #fafafa;
`;
const Input = styled.input`
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 1rem;
`;
const Button = styled.button`
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
  background: #007bff;
  color: white;
  cursor: pointer;
`;
const Result = styled.div`
  margin-top: 1rem;
  color: ${({ fraud }) => (fraud ? "red" : "green")};
`;

export default function Transaction() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({
    transaction_id: "",
    timestamp: "",
    amount: "",
    location: "",
    card_type: "",
    currency: "",
    recipient_account_number: "",
  });
  const [result, setResult] = useState(null);
  const [showPin, setShowPin] = useState(false);
  const [fraudReasons, setFraudReasons] = useState([]);
  const [txnData, setTxnData] = useState(null);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setResult(null);
    setFraudReasons([]);
    try {
      const res = await axios.post("/api/check_fraud", {
        ...form,
        sender_account_number: user.account,
      });
      setResult(res.data);
      if (res.data.fraud) {
        setFraudReasons(res.data.reasons);
        setTxnData({ ...form, sender_account_number: user.account });
        setShowPin(true);
      }
    } catch (err) {
      setResult({ fraud: true, reasons: ["Error processing transaction"] });
    }
  };

  const handlePinSuccess = () => {
    setShowPin(false);
    setResult({ fraud: false, reasons: ["Transaction verified with secure pin."] });
  };

  const handlePinFail = () => {
    setShowPin(false);
    setResult({ fraud: true, reasons: ["Incorrect pin. Transaction blocked and recipient blacklisted."] });
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2>New Transaction</h2>
        <Input name="transaction_id" placeholder="Transaction ID" value={form.transaction_id} onChange={handleChange} required />
        <Input name="timestamp" placeholder="Timestamp (YYYY-MM-DD HH:MM:SS)" value={form.timestamp} onChange={handleChange} required />
        <Input name="amount" type="number" placeholder="Amount" value={form.amount} onChange={handleChange} required />
        <Input name="location" placeholder="Location (e.g. Chennai)" value={form.location} onChange={handleChange} required />
        <Input name="card_type" placeholder="Card Type" value={form.card_type} onChange={handleChange} required />
        <Input name="currency" placeholder="Currency" value={form.currency} onChange={handleChange} required />
        <Input name="recipient_account_number" placeholder="Recipient Account Number" value={form.recipient_account_number} onChange={handleChange} required />
        <Button type="submit">Submit</Button>
        {result && (
          <Result fraud={result.fraud}>
            {result.fraud ? "Fraud Detected!" : "Transaction Safe."}
            <ul>
              {(result.reasons || []).map((r, i) => <li key={i}>{r}</li>)}
            </ul>
          </Result>
        )}
      </Form>
      {showPin && (
        <PinModal
          txnData={txnData}
          onSuccess={handlePinSuccess}
          onFail={handlePinFail}
        />
      )}
    </Container>
  );
}
