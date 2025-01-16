import { Router } from 'express';

const router = Router();

router.get('/warehouse/:warehouse_id', (req, res) => {
  const warehouse_id = req.params.warehouse_id;

  res.status(200).send({
    message: `All stocks for warehouse ${warehouse_id}`,
  });
});

router.post('/warehouse/:warehouse_id', (req, res) => {
  const warehouse_id = req.params.warehouse_id;
  res.status(201).send({
    message: `Stock added to warehouse ${warehouse_id}`,
  });
});

router.get('/warehouse/:warehouse_id/stock/:stock_id', (req, res) => {
  const warehouse_id = req.params.warehouse_id;
  const stock_id = req.params.stock_id;
  res.status(200).send({
    message: `Stock details with id ${stock_id} for warehouse ${warehouse_id}`,
  });
});

router.put('/warehouse/:warehouse_id/stock/:stock_id', (req, res) => {
  const warehouse_id = req.params.warehouse_id;
  const stock_id = req.params.stock_id;
  res.status(200).send({
    message: `Stock updated with id ${stock_id} for warehouse ${warehouse_id}`,
  });
});

router.delete('/warehouse/:warehouse_id/stock/:stock_id', (req, res) => {
  const warehouse_id = req.params.warehouse_id;
  const stock_id = req.params.stock_id;
  res.status(200).send({
    message: `Stock deleted with id ${stock_id} for warehouse ${warehouse_id}`,
  });
});

export { router as stockRouter };
