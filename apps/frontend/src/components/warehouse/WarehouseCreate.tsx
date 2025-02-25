import { useState } from "react";
import apiClient from "../../api/client";
import { endpoints } from "../../api/endpoints";


export const WarehouseCreate = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    try {
      setLoading(true);
      await apiClient.post(endpoints.warehouse.create, {
        name,
        address,
        description,
      });
      setLoading(false);
    } catch (error) {
      setError('Error creating warehouse');
      console.error('Error creating warehouse:', error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Warehouse</h1>
      <form>
        <div>
          <label>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div>
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button onClick={handleCreate} disabled={loading}>
          {loading ? 'Loading...' : 'Create'}
        </button>
        {error && <p>{error}</p>}
      </form>
    </div>
  );
};
