import Person from "../models/personSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sessionWithTransaction } from "../utils/sessionWithTransaction.js";

// ADD NEW PERSON (no connections)
export const addPerson = asyncHandler(async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      birthName,
      birthDate,
      deathDate,
      parents,
      spouses,
      siblings,
      children,
    } = req.body;
    const newPerson = new Person({
      firstName,
      lastName,
      birthName,
      birthDate,
      deathDate,
      parents,
      spouses,
      siblings,
      children,
    });
    const savedPerson = await newPerson.save();
    res.status(201).json({
      message: `${newPerson.firstName} ${newPerson.lastName} has been added succesfully`,
      savedPerson,
    });
  } catch (error) {
    // res.status(400).json({ error: error.message });
    next(error);
  }
});

// GET ALL PEOPLE
export const getAll = asyncHandler(async (req, res, next) => {
  try {
    const people = await Person.find();
    res.status(200).json(people);
  } catch (error) {
    // res.status(500).json({ error: error.message });
    next(error);
  }
});

// GET ONE PERSON BY ID
export const getOneByID = asyncHandler(async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }
    res.status(200).json(person);
  } catch (error) {
    // res.status(500).json({ error: error.message });
    next(error);
  }
});

// UPDATE WNOLE PERSON DATA
export const updatePersonProfile = sessionWithTransaction(
  async (req, res, next, session) => {
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    ).session(session);
    if (!updatedPerson) {
      throw new Error("Person not found");
    }
    res.status(200).json({
      message: `${updatedPerson.firstName} ${updatedPerson.lastName} has been updated successfully!`,
    });
  }
);

// DELETE PERSON BY ID
export const deleteByID = asyncHandler(async (req, res, next) => {
  try {
    const deletePerson = await Person.findByIdAndDelete(req.params.id);
    if (!deletePerson) {
      return res.status(404).json({ message: "Person not found" });
    }
    res.status(200).json({ message: "Person deleted successfully" });
  } catch (error) {
    // res.status(500).json({ error: error.message });
    next(error);
  }
});

// CLEAR ALL ENTRIES
export const deleteAll = asyncHandler(async (req, res, next) => {
  try {
    const result = await Person.deleteMany({});
    res.status(200).json({
      message: "All entries have been successfully deleted",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    // res.status(500).json({ error: error.message });
    next(error);
  }
});

// PERSONAL RELATIONS ROUTES FOR EXISTING PERSON ENTRIES

// ADD A PARENT TO A PERSON
export const addParent = sessionWithTransaction(
  async (req, res, next, session) => {
    const { parentId } = req.body;
    if (!parentId) {
      return res.status(400).json({ message: "Parent ID is required" });
    }

    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    const parent = await Person.findById(parentId);
    if (!parent) {
      return res.status(404).json({ message: "Parent not found" });
    }

    if (person.parents.includes(parent._id)) {
      return res.status(400).json({
        message: `${parent.firstName} ${parent.lastName} is already parent of ${person.firstName} ${person.lastName}`,
      });
    }

    person.parents.push(parent._id);
    await person.save({ session });

    if (parent.children.includes(person._id)) {
      return res.status(400).json({
        message: `${person.firstName} ${person.lastName} is already child of ${parent.firstName} ${parent.lastName}`,
      });
    }

    parent.children.push(person._id);
    await parent.save({ session });

    res.status(200).json({
      message: `Child: ${person.firstName} ${person.lastName} added successfully to Parent: ${parent.firstName} ${parent.lastName} and vice versa`,
    });
  }
);

// ADD A SPOUSE TO A PERSON
export const addSpouse = sessionWithTransaction(
  async (req, res, next, session) => {
    const { spouseId } = req.body;
    if (!spouseId) {
      return res.status(400).json({ message: "Spouse ID is required" });
    }

    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    const spouse = await Person.findById(spouseId);
    if (!spouse) {
      return res.status(404).json({ message: "Spouse not found" });
    }

    if (person.spouses.includes(spouse._id)) {
      return res.status(400).json({
        message: `${spouse.firstName} ${spouse.lastName} is already spouse of ${person.firstName} ${person.lastName}`,
      });
    }

    person.spouses.push(spouse._id);
    await person.save({ session });

    if (spouse.spouses.includes(person._id)) {
      return res.status(400).json({
        message: `${person.firstName} ${person.lastName} is already spouse of ${spouse.firstName} ${spouse.lastName}`,
      });
    }

    spouse.spouses.push(person._id);
    await spouse.save({ session });

    res.status(200).json({
      message: `Spouse: ${person.firstName} ${person.lastName} added successfully to Spouse: ${spouse.firstName} ${spouse.lastName} and vice versa`,
    });
  }
);

// ADD A SIBLING TO A PERSON
export const addSibling = sessionWithTransaction(
  async (req, res, next, session) => {
    const { siblingId } = req.body;
    if (!siblingId) {
      return res.status(400).json({ message: "Sibling ID is required" });
    }

    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: "Person not found" });
    }

    const sibling = await Person.findById(siblingId);
    if (!sibling) {
      return res.status(404).json({ message: "Sibling not found" });
    }

    if (person.siblings.includes(sibling._id)) {
      return res.status(400).json({
        message: `${sibling.firstName} ${sibling.lastName} is already sibling of ${person.firstName} ${person.lastName}`,
      });
    }

    person.siblings.push(sibling._id);
    await person.save({ session });

    if (sibling.siblings.includes(person._id)) {
      return res.status(400).json({
        message: `${person.firstName} ${person.lastName} is already sibling of ${sibling.firstName} ${sibling.lastName}`,
      });
    }

    sibling.siblings.push(person._id);
    await sibling.save({ session });

    res.status(200).json({
      message: `Sibling: ${person.firstName} ${person.lastName} added successfully to Sibling: ${sibling.firstName} ${sibling.lastName} and vice versa`,
    });
  }
);

