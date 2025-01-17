import { Router } from "express";


const router = Router();

router.get('/list', (req, res) => {
  res.status(200).send({
    message: 'List of warehouses',
  });
});

router.post('/list', (req, res) => {
  res.status(201).send({
    message: 'Warehouse added',
  });

});

router.get('/:token', (req, res) => {
  const token = req.params.token;
  res.status(200).send({
    message: `Warehouse details with token ${token}`,
  });
});

router.put('/:token', (req, res) => {
  const token = req.params.token;
  res.status(200).send({
    message: `Warehouse updated with token ${token}`,
  });
});

router.delete('/:token', (req, res) => {
  const token = req.params.token;
  res.status(200).send({
    message: `Warehouse deleted with token ${token}`,
  });
});

export { router as warehouseRouter };
