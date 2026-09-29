const app = require('./App/app');
const connectToDb = require('./App/utils/db');
const logger = require('./App/utils/logger');

connectToDb()
  .then(() => {
    logger.info('Connected to MongoDB');
    app.listen(app.get('port'), () =>
      logger.info(`Server is running on Port ${app.get('port')}`),
    );
  })
  .catch((error) => {
    logger.error('Error connection to MongoDB', error.message);
  });
