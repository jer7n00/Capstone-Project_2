// src/gateway.ts
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import { authenticateJWT } from './middleware/authenticate';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());

//Auth Service Proxy
app.use('/api/auth', createProxyMiddleware({
    target: 'http://localhost:9000',
    changeOrigin: true
}));

// Finance Service Proxy (protected)
app.use('/api/players',authenticateJWT, createProxyMiddleware({
    target: 'http://localhost:8000',
    changeOrigin: true
}));
app.use('/api/teams',authenticateJWT, createProxyMiddleware({
    target: 'http://localhost:5000',
    changeOrigin: true
}));
app.use('/api/matches',authenticateJWT, createProxyMiddleware({
    target: 'http://localhost:4000',
    changeOrigin: true
}));
app.use('/api/organizers',authenticateJWT, createProxyMiddleware({
    target: 'http://localhost:4000',
    changeOrigin: true
}));
app.use('/api/tournaments',authenticateJWT, createProxyMiddleware({
    target: 'http://localhost:4000',
    changeOrigin: true
}));
app.listen(7000, () => {
    console.log('API Gateway running on port 7000');
});