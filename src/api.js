import axios from 'axios';
import { getConfig } from './config.js';

function getBaseURL() {
  return getConfig('baseUrl') || 'https://daymet.ornl.gov/single-pixel';
}

async function request(endpoint, params = {}) {
  const baseURL = getBaseURL();
  try {
    const response = await axios.get(`${baseURL}${endpoint}`, { params });
    return response.data;
  } catch (error) {
    if (error.response?.data?.error) {
      throw new Error(`API Error: ${error.response.data.error}`);
    }
    throw new Error(`Request failed: ${error.message}`);
  }
}

// ============================================================
// Weather Data Operations
// ============================================================

/**
 * Get weather data for a location
 */
export async function getWeatherData(lat, lon, options = {}) {
  const params = {
    lat,
    lon,
    format: options.format || 'json',
    ...options
  };

  // Convert arrays to comma-separated strings
  if (params.vars && Array.isArray(params.vars)) {
    params.vars = params.vars.join(',');
  }
  if (params.years && Array.isArray(params.years)) {
    params.years = params.years.join(',');
  }

  return await request('/api/data', params);
}

/**
 * Get weather data preview
 */
export async function previewData(lat, lon, options = {}) {
  const params = {
    lat,
    lon,
    ...options
  };

  if (params.vars && Array.isArray(params.vars)) {
    params.vars = params.vars.join(',');
  }
  if (params.years && Array.isArray(params.years)) {
    params.years = params.years.join(',');
  }

  return await request('/preview', params);
}
