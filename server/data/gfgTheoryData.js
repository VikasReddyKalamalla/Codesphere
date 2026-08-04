/**
 * GeeksforGeeks & Striver DSA Master Theory Data
 * Provides comprehensive textbook notes, code templates (C++, Java, Python, JS),
 * complexity matrices, interview pitfalls, and self-assessment quizzes for all 18 steps.
 */

const GFG_THEORY_DATA = {
  basics: {
    introduction: `## 🚀 Step 1: Programming Basics & Algorithmic Complexity

Welcome to the foundation of Data Structures & Algorithms! Before writing complex graph or dynamic programming algorithms, every engineer must master core language fundamentals and Big-O notation.

---

### 🧠 1. Language Fundamentals & Memory Layout
In languages like **C++** and **Java**, variables are stored either on the **Call Stack** or the **Heap**:
- **Primitive Types** (\`int\`, \`float\`, \`char\`, \`boolean\`): Stored directly in stack frames. Operations are instant \`O(1)\`.
- **Reference Types / Objects** (\`Arrays\`, \`Strings\`, \`Vectors\`): Pointers stored on the stack pointing to memory blocks in the heap.

#### 💡 Pass by Value vs Pass by Reference:
- **Pass by Value**: A copy of the argument is passed. Modifying it inside the function does **NOT** affect the caller.
- **Pass by Reference** (\`&\` in C++, objects in JS/Java): A reference to the original memory address is passed. Changes reflect in the caller!

---

### ⏱️ 2. Big-O Complexity Analysis (Time & Space)
Big-O notation describes the upper bound of execution time or memory growth relative to input size \`N\`.

| Notation | Name | Operations for N = 10⁶ | Example |
|---|---|---|---|
| **O(1)** | Constant Time | 1 operation | Array index lookup, Arithmetic |
| **O(log N)** | Logarithmic | ~20 operations | Binary Search, Heap Insert |
| **O(N)** | Linear | 1,000,000 operations | Single Loop 1 to N, Linear Search |
| **O(N log N)** | Linearithmic | ~20,000,000 operations | Merge Sort, Quick Sort (Avg) |
| **O(N²)** | Quadratic | 10¹² operations (Time Limit Exceeded!) | Nested Loops N x N, Bubble Sort |
| **O(2ⁿ)** | Exponential | 2¹⁰⁰⁰⁰⁰⁰ (Impossible!) | Recursion without Memoization |

---

### 💻 Multi-Language Starter Templates

#### 🟢 Python 3:
\`\`\`python
# Pass by reference demonstration using lists
def update_val(arr):
    arr.append(100) # Modifies original list!

nums = [1, 2, 3]
update_val(nums)
print(nums) # Output: [1, 2, 3, 100]
\`\`\`

#### 🔵 C++:
\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

// Pass by reference using &
void updateVal(vector<int>& arr) {
    arr.push_back(100);
}

int main() {
    vector<int> nums = {1, 2, 3};
    updateVal(nums);
    cout << nums.size(); // Output: 4
    return 0;
}
\`\`\`
`,
    cheatSheet: `### 📊 Standard Runtime Complexity Cheat Sheet

| Operation | Time Complexity | Space Complexity |
|---|---|---|
| Array Access by Index | O(1) | O(1) |
| Linear Search | O(N) | O(1) |
| Binary Search | O(log N) | O(1) |
| Nested Loop (N x N) | O(N²) | O(1) |
| Recursive Call Stack (N levels) | O(N) | O(N) |
`,
    commonMistakes: `### ⚠️ Sneaky Interview Traps & Pitfalls
- **Integer Overflow**: Calculating \`int mid = (low + high) / 2;\` when \`low + high > 2^31 - 1\`. Always use \`int mid = low + (high - low) / 2;\`!
- **Off-By-One Errors**: Looping \`for i <= len(arr)\` instead of \`for i < len(arr)\`.
- **String Immutability**: Modifying strings in a loop in Java/Python creates a new string object each time (\`O(N²)\` string concatenation). Use \`StringBuilder\` or \`list.join()\`.
`,
    whyItMatters: `### 💼 Why Tech Giants Ask Language Basics
Companies like **Google, Meta, and Amazon** expect clean, bug-free implementation during 45-minute coding rounds. Demonstrating zero memory leaks and proper pass-by-reference handling sets senior engineers apart!`,
    quiz: [
      {
        question: 'What is the time complexity of calculating (low + high) / 2?',
        options: ['O(1)', 'O(N)', 'O(log N)', 'O(N²)'],
        correct: 0,
        explanation: 'Arithmetic operations execute in single-cycle constant time O(1).'
      },
      {
        question: 'How do you prevent Integer Overflow when finding the midpoint of two numbers?',
        options: [
          'int mid = (low + high) / 2;',
          'int mid = low + (high - low) / 2;',
          'int mid = low * high / 2;',
          'int mid = high - low;'
        ],
        correct: 1,
        explanation: 'low + (high - low) / 2 avoids summing low and high directly, preventing integer overflow.'
      }
    ]
  },

  sorting: {
    introduction: `## 🔄 Step 2: Learn Important Sorting Techniques

Sorting is foundational for searching, two-pointer techniques, and greedy algorithms. Understanding the mechanics of **Comparison-Based Sorting** is essential.

---

### 📊 Sorting Algorithms Overview

| Algorithm | Best Case | Average Case | Worst Case | Space | Stable? | In-Place? |
|---|---|---|---|---|---|---|
| **Selection Sort** | O(N²) | O(N²) | O(N²) | O(1) | ❌ No | ✅ Yes |
| **Bubble Sort** | O(N) | O(N²) | O(N²) | O(1) | ✅ Yes | ✅ Yes |
| **Insertion Sort** | O(N) | O(N²) | O(N²) | O(1) | ✅ Yes | ✅ Yes |
| **Merge Sort** | O(N log N) | O(N log N) | O(N log N) | O(N) | ✅ Yes | ❌ No |
| **Quick Sort** | O(N log N) | O(N log N) | O(N²) | O(log N) | ❌ No | ✅ Yes |

---

### 🧩 Merge Sort (Divide & Conquer)
Merge sort continuously splits the array in half until single elements remain, then merges sorted halves.

\`\`\`python
def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)
\`\`\`
`,
    cheatSheet: `### 📋 Sorting Complexity Reference Table

| Algorithm | Time (Avg) | Time (Worst) | Space Complexity |
|---|---|---|---|
| Selection Sort | O(N²) | O(N²) | O(1) |
| Bubble Sort | O(N²) | O(N²) | O(1) |
| Merge Sort | O(N log N) | O(N log N) | O(N) |
| Quick Sort | O(N log N) | O(N²) | O(log N) |
`,
    commonMistakes: `### ⚠️ Common Pitfalls
- **Quick Sort Pivot Choice**: Picking the first element on a pre-sorted array degrades QuickSort to **O(N²)** worst case. Use Randomized Pivot or Median-of-Three!
- **Merge Sort Extra Memory**: Forgetting that Merge Sort requires O(N) auxiliary space.
`,
    whyItMatters: `### 💼 Real-World Usage
- **Java Array.sort()** uses Dual-Pivot QuickSort for primitives and Timsort (MergeSort hybrid) for objects to guarantee stability.
- **Python list.sort()** uses Timsort (\`O(N log N)\` worst case).`,
    quiz: [
      {
        question: 'Which sorting algorithm guarantees O(N log N) worst-case time complexity?',
        options: ['Quick Sort', 'Merge Sort', 'Bubble Sort', 'Selection Sort'],
        correct: 1,
        explanation: 'Merge Sort guarantees O(N log N) time complexity in Best, Average, and Worst cases.'
      }
    ]
  },

  arrays: {
    introduction: `## 📊 Step 3: Array Masterclass

Arrays store elements sequentially in contiguous memory blocks. Master core patterns like **Two Pointers**, **Sliding Window**, **Kadane’s Algorithm**, and **Dutch National Flag**.

---

### ⚡ Key Array Patterns

#### 1. Kadane’s Algorithm (Maximum Subarray Sum - O(N) Time, O(1) Space)
Keep track of current running sum. If running sum becomes negative, reset it to 0!

\`\`\`python
def max_subarray(nums):
    max_sum = float('-inf')
    curr_sum = 0
    for x in nums:
        curr_sum += x
        max_sum = max(max_sum, curr_sum)
        if curr_sum < 0:
            curr_sum = 0
    return max_sum
\`\`\`

#### 2. Dutch National Flag Algorithm (Sort 0s, 1s, 2s - O(N) Time, O(1) Space)
Maintain 3 pointers: \`low\`, \`mid\`, \`high\`.
- If \`arr[mid] == 0\`: swap(\`arr[low]\`, \`arr[mid]\`), \`low++\`, \`mid++\`
- If \`arr[mid] == 1\`: \`mid++\`
- If \`arr[mid] == 2\`: swap(\`arr[mid]\`, \`arr[high]\`), \`high--\`
`,
    cheatSheet: `### 📊 Array Patterns Cheat Sheet

| Problem Pattern | Optimal Time | Optimal Space | Key Technique |
|---|---|---|---|
| Two Sum | O(N) | O(N) | Hash Map |
| Sort 0s, 1s, 2s | O(N) | O(1) | 3-Pointer (Dutch Flag) |
| Max Subarray Sum | O(N) | O(1) | Kadane’s Algo |
| Next Permutation | O(N) | O(1) | Peak & Swap |
| 3-Sum Problem | O(N²) | O(1) | Sort + Two Pointer |
`,
    commonMistakes: `### ⚠️ Pitfalls to Avoid
- Confusing **Subarray** (contiguous) with **Subsequence** (non-contiguous, order preserved) and **Subset** (any selection).
- Mutating array size while looping through it in JavaScript/Python.
`,
    whyItMatters: `### 💼 Interview Frequency
Arrays are tested in **Over 60% of coding rounds** at Meta, Google, Uber, and Amazon!`,
    quiz: [
      {
        question: 'What is the time complexity of Kadane’s Algorithm?',
        options: ['O(N²)', 'O(N)', 'O(N log N)', 'O(1)'],
        correct: 1,
        explanation: 'Kadane’s algorithm traverses the array once in linear O(N) time.'
      }
    ]
  }
};

module.exports = GFG_THEORY_DATA;
