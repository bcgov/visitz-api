import { defineConfig } from 'cypress';
import 'dotenv/config';

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
	  config.env = {
        ...process.env,
        ...config.env
      }
      return config  
    },
  },
  env: {
	token: {
		bearer: process.env.CYPRESS_BEARER_TOKEN,
	},
  },
});
