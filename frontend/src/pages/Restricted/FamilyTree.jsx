import React, { useEffect, useState } from "react";
import Tree from "react-d3-tree";

const FamilyTree = () => {
  const [famData, setFamData] = useState(null);

  const familyData = [
    {
      id: "1",
      name: "John",
      gender: "male",
      spouseId: "2",
      childrenIds: ["3", "5", "7"],
    },
    {
      id: "2",
      name: "Jane",
      gender: "female",
      spouseId: "1",
      childrenIds: ["3", "5", "7"],
    },
    {
      id: "3",
      name: "Alice",
      gender: "female",
      parentIds: ["1", "2"],
      spouseId: "4",
    },
    { id: "4", name: "Damien", gender: "male", spouseId: "3" },
    {
      id: "5",
      name: "Bob",
      gender: "male",
      parentIds: ["1", "2"],
      spouseId: "6",
    },
    { id: "6", name: "Edna", gender: "female", spouseId: "5" },
    {
      id: "7",
      name: "June",
      gender: "female",
      parentIds: ["1", "2"],
      spouseId: "8",
    },
    { id: "8", name: "Bambam", gender: "male", spouseId: "7" },
    {
      id: "9",
      name: "Dio",
      gender: "male",
      parentIds: ["7", "8"],
      spouseId: "12",
    },
    {
      id: "10",
      name: "Drake",
      gender: "male",
      parentIds: ["9", "11"],
      spouseId: "12",
    },
    { id: "11", name: "Erika", gender: "female", spouseId: "9" },
    { id: "12", name: "Rafa", gender: "female", spouseId: "10" },
    {
      id: "13",
      name: "Maria",
      gender: "male",
      spouseId: "14",
      parentIds: ["10", "12"],
    },
    { id: "14", name: "Rafik", gender: "male", spouseId: "13" },
    { id: "15", name: "Berta", gender: "female", parentIds: ["13", "14"] },
    { id: "16", name: "Hans", gender: "male", spouseId: "15" },
  ];

  function transformFamilyData(familyData) {
    const idToNodeMap = new Map();

    // Create nodes for each person and handle spouse relationships
    familyData.forEach((person) => {
      if (!idToNodeMap.has(person.id)) {
        const node = {
          id: person.id,
          name: person.name,
          children: [],
        };
        idToNodeMap.set(person.id, node);

        if (person.spouseId) {
          const spouse = familyData.find((p) => p.id === person.spouseId);
          if (spouse) {
            node.name = `${person.name} & ${spouse.name}`;
            idToNodeMap.set(spouse.id, node); // Map spouse to the same node
          }
        }
      }
    });

    // Map children to their parent nodes
    familyData.forEach((person) => {
      if (person.parentIds) {
        const parentNodeId = `${person.parentIds[0]}-${person.parentIds[1]}`;
        const parentNode = idToNodeMap.get(person.parentIds[0]);
        if (parentNode) {
          const childNode = idToNodeMap.get(person.id);
          if (childNode) {
            parentNode.children.push(childNode);
          }
        }
      }
    });

    // Find the root node (the first node without parents)
    const rootNode = familyData.find((person) => !person.parentIds);
    setFamData(idToNodeMap.get(rootNode.id)); // Set the root node
  }

  useEffect(() => {
    transformFamilyData(familyData);
  }, []);

  const containerStyles = {
    width: "100vw",
    height: "100vh",
  };

  return (
    <div className="w-full h-full">
      <p className="text-3xl text-center pt-6 font-bold">
        This is the Family Tree:
      </p>
      {famData ? (
        <div id="treeWrapper" style={containerStyles}>
          {famData && (
            <Tree
              data={famData}
              translate={{
                x: window.innerWidth / 2.5,
                y: window.innerHeight / 2,
              }}
              pathFunc="elbow"
              orientation="vertical"
            />
          )}
        </div>
      ) : (
        <div>Loading....</div>
      )}
    </div>
  );
};

export default FamilyTree;
