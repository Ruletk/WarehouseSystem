import { useEffect, useState } from "react";
import { WarehouseCard } from "./WarehouseCard";
import { Warehouse } from "./types";
import apiClient from "../../api/client";
import { endpoints } from "../../api/endpoints";

export const WarehouseList: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        const response = await apiClient.get(endpoints.warehouse.list);
        setWarehouses(response.data);
      } catch (error) {
        console.error('Error fetching warehouses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchWarehouses();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="warehouse-list">
      <h1>Warehouses</h1>
      <div className="warehouses-container">
        {warehouses.map((warehouse) => (
          <WarehouseCard key={warehouse.id} warehouse={warehouse} />
        ))}
      </div>
    </div>
  );
};
