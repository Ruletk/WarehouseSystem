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
import {WarehouseService} from "../services/warehouseService";
import {WarehouseTagService} from "../services/warehouseTagService";
import {WarehouseUserService} from "../services/warehouseUserService"
import {Warehouse} from "../models/warehouse";

export class WarehouseAPI {
  // # Uncomment the following lines to enable dependency injection

  private warehouseService: WarehouseService;
  private warehouseTagService: WarehouseTagService;
  private warehouseUserService: WarehouseUserService;
  constructor(
    warehouseService: WarehouseService,
    warehouseTagService: WarehouseTagService,
    warehouseUserService: WarehouseUserService
  ) {
    console.log('INFO: Creating WarehouseAPI instance');
    this.warehouseService = warehouseService;
    this.warehouseTagService = warehouseTagService;
    this.warehouseUserService = warehouseUserService;
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

  private async getWarehousesHandler(req, res) {
    const response = await this.warehouseService.getAllWarehouses();
    handleResponse(res, response);
  }

  private async createWarehouseHandler(req, res) {
    const response = await this.warehouseService.createWarehouse(req.body);
    handleResponse(res, response, 201);
  }

  private async updateWarehouseHandler(req, res) {
    const response = await this.warehouseService.updateWarehouseById({
      id: parseInt(req.params.id, 10),
      ...req.body,
    } as UpdateWarehouseRequest);
    handleResponse(res, response);
  }

  private async deleteWarehouseHandler(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid warehouse ID.' });

    const response = await this.warehouseService.deleteWarehouseById(id);
    handleResponse(res, response);
  }

  private async getWarehouseHandler(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid warehouse ID.' });

    const response = await this.warehouseService.getWarehouseById(id);
    handleResponse(res, response);
  }

  private async getTagsHandler(req, res) {
    try {
      const response = await this.warehouseTagService.getAllTags();
      handleResponse(res, response);
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while fetching tags.', error: error.message });
    }
  }

  private async createTagHandler(req, res) {
    try {
      const response = await this.warehouseTagService.createTag(req.body.tag, req.body as CreateTagRequest);
      handleResponse(res, response, 201);
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while creating the tag.', error: error.message });
    }
  }

  private async updateTagHandler(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid tag ID.' });

    try {
      const response = await this.warehouseTagService.updateTagById(req.body);
      handleResponse(res, response);
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while updating the tag.', error: error.message });
    }
  }

  private async deleteTagHandler(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid tag ID.' });

    try {
      const response = await this.warehouseTagService.deleteTagById(id);
      handleResponse(res, response);
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while deleting the tag.', error: error.message });
    }
  }

  private async getRolesHandler(req, res) {
    try {
      const response = await this.warehouseUserService.getAllRoles();
      handleResponse(res, response);
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while fetching roles.', error: error.message });
    }
  }

  private async createRoleHandler(req, res) {
    try {
      const warehouse = new Warehouse();
      const response = await this.warehouseUserService.createRole(parseInt(req.params.id, 10), req.body, warehouse);
      handleResponse(res, response, 201);
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while creating the role.', error: error.message });
    }
  }

  private async updateRoleHandler(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid role ID.' });

    try {
      const response = await this.warehouseUserService.updateRoleById(req.body);
      handleResponse(res, response);
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while updating the role.', error: error.message });
    }
  }

  private async deleteRoleHandler(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid role ID.' });

    try {
      const response = await this.warehouseTagService.deleteRoleById(id);
      handleResponse(res, response);
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while deleting the role.', error: error.message });
    }
  }

  private async assignUserRoleHandler(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid role ID.' });

    try {
      const warehouse = new Warehouse();
      const response = await this.warehouseUserService.assignUserRole(req.body as AssignUserRoleRequest, warehouse);
      handleResponse(res, response);
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while assigning the user to the role.', error: error.message });
    }
  }

  private async removeUserRoleHandler(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).send({ message: 'Invalid role ID.' });

    try {
      const response = await this.warehouseUserService.removeUserRole(req.body as RemoveUserRoleRequest);
      handleResponse(res, response);
    } catch (error) {
      res.status(500).send({ message: 'An error occurred while removing the user from the role.', error: error.message });
    }
  }
}
const handleResponse = (res, response, successStatus = 200) => {
  if ('code' in response) return res.status(response.code).send(response);
  res.status(successStatus).send(response);
};
