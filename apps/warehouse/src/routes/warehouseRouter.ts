import { Router } from "express";
import {validateRequest} from "@warehouse/validation";
import {
  AssignUserRoleRequest,
  CreateRoleRequest,
  CreateTagRequest,
  CreateWarehouseRequest, RemoveUserRoleRequest, UpdateRoleRequest,
  UpdateTagRequest,
  UpdateWarehouseRequest
} from "../dto/request";


const router = Router();

router.get('/', (req, res) => {
  res.status(200).send({
    message: 'Hello World',
  });
})

router.post('/', validateRequest(CreateWarehouseRequest), (req, res) => {
  res.status(201).send({
    message: 'Hello World',
  });
})

router.put('/:id', validateRequest(UpdateWarehouseRequest), (req, res) => {
  res.status(200).send({
    message: 'Hello World',
  });
})

router.delete('/:id', (req, res) => {
  res.status(200).send({
    message: 'Hello World',
  });
})

router.get('/:id', (req, res) => {
  res.status(200).send({
    message: 'Hello World',
  });
})

router.get('/tags', (req, res) => {
  res.status(200).send({
    message: 'Hello World',
  });
})

router.post('/tags', validateRequest(CreateTagRequest), (req, res) => {
  res.status(201).send({
    message: 'Hello World',
  });
})

router.put('/tags/:id', validateRequest(UpdateTagRequest), (req, res) => {
  res.status(200).send({
    message: 'Hello World',
  });
})

router.delete('/tags/:id', (req, res) => {
  res.status(200).send({
    message: 'Hello World',
  });
})

router.get('/roles', (req, res) => {
  res.status(200).send({
    message: 'Hello World',
  });
})

router.post('/roles', validateRequest(CreateRoleRequest), (req, res) => {
  res.status(201).send({
    message: 'Hello World',
  })
})

router.put('/roles/:id', validateRequest(UpdateRoleRequest), (req, res) => {
  res.status(200).send({
    message: 'Hello World',
  });
})

router.delete('/roles/:id', (req, res) => {
  res.status(200).send({
    message: 'Hello World',
  });
})

router.post('/roles/:id/user', validateRequest(AssignUserRoleRequest), (req, res) => {
  res.status(201).send({
    message: 'Hello World',
  });
})

router.delete('/roles/:id/user', validateRequest(RemoveUserRoleRequest), (req, res) => {
  res.status(200).send({
    message: 'Hello World',
  });
})

export { router as warehouseRouter };
