"use server";

import { doc, deleteDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import firestore from "../config";

const deleteDocument = async (collection, id) => {
  const docRef = doc(firestore, collection, id);

  let result = null;
  let error = null;

  try {
    await deleteDoc(docRef);
    result = true;
    revalidatePath("/");
  } catch (e) {
    error = e;
  }

  return { result, error };
};

export default deleteDocument;
