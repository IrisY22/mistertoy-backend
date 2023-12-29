import { ObjectId } from "mongodb";

import { utilService } from "../../services/util.service.js";
import { loggerService } from "../../services/logger.service.js";
import { dbService } from "../../services/db.service.js";

export const toyService = {
  remove,
  query,
  getById,
  add,
  update,
  addToyMsg,
  removeToyMsg,
};

async function query(filterBy = { txt: "" }) {
  const toys = await getDbArr("toy");
  const regex = new RegExp(filterBy.txt, "i");
  var toysToReturn = toys.filter((toy) => regex.test(toy.name));
  if (filterBy.maxPrice) {
    toysToReturn = toysToReturn.filter((toy) => toy.price <= filterBy.maxPrice);
  }
  if (filterBy.inStock !== "All") {
    toysToReturn = toysToReturn.filter((toy) =>
      filterBy.inStock === "In stock" ? toy.inStock : !toy.inStock
    );
  }

  if (
    filterBy.labels &&
    filterBy.labels.length &&
    !filterBy.labels.includes("All")
  ) {
    toysToReturn = toysToReturn.filter((toy) => {
      const toyLabels = Array.isArray(toy.labels) ? toy.labels : [];
      return toyLabels.some((label) => filterBy.labels.includes(label));
    });
  }

  toysToReturn = sortBy(filterBy.sortBy, toysToReturn);
  return Promise.resolve(toysToReturn);

  // try {
  //   const criteria = {
  //     vendor: { $regex: filterBy.txt, $options: "i" },
  //   };
  //   return toys;
  // } catch (err) {
  //   loggerService.error("cannot find toys", err);
  //   throw err;
  // }
}

async function getDbArr(collectionName) {
  const collection = await dbService.getCollection("toy");
  return await collection.find({}).toArray();
}

async function getById(toyId) {
  try {
    const collection = await dbService.getCollection("toy");
    const toy = await collection.findOne({ _id: new ObjectId(toyId) });
    return toy;
  } catch (err) {
    loggerService.error(`while finding toy ${toyId}`, err);
    throw err;
  }
}

async function remove(toyId) {
  try {
    const collection = await dbService.getCollection("toy");
    await collection.deleteOne({ _id: new ObjectId(toyId) });
  } catch (err) {
    loggerService.error(`cannot remove toy ${toyId}`, err);
    throw err;
  }
}

async function add(toy) {
  try {
    const collection = await dbService.getCollection("toy");
    await collection.insertOne(toy);
    return toy;
  } catch (err) {
    loggerService.error("cannot insert toy", err);
    throw err;
  }
}

async function update(toy) {
  try {
    const toyToSave = {
      vendor: toy.vendor,
      price: toy.price,
    };
    const collection = await dbService.getCollection("toy");
    await collection.updateOne(
      { _id: new ObjectId(toy._id) },
      { $set: toyToSave }
    );
    return toy;
  } catch (err) {
    loggerService.error(`cannot update toy ${toy._id}`, err);
    throw err;
  }
}

async function addToyMsg(toyId, msg) {
  try {
    msg.id = utilService.makeId();
    const collection = await dbService.getCollection("toy");
    await collection.updateOne(
      { _id: new ObjectId(toyId) },
      { $push: { msgs: msg } }
    );
    return msg;
  } catch (err) {
    loggerService.error(`cannot add toy msg ${toyId}`, err);
    throw err;
  }
}

async function removeToyMsg(toyId, msgId) {
  try {
    const collection = await dbService.getCollection("toy");
    await collection.updateOne(
      { _id: new ObjectId(toyId) },
      { $pull: { msgs: { id: msgId } } }
    );
    return msgId;
  } catch (err) {
    loggerService.error(`cannot add toy msg ${toyId}`, err);
    throw err;
  }
}

function sortBy(sort, unorderedToys) {
  if (sort === "name") {
    return sortByName(unorderedToys);
  } else if (sort === "price") {
    return sortByPrice(unorderedToys);
  } else if (sort === "createdAt") {
    return sortByCreatedAt(unorderedToys);
  }
}

function sortByName(arr) {
  return arr.sort((a, b) => {
    const nameA = a.name.toUpperCase();
    const nameB = b.name.toUpperCase();

    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    return 0;
  });
}

function sortByPrice(arr) {
  return arr.sort((a, b) => {
    if (a.price < b.price) {
      return -1;
    }
    if (a.price > b.price) {
      return 1;
    }
    return 0;
  });
}

function sortByCreatedAt(arr) {
  return arr.sort((a, b) => {
    if (a.createdAt < b.createdAt) {
      return 1;
    }
    if (a.createdAt > b.createdAt) {
      return -1;
    }
    return 0;
  });
}
