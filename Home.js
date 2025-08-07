import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;
const Header = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
`;
const Intro = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Button = styled.button`
  margin-left: 1rem;
  padding: 0.5rem 1.5rem;
  font-size: 1rem;
  border-radius: 5px;
  border: none;
  background: #007bff;
  color: white;
  cursor: pointer;
`;

export default function Home() {
  const navigate = useNavigate();
  return (
    <Container>
      <Header>
        <Button onClick={() => navigate("/login")}>Login</Button>
        <Button onClick={() => navigate("/signup")}>Sign Up</Button>
      </Header>
      <Intro>
        <h1>AI Fraud Detector</h1>
        <p>
          Welcome to the AI-powered fraud detection system. Secure your transactions with advanced AI and real-time monitoring.
        </p>
      </Intro>
    </Container>
  );
}
