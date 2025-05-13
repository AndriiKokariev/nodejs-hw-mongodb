import express from 'express';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';

const router = express.Router();

const swaggerDocument = JSON.parse(
  fs.readFileSync('./docs/swagger.json', 'utf8'),
);

router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument));

export default router;
