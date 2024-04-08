import axios from 'axios';
import { FileInput } from 'core/model';
import { FileRepository } from 'core/repository';

export default class FileManager implements FileRepository {
  async getFiles() {
    const { data } = await axios.get('/api/files');

    return data.map((file: any) => ({
      id: file._id,
      name: file.name,
      description: file.description,
      private: file.private,
      filename: file.filename,
      mimetype: file.mimetype,
      size: file.size,
    }));
  }

  async uploadFile(file: FileInput) {
    const formData = new FormData();
    formData.set('name', file.name);
    formData.set('description', file.description);
    formData.set('private', file.private.toString());
    formData.set('file', file.file[0]);

    const { data } = await axios.post('/api/files', formData);

    return {
      id: data._id,
      name: data.name,
      description: data.description,
      private: data.private,
      filename: data.filename,
      mimetype: data.mimetype,
      size: data.size,
    };
  }

  async updateFile(file: FileInput) {
    const formData = new FormData();
    formData.set('name', file.name);
    formData.set('description', file.description);
    formData.set('private', file.private.toString());

    if (file.file.length > 0) {
      formData.set('file', file.file[0]);
    }

    const { data } = await axios.patch(`/api/files/${file.id}`, formData);

    return {
      id: data._id,
      name: data.name,
      description: data.description,
      private: data.private,
      filename: data.filename,
      mimetype: data.mimetype,
      size: data.size,
    };
  }

  async deleteFile(fileId: string) {
    await axios.delete(`/api/files/${fileId}`);
  }
}
