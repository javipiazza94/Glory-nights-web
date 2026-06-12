// Jest global configuration (optional)
jest.setTimeout(30000);   // Ajusta el timeout a tu necesidad

// Si usas supertest con Express:
const request = require('supertest');
global.request = request;

// setup.js
import '@testing-library/jest-dom/extend-expect';