// ADD A CHILD TO A PERSON
export const addChild = sessionWithTransaction(
  async (req, res, next, session) => {
    const { childId } = req.body;
    if (!childId) {
      return res.status(400).json({ message: "Child ID is required" });
    }

    const person = await Person.findById(req.params.id);
    if (!person) {
      return res.status(404).json({ message: "Person (Parent) not found" });
    }

    const child = await Person.findById(childId);
    if (!child) {
      return res.status(404).json({ message: "Child not found" });
    }

    if (person.children.includes(child._id)) {
      return res.status(400).json({
        message: `${child.firstName} ${child.lastName} is already child of ${person.firstName} ${person.lastName}`,
      });
    }

    person.children.push(child._id);
    await person.save({ session });

    if (child.parents.includes(person._id)) {
      return res.status(400).json({
        message: `${person.firstName} ${person.lastName} is already parent of ${child.firstName} ${child.lastName}`,
      });
    }

    child.parents.push(person._id);
    await child.save({ session });

    res.status(200).json({
      message: `Parent: ${person.firstName} ${person.lastName} added successfully to Child: ${child.firstName} ${child.lastName} and vice versa`,
    });
  }
);

// ADDING NEW PEOPLE TO EXISTING PEOPLE AS X

// ADD NEW PARENT TO AN EXISTING PERSON
export const addNewParent = sessionWithTransaction(
  async (req, res, next, session) => {
    const person = await Person.findById(req.params.id).session(session);
    if (!person) {
      throw new Error("Existing person not found");
    }

    const { firstName, lastName, birthName, birthDate, deathDate, gender } =
      req.body;

    // Create the new Person (parent)
    const newParent = new Person({
      firstName,
      lastName,
      birthName,
      birthDate,
      deathDate,
      gender,
      children: [person._id], // adds parent part
    });

    const savedParent = await newParent.save({ session });

    // adds the new person as a parent of the existing child
    person.parents.push(savedParent._id);
    await person.save({ session });

    res.status(201).json({
      message: `Parent added successfully to ${person.firstName} ${person.lastName}`,
      parent: savedParent,
    });
  }
);

// ADD NEW SPOUSE TO AN EXISTING PERSON
export const addNewSpouse = sessionWithTransaction(
  async (req, res, next, session) => {
    const person = await Person.findById(req.params.id).session(session);
    if (!person) {
      throw new Error("Existing person not found");
    }
    const { firstName, lastName, birthName, birthDate, deathDate, gender } =
      req.body;
    // Create the new Person (spouse)
    const newSpouse = new Person({
      firstName,
      lastName,
      birthName,
      birthDate,
      deathDate,
      gender,
      spouses: [person._id],
    });

    const savedSpouse = await newSpouse.save({ session });

    // adds the new person as a child of the existing parent
    person.spouses.push(savedSpouse._id);
    await person.save({ session });

    res.status(201).json({
      message: `Spouse added successfully to ${person.firstName} ${person.lastName}`,
      spouse: savedSpouse,
    });
  }
);

// ADD NEW SIBLING TO AN EXISTING PERSON
export const addNewSibling = sessionWithTransaction(
  async (req, res, next, session) => {
    const person = await Person.findById(req.params.id).session(session);
    if (!person) {
      throw new Error("Existing person not found");
    }
    const { firstName, lastName, birthName, birthDate, deathDate, gender } =
      req.body;
    // Create the new Person (sibling)
    const newSibling = new Person({
      firstName,
      lastName,
      birthName,
      birthDate,
      deathDate,
      gender,
      siblings: [person._id], // adds sibling part
    });

    const savedSibling = await newSibling.save({ session });

    // adds the new person as a sibling of the existing parent
    person.siblings.push(savedSibling._id);
    await person.save({ session });

    res.status(201).json({
      message: `Sibling added successfully to ${person.firstName} ${person.lastName}`,
      person: savedSibling,
    });
  }
);

