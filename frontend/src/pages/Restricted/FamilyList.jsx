import axios from "axios";
import React from "react";
import { useEffect, useState } from "react";
import { RiParentFill } from "react-icons/ri";
import { MdChildFriendly } from "react-icons/md";
import { GiLinkedRings } from "react-icons/gi";
import { FaChildren } from "react-icons/fa6";

const FamilyList = () => {
  const [listData, setListData] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/person", {
        withCredentials: true,
      });
      console.log("Server Response:", response);

      if (response.data) {
        setListData(response.data);
        console.log(listData);
      } else {
        console.error("Error: Received empty data");
      }
    } catch (error) {
      console.error("Error fetching list:", error);
    }
  };

  useEffect(() => {
    fetchList();
    console.log("List Data Updated", listData);
  }, []);

  useEffect(() => {}, [listData]); // Runs whenever treeData changes

  return (
    <div className="flex flex-col items-center justify-center content-center p-4 min-h-screen ">
      <p className="p-5 text-3xl font-extrabold">
        This is the Family Member List
      </p>
      {listData ? (
        <>
          <ul className="w-3/4">
            {listData.map((person) => (
              <React.Fragment key={person._id}>
                {console.log(person)}
                <li className="p-2 w-full border hover:bg-sky-500 flex flex-row justify-between">
                  <div className="w-3/5">
                    <h2>First Name: {person.firstName}</h2>
                    <p>Last Name: {person.lastName}</p>
                  </div>
                  <div className="flex flex-row justify-around w-2/5 ">
                    <button className="border p-2 flex flex-col items-center">
                      <p>AddParent</p>
                      <RiParentFill size="2em" />
                    </button>
                    <button className="border p-2 flex flex-col items-center">
                      <p>AddSpouse</p>
                      <GiLinkedRings size="2em" />
                    </button>
                    <button className="border p-2 flex flex-col items-center">
                      <p>AddSibling</p>
                      <FaChildren size="2em" />
                    </button>
                    <button className="border p-2 flex flex-col items-center">
                      <p>AddChild</p>
                      <MdChildFriendly size="2em" />
                    </button>
                  </div>
                </li>
              </React.Fragment>
            ))}
          </ul>
        </>
      ) : (
        <p>List is loading....</p>
      )}
    </div>
  );
};

export default FamilyList;
