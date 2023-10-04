import constants from "@/config/constants";
import { doc, deleteDoc } from "firebase/firestore";
import { revalidatePath } from "next/cache";
import firestore from "@/firebase/config";
import { NextResponse } from "next/server";
import routes from "@/config/routes";

export async function DELETE(req) {
  const name = req.nextUrl.searchParams.get("name");
  const id = req.nextUrl.searchParams.get("id");

  if (!constants.collections[name]) {
    throw new Error("Invalid collection name");
  }

  const docRef = doc(firestore, name, id);

  let result = null;

  try {
    await deleteDoc(docRef);
    revalidatePath(routes.home.path);
    result = true;
  } catch (e) {
    return NextResponse.json({ message: e.message }, { status: 500 });
  }

  return NextResponse.json({ result });
}
