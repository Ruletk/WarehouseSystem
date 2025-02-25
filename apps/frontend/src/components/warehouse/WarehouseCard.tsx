import React from 'react';
import { Link } from 'react-router-dom';
import { Warehouse } from './types';

interface WarehouseCardProps {
  warehouse: Warehouse;
}

export const WarehouseCard: React.FC<WarehouseCardProps> = ({ warehouse }) => {
  return (
    <div className="warehouse-card">
      <h3>{warehouse.name}</h3>
      <p>Address: {warehouse.address}</p>
      <Link to={`/warehouse/${warehouse.id}/detail`}>View Details</Link>
    </div>
  );
};
