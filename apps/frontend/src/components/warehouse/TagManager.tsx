import React, { useState, useEffect } from 'react';
import { Tag } from './types';
import apiClient from '../../api/client';
import { endpoints } from '../../api/endpoints';

interface TagManagerProps {
  warehouseId: number;
}

export const TagManager: React.FC<TagManagerProps> = ({ warehouseId }) => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [newTag, setNewTag] = useState<string>('');

  useEffect(() => {
    const fetchTags = async () => {
      const response = await apiClient.get(endpoints.warehouse.tags(warehouseId));
      setTags(response.data);
    };
    fetchTags();
  }, [warehouseId]);

  const handleCreateTag = async () => {
    try {
      const response = await apiClient.post(endpoints.warehouse.createTag(warehouseId), {
        tag: newTag,
        });
      setTags([...tags, response.data]);
      setNewTag('');
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

    const handleDeleteTag = async (tagId: number) => {
        try {
        await apiClient.delete(endpoints.warehouse.deleteTag(warehouseId, tagId));
        setTags(tags.filter((tag) => tag.tagId !== tagId));
        } catch (error) {
        console.error('Error deleting tag:', error);
        }
    };

  return (
    <div className="tag-manager">
      <div className="add-tag">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          placeholder="New tag"
        />
        <button onClick={handleCreateTag}>Add Tag</button>
      </div>

      <div className="tags-list">
        {tags.map((tag) => (
          <div key={tag.tagId} className="tag-item">
            {tag.tag}
            <button onClick={() => handleDeleteTag(tag.tagId)}>×</button>
          </div>
        ))}
      </div>
    </div>
  );
};
