import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { toyService } from "./services/toy.service.js";

const app = express();
const port = 3030;

const corsOptions = {
  origin: [
    "http://127.0.0.1:8080",
    "http://localhost:8080",
    "http://127.0.0.1:5175",
    "http://localhost:5175",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello, World!");
// });

// Toy LIST
app.get("/api/toy", async (req, res) => {
  const filterBy = {
    txt: req.query.txt || "",
    maxPrice: +req.query.maxPrice || 0,
    inStock: req.query.inStock || "All",
    sortBy: req.query.sortBy || "name",
    labels: req.query.labels || [],
  };

  try {
    const toys = await toyService.query(filterBy);
    res.send(toys);
  } catch (err) {
    res.status(400).send("Cannot get toy");
  }
  // toyService
  //   .query(filterBy)
  //   .then((toy) => {
  //     res.send(toy);
  //   })
  //   .catch((err) => {
  //     // loggerService.error("Cannot get toy", err);
  //     res.status(400).send("Cannot get toy");
  //   });
});

// Toy READ
app.get("/api/toy/:toyId", async (req, res) => {
  const { toyId } = req.params;
  try {
    const toy = await toyService.getById(toyId);
    res.send(toy);
  } catch (err) {
    loggerService.error("Cannot get toy", err);
    res.status(400).send("Cannot get toy");
  }
  // toyService
  //   .getById(toyId)
  //   .then((toy) => {
  //     res.send(toy);
  //   })
  //   .catch((err) => {
  //     loggerService.error("Cannot get toy", err);
  //     res.status(400).send("Cannot get toy");
  //   });
});

// Toy CREATE
// app.post("/api/toy", (req, res) => {
//   const loggedinUser = userService.validateToken(req.cookies.loginToken);
//   if (!loggedinUser) return res.status(401).send("Cannot add toy");
//   const toy = {
//     name: req.body.name,
//     price: +req.body.price,
//     inStock: req.body.inStock,
//   };
//   toyService
//     .save(toy ,loggedinUser)
//     .then((savedToy) => {
//       res.send(savedToy);
//     })
//     .catch((err) => {
//       loggerService.error("Cannot save toy", err);
//       res.status(400).send("Cannot save toy");
//     });
// });

app.post("/api/toy", async (req, res) => {
  const toy = {
    name: req.body.name,
    price: +req.body.price,
    inStock: req.body.inStock,
  };
  try {
    const savedToy = await toyService.save(toy);
    savedToy.msg = "Toy has been added succesfully";
    res.send(savedToy);
  } catch (err) {
    res.status(400).send("Cannot save toy");
  }
  // toyService
  //   .save(toy)
  //   .then((savedToy) => {
  //     savedToy.msg = "Toy has been added succesfully";
  //     res.send(savedToy);
  //   })
  //   .catch((err) => {
  //     res.status(400).send("Cannot save toy");
  //   });
});

// Toy UPDATE
// app.put("/api/toy", (req, res) => {
//   const loggedinUser = userService.validateToken(req.cookies.loginToken);
//   if (!loggedinUser) return res.status(401).send("Cannot update toy");
//   const toy = {
//     _id: req.body._id,
//     vendor: req.body.vendor,
//     speed: +req.body.speed,
//     price: +req.body.price,
//   };
//   toyService
//     .save(toy, loggedinUser)
//     .then((savedToy) => {
//       res.send(savedToy);
//     })
//     .catch((err) => {
//       loggerService.error("Cannot save toy", err);
//       res.status(400).send("Cannot save toy");
//     });
// });
app.put("/api/toy", async (req, res) => {
  const toy = {
    name: req.body.name,
    price: +req.body.price,
    inStock: req.body.inStock,
  };
  try {
    const savedToy = await toyService.save(toy);
    savedToy.msg = "Toy has been updated succesfully";
    res.send(savedToy);
  } catch {
    res.status(400).send("Cannot save toy");
  }
  // toyService
  //   .save(toy)
  //   .then((savedToy) => {
  //     savedToy.msg = "Toy has been updated succesfully";
  //     res.send(savedToy);
  //   })
  //   .catch((err) => {
  //     res.status(400).send("Cannot save toy");
  //   });
});

// Toy DELETE
// app.delete("/api/toy/:toyId", (req, res) => {
//   const loggedinUser = userService.validateToken(req.cookies.loginToken);
//   loggerService.info("loggedinUser toy delete:", loggedinUser);
//   if (!loggedinUser) {
//     loggerService.info("Cannot remove toy, No user");
//     return res.status(401).send("Cannot remove toy");
//   }

//   const { toyId } = req.params;
//   toyService
//     .remove(toyId, loggedinUser)
//     .then(() => {
//       loggerService.info(`Toy ${toyId} removed`);
//       res.send("Removed!");
//     })
//     .catch((err) => {
//       loggerService.error("Cannot remove toy", err);
//       res.status(400).send("Cannot remove toy");
//     });
// });
app.delete("/api/toy/:toyId", (req, res) => {
  const { toyId } = req.params;
  try {
    toyService.remove(toyId);
    savedToy.msg = "Toy has been removes succesfully";
    res.send("Removed!");
  } catch {
    res.status(400).send("Cannot remove toy");
  }
  // toyService
  //   .remove(toyId)
  //   .then(() => {
  //     savedToy.msg = "Toy has been removes succesfully";
  //     res.send("Removed!");
  //   })
  //   .catch((err) => {
  //     res.status(400).send("Cannot remove toy");
  //   });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
