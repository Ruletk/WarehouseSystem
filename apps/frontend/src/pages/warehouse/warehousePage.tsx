// apps/frontend/src/pages/warehouse/warehousePage.ts
import React from 'react';
import WarehouseComponent from '../../components/warehouse/warehouseComponent';

const WarehousePage: React.FC = () => {
  const warehouseItems = [
    { id: 1, name: 'Item 1', quantity: 10 },
    { id: 2, name: 'Item 2', quantity: 5 },
    { id: 3, name: 'Item 3', quantity: 20 },
  ];

  return (
    <div>
      <h1>Warehouse Management</h1>
  <WarehouseComponent items={warehouseItems} />
  </div>
);
};

export default WarehousePage;
