import { put, del } from "@vercel/blob";
import ImageRepository from "../repositories/image.repository.js";

export const uploadEventImages = async (req, res) => {
  try {
    console.log("Upload request received");
    console.log("req.files:", req.files);
    console.log("req.body:", req.body);

    if (!req.files) {
      console.log("No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    let responseData = [];
    for (let i = 0; i < req.files.length; i++) {
      const image = req.files[i];

      const imageName = `event${req.body.eventId}-${i + 1}.jpg`;
      console.log(imageName);

      if (!imageName) {
        console.log("No imageName in request body");
        return res.status(400).json({ error: "Image name required" });
      }

      const filename = `events/${imageName}`;
      console.log("Uploading to blob with filename:", filename);

      if (!process.env.BLOB_READ_WRITE_TOKEN) {
        console.error("BLOB_READ_WRITE_TOKEN not set");
        return res.status(500).json({ error: "Blob token not configured" });
      }

      const blob = await put(filename, image.buffer, {
        access: "public",
        token: process.env.BLOB_READ_WRITE_TOKEN,
        allowOverwrite: true,
      });

      if (i == req.thumbnailIndex) {
        ImageRepository.create({
          EventId: req.eventId,
          Href: filename,
          isThumbnail: true,
        });
      } else {
        ImageRepository.create({
          EventId: req.eventId,
          Href: filename,
          isThumbnail: false,
        });
      }

      console.log("Upload successful:", blob.url);

      responseData.push({
        url: blob.url,
        pathname: blob.pathname,
      });
    }
    console.log(responseData);

    res.status(201).json(responseData);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const uploadImage = async (req, res) => {
  try {
    console.log("Upload request received");
    console.log("req.file:", req.file);
    console.log("req.body:", req.body);

    if (!req.file) {
      console.log("No file in request");
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { imageName } = req.body;

    if (!imageName) {
      console.log("No imageName in request body");
      return res.status(400).json({ error: "Image name required" });
    }

    const filename = `events/${imageName}`;
    console.log("Uploading to blob with filename:", filename);

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error("BLOB_READ_WRITE_TOKEN not set");
      return res.status(500).json({ error: "Blob token not configured" });
    }

    const blob = await put(filename, req.file.buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN,
      allowOverwrite: true,
    });

    console.log("Upload successful:", blob.url);
    res.json({
      url: blob.url,
      pathname: blob.pathname,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const { pathname } = req.body;

    if (!pathname) {
      return res.status(400).json({ error: "Pathname required" });
    }

    await del(pathname, {
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    res.json({ message: "Image deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
