/**
 * Context-Aware AI Tutor Engine
 */
function assembleTutorContext({ lessonTitle, lessonObjectives, codeSnippet, errorLog, gitDiff, studentMode }) {
  return {
    lessonTitle: lessonTitle || 'Coding Practice',
    lessonObjectives: lessonObjectives || 'Implement algorithm according to specifications.',
    codeSnippet: codeSnippet || '// Current active editor selection',
    errorLog: errorLog || null,
    gitDiff: gitDiff || null,
    mode: studentMode || 'learning'
  };
}

function generateTutorResponse({ prompt, action, context }) {
  // If in Exam mode, refuse AI answers according to exam rules
  if (context.mode === 'exam') {
    return {
      sender: 'ai',
      text: '⚠️ AI Tutor Assistance is disabled during Exam Mode to ensure assessment integrity.',
      codeSnippet: ''
    };
  }

  let text = '';
  let snippet = '';

  if (action === 'debug' || context.errorLog) {
    text = `### 🧑‍🏫 AI Tutor Diagnostic\nI reviewed your error traceback:\n> \`${context.errorLog || 'SyntaxError: Unexpected identifier'}\`\n\n**Lesson Objective Context**: ${context.lessonObjectives}\n\n**Hint**: Check your syntax around variable declarations and verify all parentheses are closed properly.`;
    snippet = `// Corrected syntax:\nif (input !== null && input !== undefined) {\n  processValue(input);\n}`;
  } else if (action === 'explain') {
    text = `### 🧑‍🏫 AI Tutor Code Explanation\nIn line with your lesson **"${context.lessonTitle}"**:\n1. This block initializes data structures.\n2. Iterates over elements performing transformations.\n3. Returns the formatted result.`;
  } else if (action === 'hint') {
    text = `### 💡 AI Tutor Hint\nConsider using a Hash Map / Dictionary to store intermediate results for O(1) lookups instead of nested loops.`;
  } else {
    text = `### 🧑‍🏫 AI Tutor\nBased on your query "${prompt}" and lesson **"${context.lessonTitle}"**, here is guidance tailored to your current assignment.`;
    snippet = `// Example implementation:\nfunction solveAssignment(data) {\n  return data.map(x => x * 2);\n}`;
  }

  return {
    sender: 'ai',
    text,
    codeSnippet: snippet,
    contextSummary: {
      lesson: context.lessonTitle,
      mode: context.mode
    }
  };
}

module.exports = {
  assembleTutorContext,
  generateTutorResponse
};
