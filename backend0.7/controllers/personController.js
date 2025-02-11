import Person from "../models/personSchema.js";
import asyncHandler from "../utils/asyncHandler.js";
import { sessionWithTransaction } from "../utils/sessionWithTransaction.js";
import { formatDate } from "../utils/formatDate.js";

// ADD NEW PERSON (no connections)

export const addPerson = asyncHandler(async (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      birthDate,
      deathDate,
      gender,
      parents,
      children,
    } = req.body;
    const newPerson = new Person({
      firstName,
      lastName,
      birthDate,
      deathDate,
      gender,
      parents,
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

// // UPDATE WNOLE PERSON DATA
// export const updatePersonProfile = sessionWithTransaction(
//   async (req, res, next, session) => {
//     const updatedPerson = await Person.findByIdAndUpdate(
//       req.params.id,
//       req.body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     ).session(session);
//     if (!updatedPerson) {
//       throw new Error("Person not found");
//     }
//     res.status(200).json({
//       message: `${updatedPerson.firstName} ${updatedPerson.lastName} has been updated successfully!`,
//     });
//   }
// );

// DELETE PERSON BY ID
export const deleteByID = asyncHandler(async (req, res, next) => {
  try {
    const deletePerson = await Person.findByIdAndDelete(req.params.id);
    if (!deletePerson) {
      return res.status(404).json({ message: "Person not found" });
    }
    res.status(200).json({ message: "Person deleted successfully" });
  } catch (error) {
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
    next(error);
  }
});

// // CONTROLLERS FOR EXISTING PEOPLE
// // ADD A PARENT TO A PERSON
// export const addParent = sessionWithTransaction(
//   async (req, res, next, session) => {
//     const { parentId } = req.body;
//     if (!parentId) {
//       return res.status(400).json({ message: "Parent ID is required" });
//     }

//     const person = await Person.findById(req.params.id).session(session);
//     if (!person) {
//       return res.status(404).json({ message: "Person not found" });
//     }

//     const parent = await Person.findById(parentId).session(session);
//     if (!parent) {
//       return res.status(404).json({ message: "Parent not found" });
//     }

//     if (person.parents.includes(parent._id)) {
//       return res.status(400).json({
//         message: `${parent.firstName} ${parent.lastName} is already the parent of ${person.firstName} ${person.lastName}`,
//       });
//     }

//     person.parents.push(parent._id);
//     parent.children.push(person._id);

//     await Promise.all([person.save({ session }), parent.save({ session })]);

//     res.status(200).json({
//       message: `Child: ${person.firstName} ${person.lastName} added successfully to Parent: ${parent.firstName} ${parent.lastName} and vice versa`,
//     });
//   }
// );

// // ADD A CHILD TO A PERSON
// export const addChild = sessionWithTransaction(
//   async (req, res, next, session) => {
//     const { childId } = req.body;
//     if (!childId) {
//       return res.status(400).json({ message: "Child ID is required" });
//     }

//     const person = await Person.findById(req.params.id).session(session);
//     if (!person) {
//       return res.status(404).json({ message: "Person (Parent) not found" });
//     }

//     const child = await Person.findById(childId).session(session);
//     if (!child) {
//       return res.status(404).json({ message: "Child not found" });
//     }

//     if (person.children.includes(child._id)) {
//       return res.status(400).json({
//         message: `${child.firstName} ${child.lastName} is already child of ${person.firstName} ${person.lastName}`,
//       });
//     }

//     person.children.push(child._id);
//     child.parents.push(person._id);

//     await Promise.all([child.save({ session }), person.save({ session })]);

//     res.status(200).json({
//       message: `Parent: ${person.firstName} ${person.lastName} added successfully to Child: ${child.firstName} ${child.lastName} and vice versa`,
//     });
//   }
// );

// // CONTROLLERS FOR ADDING NEW PEOPLE AS "X" TO EXISTING PEOPLE
// // ADD NEW PARENT TO AN EXISTING PERSON

// export const addNewParent = sessionWithTransaction(
//   async (req, res, next, session) => {
//     const person = await Person.findById(req.params.id).session(session);
//     if (!person) {
//       throw new Error("Existing person not found");
//     }

//     const { firstName, lastName, birthDate, deathDate, gender } = req.body;

//     // Create the new Person (parent)
//     const newParent = new Person({
//       firstName,
//       lastName,
//       birthDate,
//       deathDate,
//       gender,
//       children: [person._id], // adds parent part
//     });

//     const savedParent = await newParent.save({ session });

//     // adds the new person as a parent of the existing child
//     person.parents.push(savedParent._id);
//     await person.save({ session });

//     res.status(201).json({
//       message: `Parent added successfully to ${person.firstName} ${person.lastName}`,
//       parent: savedParent,
//     });
//   }
// );

// // ADD NEW CHILD TO AN EXISTING PERSON
// export const addNewChild = sessionWithTransaction(
//   async (req, res, next, session) => {
//     const person = await Person.findById(req.params.id).session(session);
//     if (!person) {
//       throw new Error("Existing person not found");
//     }
//     const { firstName, lastName, birthDate, deathDate, gender } = req.body;

//     // Create the new Person (child)
//     const newChild = new Person({
//       firstName,
//       lastName,
//       birthDate,
//       deathDate,
//       gender,
//       parents: [person._id], // adds parent part
//     });

//     const savedChild = await newChild.save({ session });

//     // adds the new person as a child of the existing parent
//     person.children.push(savedChild._id);
//     await person.save({ session });

//     res.status(201).json({
//       message: `Child added successfully to ${person.firstName} ${person.lastName}`,
//       child: savedChild,
//     });
//   }
// );

// // BUILDING THE FAMILY TREE

// export const buildFamilyTree = asyncHandler(async (req, res, next) => {
//   try {
//     const ancestors = await Person.find({ parents: { $size: 0 } }).populate(
//       "children"
//     );

//     if (ancestors.length === 0) {
//       return res.status(404).json({
//         error: "Keine Vorfahren gefunden. Vielleicht sind sie alle im Urlaub?",
//       });
//     }

//     const oldestAncestor = ancestors.reduce((oldest, person) => {
//       return !oldest || new Date(person.birthDate) < new Date(oldest.birthDate)
//         ? person
//         : oldest;
//     }, null);

//     const familyTree = await buildFamilyTreeRecursive(oldestAncestor);

//     res.status(200).json(familyTree);
//   } catch (error) {
//     next(error);
//   }
// });

// const buildFamilyTreeRecursive = async (ancestor) => {
//   // Populate the children for the current ancestor
//   const populatedAncestor = await Person.findById(ancestor._id).populate(
//     "children"
//   );
//   return {
//     id: `${populatedAncestor._id}`,
//     firstName: `${populatedAncestor.firstName}`,
//     lastName: `${populatedAncestor.lastName}`,
//     birthDate: formatDate(populatedAncestor.birthDate),
//     deathDate: formatDate(populatedAncestor.deathDate),
//     gender: `${populatedAncestor.gender}`,
//     children: await Promise.all(
//       (populatedAncestor.children || []).map((child) =>
//         buildFamilyTreeRecursive(child)
//       )
//     ),
//   };
// };
