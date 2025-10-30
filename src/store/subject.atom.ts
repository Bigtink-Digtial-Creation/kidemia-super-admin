import { atomWithStorage } from "jotai/utils";

export const subjectTitleAtom = atomWithStorage<string | null>(
  "subjectTitle",
  null,
);
