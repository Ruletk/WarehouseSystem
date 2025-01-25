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
    const resp = await this.warehouseService.getAllWarehouses();
    if ('code' in resp) return res.status(resp.code).send(resp);
    res.status(200).send(resp);
  }

  private async createWarehouseHandler(req, res) {
    const resp = await this.warehouseService.createWarehouse(req.body);
    if ('code' in resp) return res.status(resp.code).send(resp);
    res.status(201).send(resp);
  }

  private async updateWarehouseHandler(req, res) {
    const updateResponse = await this.warehouseService.updateWarehouseById({
      id: parseInt(req.params.id, 10),
      ...req.body,
    } as UpdateWarehouseRequest);
    if ('code' in updateResponse)
      return res.status(updateResponse.code).send(updateResponse);
    res.status(200).send(updateResponse);
  }

  private async deleteWarehouseHandler(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid warehouse ID.' });
    }

    const deleteResponse = await this.warehouseService.deleteWarehouseById(id);
    if ('code' in deleteResponse) {
      return res.status(deleteResponse.code).send(deleteResponse);
    }

    res.status(200).send({ message: 'Warehouse deleted successfully.' });

  }

  private async getWarehouseHandler(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid warehouse ID.' });
    }

    const warehouseResponse = await this.warehouseService.getWarehouseById(id);
    if ('code' in warehouseResponse) {
      return res.status(warehouseResponse.code).send(warehouseResponse);
    }

    res.status(200).send(warehouseResponse);
  }

  private async getTagsHandler(req, res) {
    try {
      const tagsResponse = await this.warehouseTagService.getAllTags('');
      if ('code' in tagsResponse) {
        return res.status(tagsResponse.code).send(tagsResponse);
      }
      res.status(200).send(tagsResponse);
    } catch (error) {
      res.status(500).send({
        message: 'An error occurred while fetching tags.',
        error: error.message,
      });
    }
  }

  private async createTagHandler(req, res) {
    try {
      const tagResponse = await this.warehouseTagService.createTag(
        (req.body as CreateTagRequest).tag,
        req.body as CreateTagRequest
      );
      if ('code' in tagResponse) {
        return res.status(tagResponse.code).send(tagResponse);
      }
      res.status(201).send(tagResponse);
    } catch (error) {
      res.status(500).send({
        message: 'An error occurred while creating the tag.',
        error: error.message,
      });
    }
  }

  private async updateTagHandler(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid tag ID.' });
    }

    try {
      const updateResponse = await this.warehouseTagService.updateTagById(
        id,
        req.body as UpdateTagRequest
      );

      if ('code' in updateResponse) {
        return res.status(updateResponse.code).send(updateResponse);
      }

      res.status(200).send(updateResponse);
    } catch (error) {
      res.status(500).send({
        message: 'An error occurred while updating the tag.',
        error: error.message,
      });
    }
  }

  private async deleteTagHandler(req, res) {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid tag ID.' });
    }

    try {
      const deleteResponse = await this.warehouseTagService.deleteTagById(id);

      if ('code' in deleteResponse) {
        return res.status(deleteResponse.code).send(deleteResponse);
      }

      res.status(200).send({ message: 'Tag deleted successfully.' });
    } catch (error) {
      res.status(500).send({
        message: 'An error occurred while deleting the tag.',
        error: error.message,
      });
    }
  }

  private async getRolesHandler(req, res) {
    try {
      const rolesResponse = await this.warehouseUserService.getAllRoles();
      if ('code' in rolesResponse) {
        return res.status(rolesResponse.code).send(rolesResponse);
      }
      res.status(200).send(rolesResponse);
    } catch (error) {
      res.status(500).send({
        message: 'An error occurred while fetching roles.',
        error: error.message,
      });
    }
  }

  private async createRoleHandler(req, res) {
    try {
      const roleResponse = await this.warehouseUserService.createRoleById(
        0,
        req.body as CreateRoleRequest
      );
      if ('code' in roleResponse) {
        return res.status(roleResponse.code).send(roleResponse);
      }
      res.status(201).send(roleResponse);
    } catch (error) {
      res.status(500).send({
        message: 'An error occurred while creating the role.',
        error: error.message,
      });
    }
  }

  private async updateRoleHandler(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid role ID.' });
    }

    try {
      const updateResponse = await this.warehouseUserService.updateRoleById(
        id,
        req.body as UpdateRoleRequest
      );
      if ('code' in updateResponse) {
        return res.status(updateResponse.code).send(updateResponse);
      }
      res.status(200).send(updateResponse);
    } catch (error) {
      res.status(500).send({
        message: 'An error occurred while updating the role.',
        error: error.message,
      });
    }
  }

  private async deleteRoleHandler(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).send({ message: 'Invalid role ID.' });
    }

    try {
      const deleteResponse = await this.warehouseUserService.deleteRoleById(id);
      if ('code' in deleteResponse) {
        return res.status(deleteResponse.code).send(deleteResponse);
      }
      res.status(200).send({ message: 'Role deleted successfully.' });
    } catch (error) {
      res.status(500).send({
        message: 'An error occurred while deleting the role.',
        error: error.message,
      });
    }
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
