// One-Sentence Absurd Invention Pitch
// make.fun bounty: u-suroso-69-one-sentence-absurd-invention-pitch-5326c34a
//
// The program writes a single sentence (1-220 characters) pitching a
// ridiculous invention that fixes a tiny everyday annoyance, to
// /output/entry.txt. No network, no secrets, deterministic: the same
// sentence every run, so the two grading runs agree byte for byte.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The pitch. Annoyance: the washing machine always eats one sock.
// Invention: the Ransom Washer, which kidnaps one sock per load and
// only gives it back once it has been paid in compliments. The laugh
// comes from the machine itself behaving like a kidnapper, and the fix
// is silly yet weirdly plausible: flatter the appliance, get the pair back.
// "Unharmed" is the joke's landing: a hostage negotiation over laundry.
const PITCH =
  "Meet the Ransom Washer: a washing machine that kidnaps exactly one sock per load, " +
  "then slides a tiny ransom note under the door demanding one sincere compliment " +
  "before it returns the pair unharmed.";

// The gate: /output/entry.txt must be UTF-8 text of 1 to 220 characters,
// not only white space, and a single sentence. Fail loudly instead of
// writing something the gate would refuse.
function validate(text: string): void {
  const length = [...text].length;
  if (length < 1 || length > 220) {
    throw new Error(`pitch must be 1-220 characters, got ${length}`);
  }
  if (text.trim().length === 0) {
    throw new Error("pitch must not be only white space");
  }
  // Exactly one sentence: one terminal full stop, at the very end, and
  // no other sentence-ending punctuation anywhere in the text.
  const terminators = text.match(/[.!?]/g) ?? [];
  if (terminators.length !== 1 || !text.endsWith(".")) {
    throw new Error("pitch must be exactly one sentence ending in a full stop");
  }
}

function main(): void {
  validate(PITCH);
  const outDir = process.env.OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outFile = join(outDir, "entry.txt");
  // Write the pitch exactly, with no trailing newline: the gate counts
  // every character, and the sentence is the whole file.
  writeFileSync(outFile, PITCH, "utf8");
  // Read it back and re-validate: the two grading runs must agree byte
  // for byte, and a silent write failure must never pass as a valid entry.
  const written = readFileSync(outFile, "utf8");
  if (written !== PITCH) {
    throw new Error("read-back mismatch: entry.txt does not match the pitch");
  }
  validate(written);
  console.log(`wrote ${[...PITCH].length} characters to ${outFile}`);
  console.log(PITCH);
}

main();
