/**
 * Speed Insights Integration for Node.js/Express Backend
 * 
 * This module provides integration with Vercel Speed Insights for backend monitoring.
 * For frontend monitoring, ensure the @vercel/speed-insights package is also integrated
 * in your frontend application.
 */

/**
 * Initialize Speed Insights for backend tracking
 * This injects the Speed Insights tracking capability into the backend
 */
const initializeSpeedInsights = () => {
  try {
    const { injectSpeedInsights } = require('@vercel/speed-insights');
    injectSpeedInsights();
    console.log('Speed Insights initialized successfully');
  } catch (error) {
    console.warn('Speed Insights initialization skipped:', error.message);
  }
};

module.exports = {
  initializeSpeedInsights,
};
