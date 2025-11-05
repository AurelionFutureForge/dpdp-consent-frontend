import { NextRequest, NextResponse } from "next/server";

// Simple in-memory store for error messages (cleared after reading)
const errorStore = new Map<string, { message: string; timestamp: number }>();

// Clean up old errors (older than 60 seconds)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of errorStore.entries()) {
    if (now - value.timestamp > 60000) {
      errorStore.delete(key);
    }
  }
}, 30000); // Clean every 30 seconds

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { errorId, message } = body;

    if (!errorId || !message) {
      return NextResponse.json({ success: false, error: "Missing errorId or message" }, { status: 400 });
    }

    errorStore.set(errorId, { message, timestamp: Date.now() });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to store error" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const errorId = searchParams.get("errorId");

    if (errorId) {
      // Fetch specific error by ID
      const error = errorStore.get(errorId);
      if (error) {
        // Delete after reading (one-time use)
        errorStore.delete(errorId);
        return NextResponse.json({ success: true, message: error.message });
      }
      return NextResponse.json({ success: false, message: null });
    } else {
      // No errorId provided - return the most recent error
      if (errorStore.size === 0) {
        return NextResponse.json({ success: false, message: null });
      }

      // Get the most recent error (highest timestamp)
      let mostRecent: { id: string; message: string; timestamp: number } | null = null;
      for (const [id, error] of errorStore.entries()) {
        if (!mostRecent || error.timestamp > mostRecent.timestamp) {
          mostRecent = { id, message: error.message, timestamp: error.timestamp };
        }
      }

      if (mostRecent) {
        // Delete after reading (one-time use)
        errorStore.delete(mostRecent.id);
        return NextResponse.json({ success: true, message: mostRecent.message });
      }

      return NextResponse.json({ success: false, message: null });
    }
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to retrieve error" }, { status: 500 });
  }
}

