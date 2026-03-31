# Scenario Practice session fix notes

## Prior repetition root cause
- Saved Scenario Practice state could resume with a stale `currentIndex` that did not match already-answered question IDs.
- That mismatch could surface already-used questions again during an in-progress run.

## Queue strategy
- Each run stores one fixed `questionOrder` queue for the entire session.
- Progress advances by queue index only.
- No missed-question recycling is used in Scenario Practice.

## Persistence
- Persisted state includes queue order, index, answers, and completion status.
- On resume, progress is normalized to the first unanswered question in the stored queue.
- If all queued questions are already answered, the run is marked complete.

## Content safety
- No scenario question/answer/explanation content files were modified.
