import React, { useState, useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

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
const Error = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

export default function Login() {
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(account, password);
      navigate("/transaction");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <Error>{error}</Error>}
        <Input
          type="text"
          placeholder="Bank Account Number"
          value={account}
          onChange={e => setAccount(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );
}
