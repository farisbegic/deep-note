"use server";

import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import firestore from "../config";
import { revalidatePath } from "next/cache";

const add = async (name, data, id = null) => {
  const docRef = id ? doc(firestore, name, id) : collection(firestore, name);

  let result = null;
  let error = null;

  try {
    id
      ? await setDoc(docRef, data, { merge: true })
      : await addDoc(docRef, data);
    result = docRef.id;
    revalidatePath("/");
  } catch (e) {
    error = e.message;
  }

  return { result, error };
};

export default add;
