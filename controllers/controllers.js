const fs = require("fs");
const filePath = "data.json";
function getAll() {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (error, data) => {
      if (error) {
        reject(error);
        console.log(error);
      } else {
        var postData = JSON.parse(data);
        resolve(JSON.parse(data));
      }
    });
  });
}
/**
 * @param {Number} id - "id" of psot you want to fetch
 */
function getById(id) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (error, data) => {
      if (error) {
        reject(error);
      } else {
        const items = JSON.parse(data);
        const item = items.find((i) => i.id === parseInt(id));
        if (!item) {
          reject(`Item with id '${id}' not found.`);
        } else {
          resolve(item);
        }
      }
    });
  });
}
/**
 * @param {Number} id - "id" of psot you want to update.
 * @param {Object} update - The contents of the body sent in with the PUT request.
 * @param {string} update.name - The name of the "post" creator.
 * @param {string} update.post - The text of the post.
 * @param {string} update.creationTime - The date of the post.
 * @param {string} update.status - The status of the post. Options: "neutral", "liked","disliked".
 */
function updateById(id, update) {
  id = parseInt(id);
  return new Promise((resolve, reject) => {
    if (
      !update.name ||
      !update.post ||
      !update.creationTime ||
      !update.status
    ) {
      reject(
        "Invalid update data. Must include 'name', 'post', 'creationTime', and 'status' keys."
      );
    }
    fs.readFile(filePath, "utf-8", (error, data) => {
      if (error) {
        reject(error);
      } else {
        let items = JSON.parse(data);
        let itemIndex = items.findIndex((i) => parseInt(i.id) === id);
        if (itemIndex === -1) {
          reject(`Item with id '${id}' not found.`);
        } else {
          items[itemIndex] = { id, ...update };
          fs.writeFile(filePath, JSON.stringify(items), (error) => {
            if (error) {
              reject(error);
            } else {
              resolve(update);
            }
          });
        }
      }
    });
  });
}
/**
 * @param {Object} item - The contents of the body sent in with the POST request.
 * @param {string} item.name - The name of the "post" creator.
 * @param {string} item.post - The text of the post.
 * @param {string} item.creationTime - The date of the post.
 * @param {string} item.status - The status of the post. Options: "neutral", "liked","disliked".
 */
function create(item) {
  return new Promise((resolve, reject) => {
    if (!item.name || !item.post || !item.creationTime || !item.status) {
      reject(
        "Invalid item data. Must include 'name', 'post', 'creationTime', and 'status' keys."
      );
    }
    fs.readFile(filePath, "utf-8", (error, data) => {
      if (error) {
        reject(error);
      } else {
        let items = JSON.parse(data);
        item.id = parseInt(items.length + 1);
        items.push(item);
        fs.writeFile(filePath, JSON.stringify(items), (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(item);
          }
        });
      }
    });
  });
}
/**
 * @param {Number} id - "id" of post you want to delete.
 */
function deleteById(id) {
  id = parseInt(id);
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, "utf-8", (error, data) => {
      if (error) {
        reject(error);
      } else {
        let items = JSON.parse(data);
        let itemIndex = items.findIndex((i) => i.id === id);
        if (itemIndex === -1) {
          reject(`Item with id '${id}' not found.`);
        } else {
          let deletedPost = items.splice(itemIndex, 1);
          fs.writeFile(filePath, JSON.stringify(items), (error) => {
            if (error) {
              reject(error);
            } else {
              resolve(deletedPost);
            }
          });
        }
      }
    });
  });
}
module.exports = {
  getAll,
  getById,
  updateById,
  create,
  deleteById,
};
