export function unserializePhp(value) {
  const source = Buffer.from(value, "utf8");
  let cursor = 0;

  function expect(character) {
    if (String.fromCharCode(source[cursor]) !== character) {
      throw new Error(`Expected '${character}' at byte ${cursor}.`);
    }
    cursor += 1;
  }

  function readUntil(character) {
    const start = cursor;
    const target = character.charCodeAt(0);
    while (cursor < source.length && source[cursor] !== target) cursor += 1;
    if (cursor >= source.length) {
      throw new Error(`Missing '${character}' after byte ${start}.`);
    }
    const result = source.subarray(start, cursor).toString("utf8");
    cursor += 1;
    return result;
  }

  function readValue() {
    const type = String.fromCharCode(source[cursor++]);
    expect(":");

    if (type === "N") return null;
    if (type === "b") return readUntil(";") === "1";
    if (type === "i") return Number.parseInt(readUntil(";"), 10);
    if (type === "d") return Number.parseFloat(readUntil(";"));

    if (type === "s") {
      const length = Number.parseInt(readUntil(":"), 10);
      expect('"');
      const result = source.subarray(cursor, cursor + length).toString("utf8");
      cursor += length;
      expect('"');
      expect(";");
      return result;
    }

    if (type === "a") {
      const length = Number.parseInt(readUntil(":"), 10);
      expect("{");
      const entries = [];
      for (let index = 0; index < length; index += 1) {
        entries.push([readValue(), readValue()]);
      }
      expect("}");
      const sequential = entries.every(([key], index) => key === index);
      return sequential
        ? entries.map(([, entry]) => entry)
        : Object.fromEntries(entries.map(([key, entry]) => [String(key), entry]));
    }

    throw new Error(`Unsupported PHP serialization type '${type}'.`);
  }

  const parsed = readValue();
  if (cursor !== source.length) {
    throw new Error(`Unexpected trailing data at byte ${cursor}.`);
  }
  return parsed;
}
