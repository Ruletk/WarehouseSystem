import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Warehouse } from './types';
import apiClient from '../../api/client';
import { endpoints } from '../../api/endpoints';
import { TagManager } from './TagManager';

export const WarehouseDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWarehouse = async () => {
      try {
        const response = await apiClient.get(
          endpoints.warehouse.detail(Number(id))
        );
        setWarehouse(response.data);
      } catch (error) {
        console.error('Error fetching warehouse:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWarehouse();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!warehouse) return <div>Warehouse not found</div>;

  return (
    <div className="warehouse-detail">
      <h1>{warehouse.name}</h1>
      <p>
        Location: {warehouse.latitude}, {warehouse.longitude}
      </p>
      <p>Address: {warehouse.address}</p>

      <section className="tags-section">
        <h2>Tags</h2>
        <TagManager warehouseId={Number(id)} />
      </section>

      {/* <section className="roles-section">
        <h2>User Roles</h2>
        <RoleManager warehouseId={Number(id)} />
      </section> */}
      {/* Backend API does not support roles yet
       */}
      <section className="roles-section">
        <h2>User Roles</h2>
        <div>Roles are not supported yet</div>
      </section>
    </div>
  );
};
