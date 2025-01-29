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


export class WarehouseAPI {
  // # Uncomment the following lines to enable dependency injection

  // private warehouseService: WarehouseService;
  // private warehouseTagService: WarehouseTagService;
  // private warehouseUserService: WarehouseUserService;
  constructor(
    // warehouseService: WarehouseService,
    // warehouseTagService: WarehouseTagService,
    // warehouseUserService: WarehouseUserService
  ) {
    console.log('INFO: Creating WarehouseAPI instance');
    // this.warehouseService = warehouseService;
    // this.warehouseTagService = warehouseTagService;
    // this.warehouseUserService = warehouseUserService;
  }

  registerRoutes(router: Router): void {
    console.log('INFO: Registering warehouse routes');
    this.registerWarehouseRoutes(router);
    this.registerTagRoutes(router);
    this.registerRoleRoutes(router);
  }

  private registerWarehouseRoutes(router: Router): void {
    console.log(
      `INFO: Registering warehouse routes with router: ${router.name}.`
    );

    router.get('/', this.getWarehousesHandler.bind(this));
    router.post('/', validateRequest(CreateWarehouseRequest), this.createWarehouseHandler.bind(this));
    router.put('/:id', validateRequest(UpdateWarehouseRequest), this.updateWarehouseHandler.bind(this));
    router.delete('/:id', this.deleteWarehouseHandler.bind(this));
    router.get('/:id', this.getWarehouseHandler.bind(this));
  }

  private registerTagRoutes(router: Router): void {
    console.log(
      `INFO: Registering tag routes with router: ${router.name}.`
    );

    router.get('/tags', this.getTagsHandler.bind(this));
    router.post('/tags', validateRequest(CreateTagRequest), this.createTagHandler.bind(this));
    router.put('/tags/:id', validateRequest(UpdateTagRequest), this.updateTagHandler.bind(this));
    router.delete('/tags/:id', this.deleteTagHandler.bind(this));
  }

  private registerRoleRoutes(router: Router): void {
    console.log(
      `INFO: Registering role routes with router: ${router.name}.`
    );

    router.get('/roles', this.getRolesHandler.bind(this));
    router.post('/roles', validateRequest(CreateRoleRequest), this.createRoleHandler.bind(this));
    router.put('/roles/:id', validateRequest(UpdateRoleRequest), this.updateRoleHandler.bind(this));
    router.delete('/roles/:id', this.deleteRoleHandler.bind(this));
    router.post('/roles/:id/user', validateRequest(AssignUserRoleRequest), this.assignUserRoleHandler.bind(this));
    router.delete('/roles/:id/user', validateRequest(RemoveUserRoleRequest), this.removeUserRoleHandler.bind(this));
  }

  private getWarehousesHandler(req, res) {
    res.status(200).send({
      message: 'Hello World',
    });
  }

  private createWarehouseHandler(req, res) {
    res.status(201).send({
      message: 'Hello World',
    });
  }

  private updateWarehouseHandler(req, res) {
    res.status(200).send({
      message: 'Hello World',
    });
  }

  private deleteWarehouseHandler(req, res) {
    res.status(200).send({
      message: 'Hello World',
    });
  }

  private getWarehouseHandler(req, res) {
    res.status(200).send({
      message: 'Hello World',
    });
  }

  private getTagsHandler(req, res) {
    res.status(200).send({
      message: 'Hello World',
    });
  }

  private createTagHandler(req, res) {
    res.status(201).send({
      message: 'Hello World',
    });
  }

  private updateTagHandler(req, res) {
    res.status(200).send({
      message: 'Hello World',
    });
  }

  private deleteTagHandler(req, res) {
    res.status(200).send({
      message: 'Hello World',
    });
  }

  private getRolesHandler(req, res) {
    res.status(200).send({
      message: 'Hello World',
    });
  }

  private createRoleHandler(req, res) {
    res.status(201).send({
      message: 'Hello World',
    });
  }

  private updateRoleHandler(req, res) {
    res.status(200).send({
      message: 'Hello World',
    });
  }

  private deleteRoleHandler(req, res) {
    res.status(200).send({
      message: 'Hello World',
    });
  }

  private assignUserRoleHandler(req, res) {
    res.status(201).send({
      message: 'Hello World',
    });
  }

  private removeUserRoleHandler(req, res) {
    res.status(200).send({
      message: 'Hello World',
    });
  }
}
