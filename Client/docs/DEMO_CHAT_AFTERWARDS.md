# Student Demo Chat — How to Do This Technically After Demo

The **Student demo chat** (floating icon bottom-left, 10-second delayed reply about “recent mathematics”) is **demo-only**. Here is how to replace it with a real implementation.

---

## What Exists Today (Demo)

- **Component:** `Client/src/components/student/StudentDemoChat.tsx`
- **Visibility:** Rendered only when `user.role === 'student'` (see `App.tsx`).
- **Behaviour:** 
  - User types a message; after **10 seconds** a loading state is shown, then a **hardcoded** reply.
  - If the message matches “math / mathematics / recent / learn” etc., the reply is a fixed “recent mathematics” recap; otherwise a generic demo message.
- **No backend:** All logic is in the frontend (setTimeout + static strings).

---

## How to Do It Properly After Demo

### 1. Backend: Real API or Real-Time Channel

Choose one (or combine):

**Option A — REST API (simplest)**  
- Add an endpoint, e.g. `POST /api/v0/chat` or `POST /api/v0/study-assistant/message`.
- Request: `{ message: string, studentId?: number, context?: { courseId, subject } }`.
- Response: `{ reply: string }`.
- Server can:
  - Call an **LLM API** (OpenAI, Claude, etc.) with a system prompt like “You are a study assistant. Summarize what was recently covered in mathematics for this student.”
  - Or use a **RAG** flow: fetch recent course/assignment/grades for the student and inject into the prompt, then return the model reply.

**Option B — WebSockets (real-time, optional)**  
- Add a WebSocket server (e.g. NestJS `@WebSocketGateway`).
- Client connects when the student opens the chat; sends messages over the socket.
- Server streams or sends a single reply (e.g. from an LLM) so you can show “typing…” or progressive text instead of a fixed 10s delay.

**Option C — Third-party chat/AI widget**  
- Replace the custom UI with a provider (e.g. Intercom, Crisp, or an embedded AI chat SDK) and configure a “study assistant” bot that uses your API or LLM.

---

### 2. Frontend: Replace Demo Logic With API/WebSocket

- **Keep:** `StudentDemoChat.tsx` layout (floating button, bottom-left, panel, input, message list). Keep `visible={user?.role === 'student'}` in `App.tsx`.
- **Replace:**
  - Remove the 10-second `setTimeout` and the hardcoded `DEMO_REPLY_*` strings.
  - On “Send”:
    - Call your `POST /chat` (or equivalent) with the current message (and optionally `studentId` / `courseId` from auth/course context).
    - Show a loading state (“Thinking…” or a typing indicator) while the request is in progress.
    - On success, append the API `reply` to the messages.
  - If you use WebSockets, open the socket when the chat is opened (and optionally when `user.role === 'student'`), send the message on the socket, and append the reply when the server sends it (with or without streaming).

---

### 3. Auth and Context

- Send **JWT** (or session) with the request so the backend knows the student.
- Optionally send **course/subject context** (e.g. “Mathematics”, or current course id) so the assistant can say “recently in mathematics” with real data (e.g. from assignments/grades).

---

### 4. Data: “Recent Things We Learned”

- **Demo:** The reply is a static paragraph.
- **Real:** Backend should derive “recent” from your data, for example:
  - **Assignments** and **grades** for the student (by course/subject and date).
  - **Course syllabus** or **lesson plans** if you store them.
- Then either:
  - Build a short summary in code and return it, or  
  - Pass this context into an LLM prompt (e.g. “Given these recent assignments and grades, summarize what the student has been learning in mathematics”) and return the model’s reply.

---

### 5. Summary Checklist

| Step | Action |
|------|--------|
| Backend | Add `POST /chat` (or WebSocket) that accepts the student message and returns a reply (from LLM or from your own “recent learning” logic). |
| Backend | Use auth to identify the student and optionally load recent courses/assignments/grades. |
| Frontend | In `StudentDemoChat.tsx`, replace `setTimeout` + demo strings with a call to the new API (or WebSocket). |
| Frontend | Show loading state while waiting for the reply. |
| Optional | Add rate limiting, abuse protection, and PII handling for production. |

After that, the same UI can stay; only the source of the reply changes from “demo after 10 seconds” to “real API/WebSocket reply.”
