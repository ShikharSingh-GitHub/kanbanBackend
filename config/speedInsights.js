/**
 * Speed Insights Configuration
 * 
 * Configure Vercel Speed Insights for your backend application
 * This configuration helps with performance monitoring and analytics
 */

const config = {
  // Enable Speed Insights by default in production
  enabled: process.env.NODE_ENV === 'production' || process.env.SPEED_INSIGHTS_ENABLED === 'true',
  
  // The beacon URL where Speed Insights will send data
  // This is automatically configured by Vercel, but can be customized if needed
  beaconUrl: process.env.SPEED_INSIGHTS_BEACON_URL,
  
  // Sample rate for performance monitoring (0-100)
  // Lower values reduce bandwidth usage for high-traffic applications
  sampleRate: parseInt(process.env.SPEED_INSIGHTS_SAMPLE_RATE || '100', 10),
};

module.exports = config;
