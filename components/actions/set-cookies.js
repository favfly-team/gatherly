"use server";

import { cookies } from "next/headers";

export async function setCookie(name, value) {
  const cookieStore = await cookies();

  cookieStore.set(name, value, { secure: true });
}

export async function getCookie(name) {
  const cookieStore = await cookies();

  return cookieStore.get(name);
}
