const app = require('./App/app');
const config = require('./App/utils/config');
const connectToDb = require('./App/utils/db');
const logger = require('./App/utils/logger');

connectToDb()
  .then(() => {
    logger.info('Connecting to the Database.......');
    logger.info('Connected to MongoDB');
    app.listen(config.PORT, () =>
      logger.info(`Server is running on Port ${config.PORT}`),
    );
  })
  .catch((error) => {
    logger.error('Error connection to MongoDB', error.message);
  });
