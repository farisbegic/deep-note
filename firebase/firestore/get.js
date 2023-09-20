"use server";

import { doc, getDoc } from "firebase/firestore";
import firestore from "../config";

const get = async (collection, id) => {
  const docRef = doc(firestore, collection, id);

  let result = null;
  let error = null;

  try {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      result = docSnap.data();
    } else {
      error = "No such document!";
    }
  } catch (e) {
    error = e;
  }

  return { result, error };
};

export default get;
