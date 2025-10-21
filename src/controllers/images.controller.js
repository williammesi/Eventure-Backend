import { put, del } from '@vercel/blob';

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { imageName } = req.body;

    if (!imageName) {
      return res.status(400).json({ error: 'Image name required' });
    }

    const filename = `events/${imageName}`;

    const blob = await put(filename, req.file.buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    res.json({
      url: blob.url,
      pathname: blob.pathname
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { pathname } = req.body;

    if (!pathname) {
      return res.status(400).json({ error: 'Pathname required' });
    }

    await del(pathname, {
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    res.json({ message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
