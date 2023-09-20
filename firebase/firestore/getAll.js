"use server";

import { collection, getDocs } from "firebase/firestore";
import firestore from "../config";

const getAll = async (name) => {
  const collectionRef = collection(firestore, name);
  const querySnapshot = await getDocs(collectionRef);

  let result = [];
  querySnapshot.forEach((doc) => {
    result.push({
      id: doc.id,
      ...doc.data(),
    });
  });

  result.sort((a, b) => {
    return a.data.time > b.data.time ? 1 : -1;
  });

  return result;
};

export default getAll;
