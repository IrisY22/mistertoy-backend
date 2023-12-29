import { loggerService } from "../../services/logger.service.js";
import { toyService } from "./toy.service.js";

//works
export async function getToys(req, res) {
  try {
    const filterBy = {
      txt: req.query.txt || "",
      maxPrice: +req.query.maxPrice || 0,
      inStock: req.query.inStock || "All",
      sortBy: req.query.sortBy || "name",
      labels: req.query.labels || [],
    };

    loggerService.debug("Getting Toys", filterBy);
    const toys = await toyService.query(filterBy);
    res.json(toys);
  } catch (err) {
    loggerService.error("Failed to get toys", err);
    res.status(500).send({ err: "Failed to get toys" });
  }
}

//works
export async function getToyById(req, res) {
  try {
    const toyId = req.params.id;
    const toy = await toyService.getById(toyId);
    res.json(toy);
  } catch (err) {
    loggerService.error("Failed to get toy", err);
    res.status(500).send({ err: "Failed to get toy" });
  }
}

export async function addToy(req, res) {
  const { loggedinUser } = req;

  try {
    const toy = req.body;
    toy.owner = loggedinUser;
    const addedToy = await toyService.add(toy);
    res.json(addedToy);
  } catch (err) {
    loggerService.error("Failed to add toy", err);
    res.status(500).send({ err: "Failed to add toy" });
  }
}

export async function updateToy(req, res) {
  try {
    const toy = req.body;
    const updatedToy = await toyService.update(toy);
    res.json(updatedToy);
  } catch (err) {
    loggerService.error("Failed to update toy", err);
    res.status(500).send({ err: "Failed to update toy" });
  }
}

export async function removeToy(req, res) {
  try {
    const toyId = req.params.id;
    await toyService.remove(toyId);
    res.send();
  } catch (err) {
    loggerService.error("Failed to remove toy", err);
    res.status(500).send({ err: "Failed to remove toy" });
  }
}

export async function addToyMsg(req, res) {
  const { loggedinUser } = req;
  try {
    const toyId = req.params.id;
    const msg = {
      txt: req.body.txt,
      by: loggedinUser,
    };
    const savedMsg = await toyService.addToyMsg(toyId, msg);
    res.json(savedMsg);
  } catch (err) {
    loggerService.error("Failed to update toy", err);
    res.status(500).send({ err: "Failed to update toy" });
  }
}

export async function removeToyMsg(req, res) {
  // const { loggedinUser } = req
  try {
    const toyId = req.params.id;
    const { msgId } = req.params;

    const removedId = await toyService.removeToyMsg(toyId, msgId);
    res.send(removedId);
  } catch (err) {
    loggerService.error("Failed to remove toy msg", err);
    res.status(500).send({ err: "Failed to remove toy msg" });
  }
}