// ADD NEW CHILD TO AN EXISTING PERSON
export const addNewChild = sessionWithTransaction(
  async (req, res, next, session) => {
    const person = await Person.findById(req.params.id).session(session);
    if (!person) {
      throw new Error("Existing person not found");
    }
    const { firstName, lastName, birthName, birthDate, deathDate, gender } =
      req.body;

    // Create the new Person (child)
    const newChild = new Person({
      firstName,
      lastName,
      birthName,
      birthDate,
      deathDate,
      gender,
      parents: [person._id], // adds parent part
    });

    const savedChild = await newChild.save({ session });

    // adds the new person as a child of the existing parent
    person.children.push(savedChild._id);
    await person.save({ session });

    res.status(201).json({
      message: `Child added successfully to ${person.firstName} ${person.lastName}`,
      child: savedChild,
    });
  }
);

// FAMILY TREE CREATION PART

// Getting the oldest Ancestor
export const getOldestAncestor = asyncHandler(async (req, res, next) => {
  try {
    const ancestors = await Person.find({ parents: { $size: 0 } });

    // Ensure we have ancestors before reducing
    if (ancestors.length === 0) {
      return res.status(404).json({ error: "No ancestors found" });
    }

    const oldestAncestor = ancestors.reduce((oldest, person) => {
      return !oldest || new Date(person.birthDate) < new Date(oldest.birthDate)
        ? person
        : oldest;
    }, null);
    res.status(200).json(oldestAncestor);
  } catch (error) {
    next(error);
  }
});

// Function to construct the tree
const getAncestors = async (personId) => {
  const person = await Person.findById(personId).populate({
    path: "children spouses siblings",
    populate: { path: "spouses", model: "Person" }, // Fetch spouses of siblings too
  });
  if (!person) return null;

  return {
    name: `${person.firstName} ${person.lastName}`,
    spouses: await Promise.all(
      person.spouses.map(async (spouse) => ({
        name: `${spouse.firstName} ${spouse.lastName}`,
        id: spouse._id,
        children: await Promise.all(
          spouse.children.map((child) => getAncestors(child._id))
        ), // Fetch spouse's children too
      }))
    ),

    siblings: person.siblings.map((sibling) => ({
      name: `${sibling.firstName} ${sibling.lastName}`,
      id: sibling._id,
    })),

    children: await Promise.all(
      person.children.map((child) => getAncestors(child._id))
    ),
  };
};

// Get the Tree Data
export const getFamilyTree = asyncHandler(async (req, res, next) => {
  try {
    const ancestors = await Person.find({ parents: { $size: 0 } });

    if (ancestors.length === 0) {
      return res.status(404).json({ error: "Ancestors not found" });
    }

    const rootAncestor = await ancestors.reduce((oldest, person) => {
      return !oldest || new Date(person.birthDate) < new Date(oldest.birthDate)
        ? person
        : oldest;
    }, null);

    if (!rootAncestor) {
      return res.status(404).json({ error: "Root ancestor not found" });
    }

    const treeData = await getAncestors(rootAncestor._id);
    res.json(treeData);
  } catch (error) {
    next(error);
  }
});

// const findPrimaryAncestor = async () => {
//   const potentialRoots = await Person.find({ parents: { $size: 0 } });

//   if (potentialRoots.length === 0) {
//     console.error("No potential roots found");
//     return null;
//   }

//   const oldest = potentialRoots.reduce(
//     (oldest, person) =>
//       !oldest || new Date(person.birthDate) < new Date(oldest.birthDate)
//         ? person
//         : oldest,
//     null
//   );

//   console.log("Primary ancestor selected:", oldest?._id);
//   return oldest;
// };

// const getAncestors = async (personId) => {
//   console.log("Fetching person with ID:", personId); // Debugging line
//   const person = await Person.findById(personId).populate("children spouses");
//   if (!person) return null;

//   return {
//     name: `${person.firstName} ${person.lastName}`,
//     children: await Promise.all(
//       person.children.map((child) => getAncestors(child._id))
//     ),
//   };
// };

// export const getFamilyTree = asyncHandler(async (req, res, next) => {
//   try {
//     const rootAncestor = await findPrimaryAncestor();

//     if (!rootAncestor || !rootAncestor._id) {
//       return res.status(404).json({ error: "No valid root ancestor found" });
//     }

//     const treeData = await getAncestors(rootAncestor._id);
//     res.json(treeData);
//   } catch (error) {
//     console.error("Error in getFamilyTree:", error);
//     next(error);
//   }
// });
