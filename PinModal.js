import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Overlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;
const Modal = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
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
const Error = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

export default function PinModal({ txnData, onSuccess, onFail }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post("/api/verify_pin", {
        ...txnData,
        pin,
      });
      if (res.data.verified) {
        onSuccess();
      } else {
        setError("Incorrect pin.");
        onFail();
      }
    } catch (err) {
      setError("Verification failed.");
      onFail();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay>
      <Modal>
        <form onSubmit={handleSubmit}>
          <h3>Enter Secure Pin</h3>
          {error && <Error>{error}</Error>}
          <Input
            type="password"
            placeholder="Secure Pin"
            value={pin}
            onChange={e => setPin(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify"}</Button>
        </form>
      </Modal>
    </Overlay>
  );
}
