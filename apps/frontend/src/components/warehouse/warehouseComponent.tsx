// apps/frontend/src/components/warehouse/warehouseComponent.ts
import React from 'react';

interface WarehouseComponentProps {
  items: { id: number; name: string; quantity: number }[];
}

const WarehouseComponent: React.FC<WarehouseComponentProps> = ({ items }) => {
  return (
    <div>
      <h2>Warehouse Items</h2>
  <ul>
  {items.map((item) => (
      <li key={item.id}>
        {item.name} - {item.quantity} units
      </li>
))}
  </ul>
  </div>
);
};

export default WarehouseComponent;
