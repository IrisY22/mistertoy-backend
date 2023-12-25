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
    "http://127.0.0.1:5173",
    "http://localhost:5173",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Toy LIST
app.get("/api/toy", (req, res) => {
  const filterBy = {
    txt: req.query.txt || "",
    maxPrice: +req.query.maxPrice || 0,
  };
  toyService
    .query(filterBy)
    .then((toy) => {
      res.send(toy);
    })
    .catch((err) => {
      loggerService.error("Cannot get toy", err);
      res.status(400).send("Cannot get toy");
    });
});

// Toy READ
app.get("/api/toy/:toyId", (req, res) => {
  const { toyId } = req.params;
  toyService
    .getById(toyId)
    .then((toy) => {
      res.send(toy);
    })
    .catch((err) => {
      loggerService.error("Cannot get toy", err);
      res.status(400).send("Cannot get toy");
    });
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

app.post("/api/toy", (req, res) => {
  const toy = {
    name: req.body.name,
    price: +req.body.price,
    inStock: req.body.inStock,
  };
  toyService
    .save(toy)
    .then((savedToy) => {
      savedToy.msg = "Toy has been added succesfully";
      res.send(savedToy);
    })
    .catch((err) => {
      res.status(400).send("Cannot save toy");
    });
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
app.put("/api/toy", (req, res) => {
  const toy = {
    name: req.body.name,
    price: +req.body.price,
    inStock: req.body.inStock,
  };
  toyService
    .save(toy)
    .then((savedToy) => {
      savedToy.msg = "Toy has been updated succesfully";
      res.send(savedToy);
    })
    .catch((err) => {
      res.status(400).send("Cannot save toy");
    });
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
  toyService
    .remove(toyId)
    .then(() => {
      savedToy.msg = "Toy has been removes succesfully";
      res.send("Removed!");
    })
    .catch((err) => {
      res.status(400).send("Cannot remove toy");
    });
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
