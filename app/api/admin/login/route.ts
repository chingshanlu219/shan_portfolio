import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, setAdminSession } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;
    if (!password) {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }
    if (verifyAdminPassword(password)) {
      await setAdminSession();
      return NextResponse.json({ success: true });
    }
    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Failed to login" },
      { status: 500 }
    );
  }
}
