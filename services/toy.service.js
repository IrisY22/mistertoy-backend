import fs from "fs";
import { utilService } from "./util.service.js";
import { loggerService } from "./logger.service.js";
import { log } from "console";

export const toyService = {
  query,
  getById,
  remove,
  save,
};

const toys = utilService.readJsonFile("data/toy.json");

function query(filterBy) {
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

  if (filterBy.labels && filterBy.labels[0]) {
    toysToReturn = toysToReturn.filter((toy) => {
      console.log(toy.labels);
      return toy.labels.some((label) => filterBy.labels.includes(label));
    });
  }

  toysToReturn = sortBy(filterBy.sortBy, toysToReturn);
  return Promise.resolve(toysToReturn);
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

function getById(toyId) {
  const toy = toys.find((toy) => toy._id === toyId);
  return Promise.resolve(toy);
}

// function remove(toyId, loggedinUser) {
//   const idx = toys.findIndex((toy) => toy._id === toyId);
//   if (idx === -1) return Promise.reject("No Such Toy");
//   const toy = toys[idx];
//   if (!loggedinUser.isAdmin && toy.owner._id !== loggedinUser._id) {
//     return Promise.reject("Not your toy");
//   }
//   toys.splice(idx, 1);
//   return _saveToysToFile();
// }
function remove(toyId) {
  const idx = toys.findIndex((toy) => toy._id === toyId);
  if (idx === -1) return Promise.reject("No Such Toy");
  toys.splice(idx, 1);
  return _saveToysToFile();
}

// function save(toy, loggedinUser) {
//   if (toy._id) {
//     const toyToUpdate = toys.find((currToy) => currToy._id === toy._id);
//     if (!loggedinUser.isAdmin && toyToUpdate.owner._id !== loggedinUser._id) {
//       return Promise.reject("Not your toy");
//     }
//     toyToUpdate.vendor = toy.vendor;
//     toyToUpdate.speed = toy.speed;
//     toyToUpdate.price = toy.price;
//     toy = toyToUpdate;
//   } else {
//     toy._id = utilService.makeId();
//     toy.owner = {
//       fullname: loggedinUser.fullname,
//       score: loggedinUser.score,
//       _id: loggedinUser._id,
//       isAdmin: loggedinUser.isAdmin,
//     };
//     toys.push(toy);
//   }

//   return _saveToysToFile().then(() => toy);
// }
function save(toy) {
  if (toy._id) {
    const toyToUpdate = toys.find((currToy) => currToy._id === toy._id);
    toyToUpdate.name = toy.name;
    toyToUpdate.inStock = toy.inStock;
    toyToUpdate.price = toy.price;
    toy = toyToUpdate;
  } else {
    toy._id = utilService.makeId();
    toys.push(toy);
  }

  return _saveToysToFile().then(() => toy);
}

// function _saveToysToFile() {
//   return new Promise((resolve, reject) => {
//     const data = JSON.stringify(toys, null, 4);
//     fs.writeFile("data/toy.json", data, (err) => {
//       if (err) {
//         loggerService.error("Cannot write to toys file", err);
//         return reject(err);
//       }
//       resolve();
//     });
//   });
// }
function _saveToysToFile() {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(toys, null, 4);
    fs.writeFile("data/toy.json", data, (err) => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
