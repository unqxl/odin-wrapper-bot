import { Message } from "telegramsjs";
import crypto from "node:crypto";

export async function createCollector(
  message: Message,
  filter: (m: Message) => boolean,
) {
  const collector = message.awaitMessage({ max: 1, filter });
  const collected = await collector;
  return collected.length ? collected[0].first() : null;
}

export function hashText(text: string) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}
