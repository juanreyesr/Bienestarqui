export type EvaluationQuestion = { question: string; options: string[]; correctAnswer: number | null };

export const emptyQuestions = (): EvaluationQuestion[] => Array.from({ length: 10 }, () => ({ question: "", options: ["", "", ""], correctAnswer: null }));
const clean = (value: string) => String(value).replace(/\s+/g, " ").trim();

export function importEvaluationQuestions(input: string): { questions?: EvaluationQuestion[]; error?: string } {
  const normalized = input.replace(/\r\n|\r/g, "\n").replace(/(respuesta\s+correcta\s*:\s*[A-F])(?=\s*\d{1,2}\s*[.)]\s)/gi, "$1\n");
  const starts = [...normalized.matchAll(/(?:^|\n)\s*(\d{1,2})\s*[.)]\s*/g)];
  if (starts.length !== 10) return { error: `Se encontraron ${starts.length} preguntas. Deben ser exactamente 10.` };
  for (let index = 0; index < starts.length; index += 1) if (Number(starts[index][1]) !== index + 1) return { error: `La pregunta ${index + 1} debe estar numerada como ${index + 1}.` };
  const questions: EvaluationQuestion[] = [];
  for (let index = 0; index < starts.length; index += 1) {
    const start = (starts[index].index ?? 0) + starts[index][0].length;
    const end = index + 1 < starts.length ? starts[index + 1].index : normalized.length;
    const block = normalized.slice(start, end);
    const answer = /respuesta\s+correcta\s*:\s*([A-F])\b/i.exec(block);
    if (!answer) return { error: `La pregunta ${index + 1} no tiene una 'Respuesta correcta: A-F' válida.` };
    const content = block.slice(0, answer.index);
    const options = [...content.matchAll(/(?:^|\s)([A-F])\)\s*/gi)];
    if (options.length < 3 || options.length > 6) return { error: `La pregunta ${index + 1} debe incluir entre 3 y 6 opciones, de A) a F).` };
    const question = clean(content.slice(0, options[0].index));
    const letters = options.map((option) => option[1].toUpperCase());
    const values = options.map((option, optionIndex) => clean(content.slice((option.index ?? 0) + option[0].length, optionIndex + 1 < options.length ? options[optionIndex + 1].index : content.length)));
    const correctAnswer = letters.indexOf(answer[1].toUpperCase());
    if (!question || values.some((value) => !value) || correctAnswer < 0) return { error: `Completa la pregunta ${index + 1}: enunciado, todas sus opciones y una respuesta correcta.` };
    questions.push({ question, options: values, correctAnswer });
  }
  return { questions };
}

export function validateEvaluationQuestions(questions: EvaluationQuestion[]) {
  if (questions.length !== 10) return "La evaluación debe tener exactamente 10 preguntas.";
  for (let index = 0; index < questions.length; index += 1) {
    const item = questions[index];
    if (!item.question.trim() || item.options.length < 3 || item.options.some((option) => !option.trim()) || !Number.isInteger(item.correctAnswer) || (item.correctAnswer ?? -1) < 0 || (item.correctAnswer ?? 0) >= item.options.length) return `Completa la pregunta ${index + 1}: enunciado, todas sus opciones y una respuesta correcta.`;
  }
  return undefined;
}
