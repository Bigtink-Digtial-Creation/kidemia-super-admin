import { atomWithStorage } from "jotai/utils";

export const subjectTitleAtom = atomWithStorage<string | null>(
  "subjectTitle",
  null,
);

export const subjectQuestonTitleAtom = atomWithStorage<string | null>(
  "subjectQuestionTitle",
  null,
);
