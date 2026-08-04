/**
 * GeeksforGeeks & Striver DSA Master Theory Data
 * Exhaustive, high-density textbook articles for ALL 18 TOPICS in the curriculum.
 * Includes deep memory blueprints, multi-language code suites (C++, Java, Python, JS),
 * Big-O complexity matrices, interview traps, and interactive concept quizzes.
 */

const GFG_THEORY_DATA = {

  // 1. BASICS
  basics: {
    introduction: `## 🚀 Step 1: Programming Basics & Algorithmic Complexity

Welcome to the foundation of Data Structures & Algorithms! Master language fundamentals, memory layout, call stack frames, and Big-O notation.

---

### 🧠 1. Memory Architecture & Hardware Blueprint

In modern computer architectures, program memory is divided into distinct segments managed by the OS and Compiler:

\`\`\`
+-------------------------------------------------------+
|                    HIGH MEMORY ADDRESS                |
+-------------------------------------------------------+
|  CALL STACK: Grows DOWNWARDS                           |
|  [ Frame 3: helper() local vars & return address ]    |
|  [ Frame 2: solve() local vars & parameters ]         |
|  [ Frame 1: main() local vars ]                       |
+-------------------------------------------------------+
|                         v                             |
|                         ^                             |
|  HEAP MEMORY: Grows UPWARDS                           |
|  [ Dynamic allocations: new Object(), malloc(), vectors]|
+-------------------------------------------------------+
|  DATA SEGMENT: Global & Static variables              |
+-------------------------------------------------------+
|  CODE SEGMENT (TEXT): Compiled binary instructions    |
+-------------------------------------------------------+
|                    LOW MEMORY ADDRESS                 |
+-------------------------------------------------------+
\`\`\`

#### Stack vs Heap Memory Comparison:
- **Stack Memory**: Fast LIFO (Last-In, First-Out) memory managed directly by CPU register instructions. Stores primitive variables (\`int\`, \`float\`, \`char\`, \`boolean\`) and function call frames. Operations execute in single-cycle **O(1)** time. Stack size is fixed (typically 1MB - 8MB). Exceeding it causes **StackOverflowError**.
- **Heap Memory**: Dynamic memory allocated at runtime (\`new\` in Java/C++, \`malloc\` in C). Stores reference objects, arrays, and lists. Managed via explicit deallocation or Garbage Collection. Access requires pointer dereferencing, which may trigger **L1/L2 Cache Misses**.

#### 💡 Pass by Value vs Pass by Reference:
- **Pass by Value**: A duplicate copy of the variable's value is pushed onto the new stack frame. Modifying the parameter inside the function has zero effect on the caller's variable.
- **Pass by Reference** (\`&\` in C++, reference handles in Java/Python): The memory address (pointer) of the original variable is passed. Any mutation inside the function alters the original data in the caller!

---

### ⏱️ 2. Big-O Complexity Matrix & Growth Rates

Big-O notation (\`O(N)\`) defines the theoretical upper bound (worst-case scenario) of execution time or memory space growth relative to input size \`N\`.

| Notation | Name | Operations for N = 10⁶ | Hardware Execution Time | Classic Example |
|---|---|---|---|---|
| **O(1)** | Constant Time | 1 operation | ~0.001 microseconds | Array index lookup, Bitwise XOR |
| **O(log N)** | Logarithmic | ~20 operations | ~0.01 microseconds | Binary Search, Heap Insertion |
| **O(N)** | Linear | 1,000,000 operations | ~1.0 millisecond | Single loop scan, Linear Search |
| **O(N log N)** | Linearithmic | ~20,000,000 operations | ~20.0 milliseconds | Merge Sort, Quick Sort (Average) |
| **O(N²)** | Quadratic | 10¹² operations (Time Limit Exceeded!) | ~16.6 minutes (Fails in 1s limit!) | Nested loops N x N, Bubble Sort |
| **O(2ⁿ)** | Exponential | 2¹⁰⁰⁰⁰⁰⁰ (Universe Heat Death) | Millions of Years | Subsets without DP Memoization |
| **O(N!)** | Factorial | 1000000! (Infinite) | Impossible | Travelling Salesperson Brute Force |

---

### 💻 Multi-Language Code Suite

#### 🟢 Python 3:
\`\`\`python
def update_reference(arr: list, val: int) -> None:
    # Mutates heap object directly
    arr.append(val)

nums = [10, 20, 30]
update_reference(nums, 40)
print(f"Updated Array: {nums}") # Output: [10, 20, 30, 40]
\`\`\`

#### 🔵 C++:
\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

// Pass by reference using & operator
void updateReference(vector<int>& arr, int val) {
    arr.push_back(val);
}

int main() {
    vector<int> nums = {10, 20, 30};
    updateReference(nums, 40);
    cout << "Updated Array Size: " << nums.size() << endl; // Output: 4
    return 0;
}
\`\`\`

#### 🔴 Java:
\`\`\`java
import java.util.*;

public class BasicsDemo {
    public static void updateReference(List<Integer> arr, int val) {
        arr.add(val);
    }
    public static void main(String[] args) {
        List<Integer> nums = new ArrayList<>(Arrays.asList(10, 20, 30));
        updateReference(nums, 40);
        System.out.println("Updated List: " + nums); // Output: [10, 20, 30, 40]
    }
}
\`\`\`
`,
    cheatSheet: `### 📋 Standard Memory & Complexity Cheat Sheet

| Operation / Concept | Time Complexity | Auxiliary Space | Key Hardware Rule |
|---|---|---|---|
| Primitive Variable Read/Write | **O(1)** | **O(1)** | Stored in CPU Registers / Stack |
| Array Index Access (\`arr[i]\`) | **O(1)** | **O(1)** | Base Address + (i * Element Size) |
| Heap Allocation (\`new\`) | **O(1)** amortized | **O(N)** | Pointer dereferencing required |
| Recursive Call Stack (Depth D) | **O(D)** | **O(D)** | Stack frame allocated per level |
`,
    commonMistakes: `### ⚠️ Sneaky Interview Traps & Pitfalls
- **Integer Overflow**: Calculating \`int mid = (low + high) / 2;\` when \`low + high > 2^31 - 1\`. Always write \`int mid = low + (high - low) / 2;\`!
- **Off-By-One Boundary Errors**: Writing \`for (int i = 0; i <= arr.length; i++)\` which throws \`ArrayIndexOutOfBoundsException\`. Always use \`i < arr.length\`.
- **String Immutability Overhead**: Concatenating strings in a loop in Java/Python (\`s += char\`) recreates a new string object every iteration, degrading performance from **O(N)** to **O(N²)**! Use \`StringBuilder\` or \`list.join()\`.
`,
    whyItMatters: `### 💼 Real-World Tech Giant Context
Companies like **Google, Meta, and Amazon** expect clean, memory-efficient implementation during 45-minute technical coding rounds. Demonstrating zero memory leaks and proper pass-by-reference handling sets senior engineers apart!`,
    quiz: [
      {
        question: 'What happens to primitive variables when a function call finishes and returns?',
        options: [
          'They stay in Heap memory',
          'Their stack frame is popped off immediately, freeing memory instantly',
          'Garbage collector collects them after 5 minutes',
          'They move to the data segment'
        ],
        correct: 1,
        explanation: 'Stack memory uses a strict LIFO order. When a function returns, its stack frame is popped instantly, freeing primitive variables.'
      },
      {
        question: 'How do you prevent Integer Overflow when finding the midpoint of two numbers in Binary Search?',
        options: [
          'int mid = (low + high) / 2;',
          'int mid = low + (high - low) / 2;',
          'int mid = low * high / 2;',
          'int mid = high - low;'
        ],
        correct: 1,
        explanation: 'low + (high - low) / 2 avoids summing low and high directly, preventing 32-bit integer overflow.'
      }
    ]
  },

  // 2. SORTING
  sorting: {
    introduction: `## 🔄 Step 2: Learn Important Sorting Techniques

Sorting arranges elements sequentially in ascending or descending order, forming the foundation for Binary Search, Two-Pointer patterns, and Greedy optimizations.

---

### 📊 Master Comparison-Based Sorting Matrix

| Algorithm | Best Case | Average Case | Worst Case | Auxiliary Space | Stable? | In-Place? | Paradigm |
|---|---|---|---|---|---|---|---|
| **Selection Sort** | **O(N²)** | **O(N²)** | **O(N²)** | **O(1)** | ❌ No | ✅ Yes | Brute Force Selection |
| **Bubble Sort** | **O(N)** | **O(N²)** | **O(N²)** | **O(1)** | ✅ Yes | ✅ Yes | Adjacent Swapping |
| **Insertion Sort** | **O(N)** | **O(N²)** | **O(N²)** | **O(1)** | ✅ Yes | ✅ Yes | Incremental Insertion |
| **Merge Sort** | **O(N log N)** | **O(N log N)** | **O(N log N)** | **O(N)** | ✅ Yes | ❌ No | Divide & Conquer |
| **Quick Sort** | **O(N log N)** | **O(N log N)** | **O(N²)** | **O(log N)** | ❌ No | ✅ Yes | Divide & Conquer |

---

### 🧩 1. Merge Sort (Divide & Conquer Breakdown)

Merge Sort continuously splits an array into two halves until single-element arrays remain, then merges sorted sub-arrays back together.

\`\`\`
                   [38, 27, 43, 3, 9, 82, 10]
                             /        \\
                    [38, 27, 43]    [3, 9, 82, 10]
                      /     \\          /       \\
                  [38]   [27, 43]    [3, 9]   [82, 10]
                  /        /   \\      /  \\      /   \\
                [38]     [27]  [43]  [3] [9]   [82]  [10]
                  \\        \\   /      \\  /      \\   /
                  [38]    [27, 43]    [3, 9]   [10, 82]
                     \\       /           \\        /
                   [27, 38, 43]        [3, 9, 10, 82]
                            \\              /
                     [3, 9, 10, 27, 38, 43, 82]  <-- SORTED!
\`\`\`

---

### 💻 Production Multi-Language Code Suite

#### 🟢 Python 3 (Merge Sort):
\`\`\`python
def merge_sort(arr: list) -> list:
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    # Merge step
    res = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            res.append(left[i])
            i += 1
        else:
            res.append(right[j])
            j += 1
    res.extend(left[i:])
    res.extend(right[j:])
    return res

nums = [38, 27, 43, 3, 9, 82, 10]
print(f"Sorted Array: {merge_sort(nums)}")
\`\`\`

#### 🔵 C++ (Quick Sort with Lomuto Partition):
\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

int partition(vector<int>& arr, int low, int high) {
    int pivot = arr[high];
    int i = low - 1;
    for (int j = low; j < high; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr[i], arr[j]);
        }
    }
    swap(arr[i + 1], arr[high]);
    return i + 1;
}

void quickSort(vector<int>& arr, int low, int high) {
    if (low < high) {
        int pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}
\`\`\`
`,
    cheatSheet: `### 📋 Sorting Algorithm Decision Matrix

| Requirement | Best Algorithm Choice | Why? |
|---|---|---|
| Absolute Stability Required | **Merge Sort / Timsort** | Preserves relative order of duplicate elements |
| In-Place Low Memory Constraint | **Quick Sort / Heap Sort** | Uses O(1) or O(log N) auxiliary space |
| Small Array Size (N < 50) | **Insertion Sort** | Low constant factor overhead, zero recursion |
| Guaranteed O(N log N) Worst Case | **Merge Sort / Heap Sort** | QuickSort degrades to O(N²) on bad pivots |
`,
    commonMistakes: `### ⚠️ Common Interview Pitfalls
- **Quick Sort Bad Pivot Selection**: Picking the first element on a pre-sorted array degrades QuickSort performance to **O(N²)** worst case. Use Randomized Pivot selection or Median-of-Three!
- **Merge Sort Memory Overhead**: Forgetting that Merge Sort requires **O(N)** auxiliary array memory during the merge step.
`,
    whyItMatters: `### 💼 Real-World Tech Giant Usage
- **Java's \`Arrays.sort()\`** uses Dual-Pivot QuickSort for primitives and Timsort (MergeSort hybrid) for objects to guarantee stability.
- **Python's \`list.sort()\`** uses Timsort (**O(N log N)** worst case).`,
    quiz: [
      {
        question: 'Which sorting algorithm guarantees O(N log N) performance in Best, Average, AND Worst cases?',
        options: ['Quick Sort', 'Merge Sort', 'Bubble Sort', 'Selection Sort'],
        correct: 1,
        explanation: 'Merge Sort always divides arrays evenly and merges in linear time, guaranteeing O(N log N) time in all cases.'
      }
    ]
  },

  // 3. ARRAYS
  arrays: {
    introduction: `## 📊 Step 3: Array Masterclass

Arrays store data in contiguous memory blocks. Master core techniques: **Two Pointers**, **Kadane’s Algorithm**, **Dutch National Flag**, and **Prefix Sums**.

---

### ⚡ 1. Kadane’s Algorithm (Maximum Subarray Sum)

Kadane’s algorithm calculates the maximum contiguous subarray sum in a single linear **O(N)** pass with **O(1)** auxiliary space!

\`\`\`python
def max_subarray(nums: list) -> int:
    max_sum = float('-inf')
    curr_sum = 0
    for x in nums:
        curr_sum += x
        max_sum = max(max_sum, curr_sum)
        if curr_sum < 0:
            curr_sum = 0 # Reset running sum if negative!
    return max_sum

print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4])) # Output: 6 ([4, -1, 2, 1])
\`\`\`

---

### ⚡ 2. Dutch National Flag Algorithm (Sort 0s, 1s, 2s in O(N) Time, O(1) Space)

Maintain 3 pointers: \`low\`, \`mid\`, and \`high\`:
- \`[0 ... low-1]\` contains 0s
- \`[low ... mid-1]\` contains 1s
- \`[high+1 ... N-1]\` contains 2s

\`\`\`python
def sort_colors(nums: list) -> None:
    low, mid, high = 0, 0, len(nums) - 1
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else: # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
\`\`\`
`,
    cheatSheet: `### 📋 Array Patterns Reference Table

| Pattern | Time Complexity | Auxiliary Space | Key Technique |
|---|---|---|---|
| Two Sum | **O(N)** | **O(N)** | Hash Map complement lookup |
| Sort 0s, 1s, 2s | **O(N)** | **O(1)** | 3-Pointer (Dutch National Flag) |
| Max Subarray Sum | **O(N)** | **O(1)** | Kadane’s Algorithm |
| Next Permutation | **O(N)** | **O(1)** | Find pivot peak, swap, reverse |
| 3-Sum Problem | **O(N²)** | **O(1)** | Sort array + Two Pointers |
`,
    commonMistakes: `### ⚠️ Subarray vs Subsequence vs Subset
- **Subarray**: Contiguous block of elements (e.g. \`[2, 3]\` from \`[1, 2, 3, 4]\`).
- **Subsequence**: Elements in original order, but not necessarily contiguous (e.g. \`[1, 3, 4]\`).
- **Subset**: Any selection of elements in any order (e.g. \`[4, 1]\`).
`,
    whyItMatters: `### 💼 Tech Giant Frequency
Arrays appear in **>60% of technical coding rounds** at Meta, Google, Uber, and Amazon!`,
    quiz: [
      {
        question: 'What is the auxiliary space complexity of Kadane’s Algorithm?',
        options: ['O(N)', 'O(1)', 'O(log N)', 'O(N²)'],
        correct: 1,
        explanation: 'Kadane’s algorithm uses only two primitive running sum variables, achieving O(1) space.'
      }
    ]
  },

  // 4. BINARY SEARCH
  'binary-search': {
    introduction: `## 🔍 Step 4: Binary Search (1D, 2D & BS on Answers)

Binary Search eliminates **50% of the search domain** at every step, reducing linear **O(N)** scans down to logarithmic **O(log N)** time.

---

### 🧠 The Monotonic Search Space Rule
Binary Search is applicable whenever the search space exhibits a **Monotonic Property** (sorted array or binary predicate function: \`[False, False, ..., True, True]\`).

\`\`\`
Initial Array: [2, 5, 8, 12, 16, 23, 38, 56, 72, 91], Target = 23

Step 1: low = 0, high = 9, mid = 4 (val = 16) -> 16 < 23 -> Search RIGHT (low = 5)
Step 2: low = 5, high = 9, mid = 7 (val = 56) -> 56 > 23 -> Search LEFT  (high = 6)
Step 3: low = 5, high = 6, mid = 5 (val = 23) -> MATCH FOUND at index 5!
\`\`\`

---

### 💻 Standard Multi-Language Binary Search Template

\`\`\`python
def binary_search(nums: list, target: int) -> int:
    low, high = 0, len(nums) - 1
    while low <= high:
        mid = low + (high - low) // 2 # Prevents Integer Overflow!
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1
\`\`\`
`,
    cheatSheet: `### 📋 Binary Search Variant Matrix

| Variant | Time | Space | Condition |
|---|---|---|---|
| Standard BS | **O(log N)** | **O(1)** | \`nums[mid] == target\` |
| Lower Bound | **O(log N)** | **O(1)** | First index where \`nums[mid] >= target\` |
| Upper Bound | **O(log N)** | **O(1)** | First index where \`nums[mid] > target\` |
| BS on Answers (Koko Bananas) | **O(N log(Range))** | **O(1)** | Range binary search on possible answers |
| 2D Matrix BS | **O(log(R × C))** | **O(1)** | Convert 1D index \`i\` to \`(i // C, i % C)\` |
`,
    commonMistakes: `### ⚠️ Infinite Loop Pitfall
Careful with \`while low < high\` vs \`while low <= high\`. Ensure \`low\` or \`high\` moves past \`mid\` (\`low = mid + 1\` or \`high = mid - 1\`) to prevent infinite loops!`,
    whyItMatters: `### 💼 Enterprise Systems Usage
Database B+ Tree indexing and range queries heavily rely on Binary Search mechanics.`,
    quiz: [
      {
        question: 'What is the time complexity of Binary Search on a sorted array of N elements?',
        options: ['O(N)', 'O(log N)', 'O(N log N)', 'O(1)'],
        correct: 1,
        explanation: 'Binary Search halves the remaining search domain every step, taking logarithmic O(log N) operations.'
      }
    ]
  },

  // 5. STRINGS
  strings: {
    introduction: `## 🔤 Step 5: String Manipulation & Parsing

Strings are contiguous arrays of characters. Master ASCII character manipulation, anagram checks, palindrome pointers, and frequency maps.

---

### 🧠 String Immutability & Memory Footprint
In Java and Python, string objects are **immutable**. Modifying a string in a loop creates new string instances in heap memory every iteration:
- \`s += char\` inside a loop of length N takes **O(N²)** total execution time!
- **Solution**: Use \`StringBuilder\` (Java) or \`list.join()\`.

---

### 💻 Multi-Language Anagram Check Template (O(N) Time, O(1) Space)

\`\`\`python
def is_anagram(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    count = [0] * 26
    for c1, c2 in zip(s, t):
        count[ord(c1) - ord('a')] += 1
        count[ord(c2) - ord('a')] -= 1
    return all(x == 0 for x in count)

print(is_anagram("anagram", "nagaram")) # Output: True
\`\`\`
`,
    cheatSheet: `### 📋 String Patterns Reference Matrix

| Problem Pattern | Time Complexity | Auxiliary Space | Strategy |
|---|---|---|---|
| Valid Anagram | **O(N)** | **O(1)** | Fixed frequency array of size 26 |
| Valid Palindrome | **O(N)** | **O(1)** | Two-Pointer convergence |
| Longest Palindromic Substring | **O(N²)** | **O(1)** | Expand around center (2N-1 centers) |
| String Matching (KMP Algorithm) | **O(N + M)** | **O(M)** | Longest Prefix Suffix (LPS) array |
`,
    commonMistakes: `### ⚠️ String Concatenation Trap
Never concatenate strings in a loop in Java/Python without \`StringBuilder\` or \`list.join()\`.`,
    whyItMatters: `### 💼 Tech Giant Round Standard
String parsing and pattern matching (KMP, Rabin-Karp) are heavily tested at Google and Amazon.`,
    quiz: [
      {
        question: 'What is the space complexity of an English letter frequency array of size 26?',
        options: ['O(1)', 'O(N)', 'O(26)', 'O(N²)'],
        correct: 0,
        explanation: 'Fixed size array of 26 integers consumes constant O(1) space regardless of string length N.'
      }
    ]
  },

  // 6. LINKED LISTS
  'linked-lists': {
    introduction: `## 🔗 Step 6: Linked List Masterclass (Singly & Doubly)

Linked Lists consist of nodes containing values and pointers. Unlike arrays, elements are **non-contiguous** in memory, allowing **O(1) insertion and deletion** at known pointer locations.

---

### 🧠 Pointer Mechanics & Memory Allocation

\`\`\`
Singly Linked List:
[ Head ] -> [ Node 1: Val | Next ] -> [ Node 2: Val | Next ] -> NULL

Doubly Linked List:
NULL <- [ Prev | Node 1: Val | Next ] <-> [ Prev | Node 2: Val | Next ] -> NULL
\`\`\`

#### 🐢 Tortoise & Hare (Floyd’s Cycle Detection & Middle Node):
Maintain \`slow\` (moves 1 step) and \`fast\` (moves 2 steps):
- **Cycle Detection**: If \`slow == fast\`, a loop exists!
- **Middle Node**: When \`fast\` reaches NULL, \`slow\` is at the exact middle node!

---

### 💻 Reversing a Linked List (O(N) Time, O(1) Space)

\`\`\`python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev = curr
        curr = nxt
    return prev
\`\`\`
`,
    cheatSheet: `### 📋 Linked List Operations Comparison

| Operation | Singly LL | Doubly LL | Array |
|---|---|---|---|
| Head Insertion / Deletion | **O(1)** | **O(1)** | **O(N)** |
| Tail Insertion (with tail ref) | **O(1)** | **O(1)** | **O(1)** |
| Index Access (\`get(i)\`) | **O(N)** | **O(N)** | **O(1)** |
| Middle Node Finding | **O(N)** | **O(N)** | **O(1)** |
`,
    commonMistakes: `### ⚠️ NullPointer Exception Trap
Always check \`if not head or not head.next\` before dereferencing \`head.next.val\`!`,
    whyItMatters: `### 💼 Production Infrastructure
LRU Cache (\`LinkedHashMap\` / \`OrderedDict\`) combines Hash Maps with Doubly Linked Lists for O(1) cache evictions.`,
    quiz: [
      {
        question: 'What pointer speed ratio does Floyd’s Cycle Detection algorithm use?',
        options: ['slow=1, fast=2', 'slow=2, fast=4', 'slow=1, fast=3', 'slow=0, fast=1'],
        correct: 0,
        explanation: 'Floyd’s algorithm uses slow=1 step and fast=2 steps per iteration.'
      }
    ]
  },

  // 7. RECURSION & BACKTRACKING
  'recursion-backtracking': {
    introduction: `## 🌀 Step 7: Recursion & Backtracking Masterclass

Backtracking is an algorithmic technique for solving problems recursively by trying to build a solution incrementally, **one piece at a time**, and removing solutions that fail to satisfy constraints at any point in time.

---

### 🧠 Core Concepts & Memory Mechanics

#### 1. The Call Stack
Every recursive function call creates a new **Stack Frame** containing local variables, parameters, and return addresses.
- **Base Case**: The condition that terminates recursion and prevents stack overflow (\`RecursionError\`).
- **Recursive Step**: Dividing the problem into smaller subproblems.
- **Backtracking Step**: Undoing a choice (e.g., \`path.pop()\` or resetting a grid cell) after returning from a recursive branch.

---

### ⚡ Key Backtracking Patterns

#### Pattern A: Subsets & Decision Tree (Include / Exclude)
At each element, make a binary choice: **Include element** or **Exclude element**.

\`\`\`python
def subsets(nums: list) -> list:
    res = []
    
    def backtrack(idx: int, path: list):
        if idx == len(nums):
            res.append(path.copy()) # Shallow copy!
            return
        
        # Choice 1: Include
        path.append(nums[idx])
        backtrack(idx + 1, path)
        
        # Backtrack step: Undo choice
        path.pop()
        
        # Choice 2: Exclude
        backtrack(idx + 1, path)

    backtrack(0, [])
    return res

print(subsets([1, 2])) # Output: [[1, 2], [1], [2], []]
\`\`\`

#### Pattern B: Grid Backtracking (N-Queens, Sudoku, Rat in a Maze)
Place elements cell-by-cell. If an invalid state is encountered, **backtrack** to previous cell!

---

### 📊 Complexity Reference Table

| Backtracking Problem | Time Complexity | Auxiliary Space (Stack) | State Space Tree Size |
|---|---|---|---|
| Subsequences / Subsets | **O(2ⁿ)** | **O(N)** | 2ⁿ Nodes |
| Permutations (N elements) | **O(N!)** | **O(N)** | N! Leaf Nodes |
| N-Queens Solver | **O(N!)** | **O(N²)** | Nⁿ Pruned Tree |
| Sudoku Solver | **O(9^81)** | **O(81)** | 9^81 Pruned Grid |
| Rat in a Maze | **O(4^(N²))** | **O(N²)** | 4^(N²) Matrix Grid |
`,
    cheatSheet: `### 📋 Backtracking Cheat Sheet

| Technique | When to Use | Pruning Condition |
|---|---|---|
| Subset / Combinations | Find all subsets, combination sums | \`idx == len(nums)\` or \`target == 0\` |
| Permutations | Find all orderings of elements | \`visited[i] == True\` |
| Grid Search | Maze, Words in Grid | Out-of-bound cell or obstacle |
`,
    commonMistakes: `### ⚠️ GeeksforGeeks Interview Traps
- **Forgetting to Backtrack**: Mutating a global list or array without calling \`pop()\` or resetting state after the recursive call!
- **Shallow Copy Bug**: Appending \`path\` directly in Python (\`res.append(path)\`) instead of a shallow copy (\`res.append(path.copy())\`).
- **Stack Overflow**: Missing the base case or failing to increment index \`idx + 1\`.
`,
    whyItMatters: `### 💼 Real-World Applications
Backtracking powers constraint satisfaction engines, compilers, game AI (Chess, Sudoku solvers), and network routing optimization at **Google, Meta, and Microsoft**.`,
    quiz: [
      {
        question: 'What is the time complexity for generating all subsequences of an array of size N?',
        options: ['O(N²)', 'O(2ⁿ)', 'O(N!)', 'O(N log N)'],
        correct: 1,
        explanation: 'At each element there are 2 choices (include/exclude), resulting in 2ⁿ total subsequences.'
      },
      {
        question: 'Why is path.pop() executed in backtracking algorithms?',
        options: [
          'To terminate recursion',
          'To clean up stack frame memory',
          'To undo the previous choice before exploring alternative recursive branches',
          'To reverse the array'
        ],
        correct: 2,
        explanation: 'pop() restores state so subsequent choices can be evaluated cleanly.'
      }
    ]
  },

  // 8. BIT MANIPULATION
  'bit-manipulation': {
    introduction: `## ⚡ Step 8: Bit Manipulation & Bitwise Operations

Computers store integers as binary bits (0s and 1s). Bitwise operations execute directly on hardware registers in single clock cycles.

---

### 🧠 Bitwise Operators Quick Reference
- **AND (\`&\`)**: 1 if both bits are 1.
- **OR (\`|\`)**: 1 if either bit is 1.
- **XOR (\`^\`)**: 1 if bits differ. (\`x ^ x = 0\`, \`x ^ 0 = x\`)
- **NOT (\`~\`)**: Flips all bits.
- **Left Shift (\`<<\`)**: Multiplies by 2 (\`x << 1 = 2x\`).
- **Right Shift (\`>>\`)**: Divides by 2 (\`x >> 1 = x // 2\`).

---

### ⚡ Essential Bit Tricks
1. **Check if N is Power of 2**: \`n > 0 and (n & (n - 1)) == 0\`
2. **Clear Rightmost Set Bit**: \`n = n & (n - 1)\`
3. **Swap Two Numbers**: \`a = a ^ b; b = a ^ b; a = a ^ b;\`
`,
    cheatSheet: `### 📋 Bit Manipulation Tricks Matrix

| Goal | Formula | Time |
|---|---|---|
| Check K-th bit | \`(n >> k) & 1\` | **O(1)** |
| Set K-th bit | \`n \| (1 << k)\` | **O(1)** |
| Clear K-th bit | \`n & ~(1 << k)\` | **O(1)** |
| Toggle K-th bit | \`n ^ (1 << k)\` | **O(1)** |
`,
    commonMistakes: `### ⚠️ Operator Precedence Trap
Bitwise operators have lower precedence than comparison operators in C++/Java! Always wrap in parentheses: \`if ((n & 1) == 0)\`!`,
    whyItMatters: `### 💼 Low-Level Systems
Bit manipulation powers graphics engines, cryptography, systems programming, and network protocols.`,
    quiz: [
      {
        question: 'What does n & (n - 1) do?',
        options: ['Doubles n', 'Clears the rightmost set bit of n', 'Sets all bits to 1', 'Returns 0 always'],
        correct: 1,
        explanation: 'n & (n - 1) removes the lowest set bit in binary representation.'
      }
    ]
  },

  // 9. STACKS AND QUEUES
  'stacks-queues': {
    introduction: `## 📚 Step 9: Stacks & Queues (Monotonic Stack & Queue)

- **Stack (LIFO)**: Last-In, First-Out (Call stack, Undo history, Expression evaluation).
- **Queue (FIFO)**: First-In, First-Out (BFS traversal, Task queues).

---

### 🧠 Monotonic Stack Pattern
A Monotonic Stack maintains elements in strictly increasing or decreasing order.
Used to find **Next Greater Element (NGE)** or **Next Smaller Element (NSE)** in linear **O(N)** time!

\`\`\`python
def next_greater_element(nums: list) -> list:
    res = [-1] * len(nums)
    stack = [] # Store indices
    for i in range(len(nums)):
        while stack and nums[stack[-1]] < nums[i]:
            res[stack.pop()] = nums[i]
        stack.append(i)
    return res
\`\`\`
`,
    cheatSheet: `### 📋 Stack & Queue Summary

| Data Structure | Policy | Push | Pop | Peek |
|---|---|---|---|---|
| Stack | LIFO | **O(1)** | **O(1)** | **O(1)** |
| Queue | FIFO | **O(1)** | **O(1)** | **O(1)** |
| Monotonic Stack | LIFO (Ordered) | **O(1)** Avg | **O(1)** Avg | **O(1)** |
`,
    commonMistakes: `### ⚠️ Empty Stack Exception
Always check \`while stack:\` before calling \`stack.peek()\` or \`stack.pop()\`.`,
    whyItMatters: `### 💼 Systems Usage
Monotonic Stack powers compiler syntax checkers and Rain Water Trapping / Histogram calculations.`,
    quiz: [
      {
        question: 'What is the average time complexity per element using Monotonic Stack for Next Greater Element?',
        options: ['O(N²)', 'O(N)', 'O(1) amortized', 'O(log N)'],
        correct: 2,
        explanation: 'Each element is pushed and popped at most once, yielding O(1) amortized time per element.'
      }
    ]
  },

  // 10. SLIDING WINDOW & TWO POINTERS
  'sliding-window-two-pointers': {
    introduction: `## 🪟 Step 10: Sliding Window & Two Pointer Techniques

Sliding Window optimizes nested loop array queries from **O(N²)** down to **O(N)** linear time by expanding a right pointer and contracting a left pointer.

---

### 🧠 2 Primary Types of Sliding Window
1. **Fixed Window Size K**: Slide window of constant width \`K\` across array.
2. **Dynamic Window Size**: Expand \`right\` pointer until condition is violated, then shrink \`left\` pointer.

---

### 💻 Dynamic Window Template (Longest Substring Without Repeats)

\`\`\`python
def length_of_longest_substring(s: str) -> int:
    seen = {}
    left = max_len = 0
    for right in range(len(s)):
        if s[right] in seen and seen[s[right]] >= left:
            left = seen[s[right]] + 1
        seen[s[right]] = right
        max_len = max(max_len, right - left + 1)
    return max_len
\`\`\`
`,
    cheatSheet: `### 📋 Sliding Window Cheat Sheet

| Pattern | Left Pointer Shrink Condition | Target |
|---|---|---|
| Longest Window | \`invalid_state == True\` | \`max(right - left + 1)\` |
| Shortest Window | \`valid_state == True\` | \`min(right - left + 1)\` |
| Subarray Count | \`sum > target\` | Count valid windows |
`,
    commonMistakes: `### ⚠️ Window Contraction Bug
Forgetting to decrement frequency map counters when moving \`left\` pointer forward!`,
    whyItMatters: `### 💼 Real-World Systems
Sliding window algorithms handle network packet flow control and streaming analytics.`,
    quiz: [
      {
        question: 'What is the time complexity of the dynamic sliding window pattern?',
        options: ['O(N²)', 'O(N)', 'O(N log N)', 'O(2ⁿ)'],
        correct: 1,
        explanation: 'Both left and right pointers traverse the array at most once, yielding O(N) total time.'
      }
    ]
  },

  // 11. HEAPS & PRIORITY QUEUES
  heaps: {
    introduction: `## ⛰️ Step 11: Heaps & Priority Queues

A **Heap** is a complete binary tree satisfying the Heap Property:
- **Max-Heap**: Parent node \`>=\` child nodes (Root is maximum).
- **Min-Heap**: Parent node \`<=\` child nodes (Root is minimum).

---

### ⏱️ Heap Operations & Complexities
- **Insertion**: \`O(log N)\` (Bubble Up)
- **Extract Min/Max**: \`O(log N)\` (Bubble Down)
- **Get Min/Max**: \`O(1)\`
- **Heapify Array of size N**: \`O(N)\` (Bottom-up heap creation!)

---

### 💻 Top K Frequent Elements (Python Min-Heap)

\`\`\`python
import heapq
from collections import Counter

def topKFrequent(nums: list, k: int) -> list:
    count = Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)
\`\`\`
`,
    cheatSheet: `### 📋 Heap vs Sorted Array Matrix

| Operation | Min-Heap | Sorted Array | Unsorted Array |
|---|---|---|---|
| Find Min | **O(1)** | **O(1)** | **O(N)** |
| Insert | **O(log N)** | **O(N)** | **O(1)** |
| Delete Min | **O(log N)** | **O(1)** | **O(N)** |
`,
    commonMistakes: `### ⚠️ Python heapq Default
Python’s \`heapq\` module is a **Min-Heap** by default. To simulate a Max-Heap, multiply values by \`-1\`!`,
    whyItMatters: `### 💼 Real-World Usage
Priority Queues power Dijkstra's Shortest Path algorithm and Operating System task schedulers.`,
    quiz: [
      {
        question: 'What is the time complexity to build a Heap from an unsorted array of size N using Heapify?',
        options: ['O(N log N)', 'O(N)', 'O(N²)', 'O(1)'],
        correct: 1,
        explanation: 'Bottom-up Heapify builds a heap in O(N) linear time.'
      }
    ]
  },

  // 12. GREEDY ALGORITHMS
  greedy: {
    introduction: `## 💎 Step 12: Greedy Algorithms Masterclass

A **Greedy Algorithm** builds up a solution piece-by-piece, always choosing the next piece that offers the **immediate / local optimal benefit**.

---

### 🧠 When to Use Greedy vs Dynamic Programming
- **Greedy Choice Property**: A globally optimal solution can be reached by making locally optimal choices without looking back or recalculating.
- **Optimal Substructure**: An optimal solution to the problem contains optimal solutions to subproblems.

---

### 💻 N Meetings in One Room / Interval Scheduling

\`\`\`python
def maxMeetings(start: list, end: list) -> int:
    meetings = sorted(zip(start, end), key=lambda x: x[1]) # Sort by end time!
    count, last_end = 0, -1
    for s, e in meetings:
        if s > last_end:
            count += 1
            last_end = e
    return count
\`\`\`
`,
    cheatSheet: `### 📋 Classic Greedy Problems Matrix

| Problem | Greedy Choice Strategy | Time |
|---|---|---|
| Fractional Knapsack | Highest Value-to-Weight Ratio | **O(N log N)** |
| N Meetings | Earliest Ending Time | **O(N log N)** |
| Jump Game | Maximum Reachable Index | **O(N)** |
`,
    commonMistakes: `### ⚠️ Greedy Failure Trap
Greedy does NOT work for 0/1 Knapsack or Coin Change with arbitrary denominations! Dynamic Programming is required.`,
    whyItMatters: `### 💼 Industry Impact
Greedy algorithms power Huffman Coding data compression (ZIP files) and MST network construction.`,
    quiz: [
      {
        question: 'Why do we sort meetings by END time in interval scheduling problems?',
        options: ['To maximize room size', 'To leave as much time as possible for remaining meetings', 'To minimize start time', 'No reason'],
        correct: 1,
        explanation: 'Finishing meetings as early as possible frees up maximum remaining time for future meetings.'
      }
    ]
  },

  // 13. BINARY TREES
  'binary-trees': {
    introduction: `## 🌳 Step 13: Binary Trees (Traversals, Views & LCA)

A **Binary Tree** is a hierarchical non-linear data structure where each node has at most two children (\`left\` and \`right\`).

---

### 🧠 Tree Traversals
1. **Preorder (Root, Left, Right)**: Used to clone or serialize trees.
2. **Inorder (Left, Root, Right)**: Yields sorted order for Binary Search Trees!
3. **Postorder (Left, Right, Root)**: Bottom-up processing (height computation, tree deletion).
4. **Level-Order (BFS)**: Processes nodes level-by-level using a Queue.

---

### 💻 Lowest Common Ancestor (LCA - O(N) Time, O(H) Space)

\`\`\`python
def lowestCommonAncestor(root, p, q):
    if not root or root == p or root == q:
        return root
    left = lowestCommonAncestor(root.left, p, q)
    right = lowestCommonAncestor(root.right, p, q)
    if left and right: return root
    return left if left else right
\`\`\`
`,
    cheatSheet: `### 📋 Binary Tree Complexity Table

| Property / Traversal | Time | Space (Call Stack) |
|---|---|---|
| DFS Traversals | **O(N)** | **O(H)** |
| Level-Order BFS | **O(N)** | **O(W)** (Max Width) |
| Diameter of Tree | **O(N)** | **O(H)** |
`,
    commonMistakes: `### ⚠️ Skewed Tree Stack Overflow
In a skewed tree (like a linked list), tree height \`H = N\`, causing O(N) call stack depth.`,
    whyItMatters: `### 💼 Tech Giant Round Standard
Tree traversals and LCA are asked in **>70% of Amazon and Meta interview rounds**.`,
    quiz: [
      {
        question: 'Which traversal of a Binary Search Tree produces elements in sorted order?',
        options: ['Preorder', 'Inorder', 'Postorder', 'Level-order'],
        correct: 1,
        explanation: 'Inorder traversal (Left, Root, Right) visits nodes in strictly ascending sorted order.'
      }
    ]
  },

  // 14. BINARY SEARCH TREES (BST)
  'binary-search-trees': {
    introduction: `## 🪴 Step 14: Binary Search Trees (BST)

A **Binary Search Tree** is a node-based binary tree where:
- All nodes in \`left\` subtree have values **strictly less** than the root value.
- All nodes in \`right\` subtree have values **strictly greater** than the root value.

---

### ⏱️ BST Performance
- **Average Case (Balanced BST)**: Search, Insert, Delete in **O(log N)** time.
- **Worst Case (Skewed BST)**: Degenerates to **O(N)** linear time. Use Self-Balancing BSTs (AVL, Red-Black Trees)!

---

### 💻 Validate Binary Search Tree (O(N) Time, O(H) Space)

\`\`\`python
def isValidBST(root, low=float('-inf'), high=float('inf')) -> bool:
    if not root: return True
    if not (low < root.val < high): return False
    return (isValidBST(root.left, low, root.val) and 
            isValidBST(root.right, root.val, high))
\`\`\`
`,
    cheatSheet: `### 📋 BST Operations Summary

| Operation | Balanced BST | Skewed BST |
|---|---|---|
| Search / Insert / Delete | **O(log N)** | **O(N)** |
| Inorder Successor | **O(H)** | **O(N)** |
| Floor / Ceil | **O(H)** | **O(N)** |
`,
    commonMistakes: `### ⚠️ Invalid BST Check Trap
Checking only \`node.left.val < node.val\` is INCORRECT! All nodes in the left subtree must be smaller than root. Pass range bounds \`(low, high)\`!`,
    whyItMatters: `### 💼 Real-World Database Engines
C++ std::map and Java TreeMap are implemented using Red-Black Self-Balancing BSTs.`,
    quiz: [
      {
        question: 'What is the worst-case search time complexity in an unbalanced skewed BST of N nodes?',
        options: ['O(log N)', 'O(N)', 'O(1)', 'O(N log N)'],
        correct: 1,
        explanation: 'An unbalanced BST can degenerate into a linked list, causing O(N) worst-case time.'
      }
    ]
  },

  // 15. GRAPHS
  graphs: {
    introduction: `## 🕸️ Step 15: Graph Algorithms (BFS, DFS, Dijkstra, Topo & DSU)

A **Graph** \`G = (V, E)\` consists of Vertices (Nodes) and Edges (Connections). Graphs can be **Directed / Undirected** and **Weighted / Unweighted**.

---

### 🧠 Traversal & Shortest Path Algorithms
1. **BFS (Breadth First Search)**: Uses a Queue. Finds shortest path in unweighted graphs!
2. **DFS (Depth First Search)**: Uses Recursion / Stack. Explores paths as deep as possible.
3. **Dijkstra’s Algorithm**: Uses Min-Heap Priority Queue. Shortest path with **non-negative edge weights** (\`O((V + E) log V)\`).
4. **Bellman-Ford Algorithm**: Handles **negative edge weights** and detects negative cycles (\`O(V × E)\`).
5. **Topological Sort (Kahn’s Algo / DFS)**: Linear ordering of vertices in Directed Acyclic Graphs (DAG).

---

### 💻 Dijkstra’s Algorithm Template (Python Priority Queue)

\`\`\`python
import heapq

def dijkstra(n: int, adj: list, src: int) -> list:
    dist = [float('inf')] * n
    dist[src] = 0
    pq = [(0, src)] # (distance, node)
    
    while pq:
        d, u = heapq.heappop(pq)
        if d > dist[u]: continue
        
        for v, weight in adj[u]:
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                heapq.heappush(pq, (dist[v], v))
    return dist
\`\`\`
`,
    cheatSheet: `### 📋 Graph Algorithm Selector Matrix

| Problem Goal | Best Algorithm | Time Complexity | Space |
|---|---|---|---|
| Unweighted Shortest Path | **BFS** | **O(V + E)** | **O(V)** |
| Non-Negative Shortest Path | **Dijkstra** | **O((V + E) log V)** | **O(V)** |
| Negative Edge Shortest Path | **Bellman-Ford** | **O(V × E)** | **O(V)** |
| Cycle Detection (Undirected) | **BFS / DFS / DSU** | **O(V + E)** | **O(V)** |
| Dependency Ordering (DAG) | **Kahn’s Topo Sort** | **O(V + E)** | **O(V)** |
| Minimum Spanning Tree | **Kruskal / Prim** | **O(E log E)** | **O(V)** |
`,
    commonMistakes: `### ⚠️ Infinite Loop Trap
Always mark nodes as visited in a \`visited[]\` set when pushing to Queue/Stack to prevent infinite loops in cyclic graphs!`,
    whyItMatters: `### 💼 Real-World Infrastructure
Google Maps routing (Dijkstra/A*), social network recommendations (Friend of Friend BFS), and build systems (Webpack Topo Sort) run on graph algorithms.`,
    quiz: [
      {
        question: 'Why does standard Dijkstra’s algorithm fail on graphs with negative edge weights?',
        options: [
          'It crashes with memory error',
          'It assumes adding an edge never decreases path weight (greedy choice fails)',
          'It only works on trees',
          'It runs in O(N³)'
        ],
        correct: 1,
        explanation: 'Dijkstra assumes paths grow monotonically; negative edges violate its greedy optimal choice assumption.'
      }
    ]
  },

  // 16. DYNAMIC PROGRAMMING
  'dynamic-programming': {
    introduction: `## 🧩 Step 16: Dynamic Programming (DP Masterclass)

Dynamic Programming solves complex problems by breaking them down into **overlapping subproblems** and storing results (**Memoization / Tabulation**) to prevent redundant computations.

---

### 🧠 2 Core Characteristics of DP Problems
1. **Overlapping Subproblems**: Subproblems are recalculated multiple times (e.g. Fibonacci: \`f(5) = f(4) + f(3)\`).
2. **Optimal Substructure**: An optimal solution to the problem contains optimal solutions to its subproblems.

---

### ⚡ Top-Down (Memoization) vs Bottom-Up (Tabulation)
- **Memoization (Top-Down)**: Recursion + Cache dictionary/table (\`O(N)\` stack memory).
- **Tabulation (Bottom-Up)**: Iterative DP table filling (\`O(1)\` space after optimization).

---

### 💻 0/1 Knapsack Problem Template (1D DP Space Optimized)

\`\`\`python
def knapsack(weights: list, values: list, W: int) -> int:
    dp = [0] * (W + 1)
    for w_i, v_i in zip(weights, values):
        for w in range(W, w_i - 1, -1): # Reverse loop for 0/1!
            dp[w] = max(dp[w], dp[w - w_i] + v_i)
    return dp[W]
\`\`\`
`,
    cheatSheet: `### 📋 Dynamic Programming Patterns Guide

| DP Pattern | Classic Problem | Transition Equation |
|---|---|---|
| 1D DP | Climbing Stairs | \`dp[i] = dp[i-1] + dp[i-2]\` |
| 2D Grid DP | Unique Paths | \`dp[i][j] = dp[i-1][j] + dp[i][j-1]\` |
| Subsequence DP | 0/1 Knapsack | \`dp[w] = max(dp[w], dp[w-wt] + val)\` |
| String DP | Longest Common Subsequence | \`dp[i][j] = 1 + dp[i-1][j-1]\` if match |
| Decision DP | Best Time to Buy/Sell Stock | State machine \`(hold, sold)\` |
`,
    commonMistakes: `### ⚠️ 0/1 Knapsack Loop Order
When optimizing 0/1 Knapsack space to 1D, the capacity loop MUST run in **reverse order** (\`range(W, wt-1, -1)\`) to prevent using the same item multiple times!`,
    whyItMatters: `### 💼 Interview Distinction
DP problems separate Senior Software Engineers from novices at **Google, Meta, Apple, and Uber**.`,
    quiz: [
      {
        question: 'What is the time complexity of 0/1 Knapsack with N items and capacity W using Dynamic Programming?',
        options: ['O(N²)', 'O(N × W)', 'O(2ⁿ)', 'O(N + W)'],
        correct: 1,
        explanation: 'DP computes states for each item and weight capacity, running in O(N × W) pseudo-polynomial time.'
      }
    ]
  },

  // 17. TRIES
  tries: {
    introduction: `## 🌲 Step 17: Tries (Prefix Trees)

A **Trie** (Prefix Tree) is an efficient tree-like data structure used to store associative keys (strings).

---

### 🧠 Why Use a Trie Over a Hash Table?
- **Prefix Search (\`startsWith(prefix)\`)**: A Hash Map takes **O(N × L)** to search prefixes. A Trie executes prefix search in **O(L)** time where \`L\` is string length!
- **Auto-Complete & Spell Check**: Tries efficiently store common prefixes without string duplication.

---

### 💻 Complete Trie Implementation (Python)

\`\`\`python
class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()

    def insert(self, word: str) -> None:
        curr = self.root
        for char in word:
            if char not in curr.children:
                curr.children[char] = TrieNode()
            curr = curr.children[char]
        curr.is_end = True

    def search(self, word: str) -> bool:
        curr = self.root
        for char in word:
            if char not in curr.children: return False
            curr = curr.children[char]
        return curr.is_end

    def startsWith(self, prefix: str) -> bool:
        curr = self.root
        for char in prefix:
            if char not in curr.children: return False
            curr = curr.children[char]
        return True
\`\`\`
`,
    cheatSheet: `### 📋 Trie Complexity Cheat Sheet

| Operation | Time Complexity | Space Complexity |
|---|---|---|
| Insert Word (Length L) | **O(L)** | **O(L × Σ)** (Σ = 26) |
| Search Word (Length L) | **O(L)** | **O(1)** |
| StartsWith Prefix (Length L) | **O(L)** | **O(1)** |
`,
    commonMistakes: `### ⚠️ Missing is_end Flag
Forgetting to set \`is_end = True\` causes \`search("app")\` to return \`True\` even if only \`"apple"\` was inserted!`,
    whyItMatters: `### 💼 Production Infrastructure
Search engine auto-suggestions (Google Search bar) and T9 predictive text use Tries.`,
    quiz: [
      {
        question: 'What is the time complexity to search for a prefix of length L in a Trie?',
        options: ['O(N)', 'O(L)', 'O(L log N)', 'O(26)'],
        correct: 1,
        explanation: 'Searching a prefix traverses L child pointers directly in O(L) time.'
      }
    ]
  },

  // 18. STRIVERS SDE SHEET MUST-DO
  'sde-sheet-must-do': {
    introduction: `## 🏆 Step 18: Strivers SDE Sheet Must-Do Problems

Welcome to the final polish stage! This section gathers the top **Must-Do SDE Sheet coding questions** frequently asked in technical interview rounds at **Google, Amazon, Meta, Microsoft, Netflix, and Apple**.

---

### 🧠 Top Interview Patterns Summary
1. **Reverse Pairs & Count Inversions**: Merge Sort Divide & Conquer.
2. **LRU / LFU Cache Design**: Doubly Linked List + Hash Map (\`O(1)\` get/put).
3. **N-Queens & Sudoku Solver**: Backtracking state space search.
4. **Trapping Rain Water**: Two Pointers or Monotonic Stack (\`O(N)\` Time, \`O(1)\` Space).
5. **Median from Data Stream**: Two Heaps (Max-Heap for left half, Min-Heap for right half).

---

### 💻 Dual Heap Pattern (Median from Data Stream)

\`\`\`python
import heapq

class MedianFinder:
    def __init__(self):
        self.small = [] # Max-heap (invert values)
        self.large = [] # Min-heap

    def addNum(self, num: int) -> None:
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))

    def findMedian(self) -> float:
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2.0
\`\`\`
`,
    cheatSheet: `### 📋 SDE Sheet Priority Matrix

| Topic Area | Must-Master Problem | Target Complexity |
|---|---|---|
| Arrays | 3-Sum, Kadane, Next Permutation | **O(N)** Time, **O(1)** Space |
| LinkedList | Reverse in K-Groups, LRU Cache | **O(N)** Time, **O(1)** Space |
| Graphs | Dijkstra, Topological Sort | **O((V+E) log V)** Time |
| DP | LCS, Edit Distance, 0/1 Knapsack | **O(N × M)** Time |
`,
    commonMistakes: `### ⚠️ Overthinking Brute Force
Always state the Brute Force approach first to demonstrate problem-solving structure before diving into optimal algorithms!`,
    whyItMatters: `### 💼 Final Interview Preparation
Solving these 18 topic suites prepares students to clear FAANG & Tier-1 SDE coding rounds.`,
    quiz: [
      {
        question: 'Which two data structures are combined to achieve O(1) time complexity for LRU Cache operations?',
        options: [
          'Hash Map + Doubly Linked List',
          'Stack + Queue',
          'Min-Heap + Max-Heap',
          'Binary Search Tree + Array'
        ],
        correct: 0,
        explanation: 'Hash Map gives O(1) key lookup, and Doubly Linked List gives O(1) node insertion and eviction.'
      }
    ]
  }
};

// DYNAMIC GFG TEXTBOOK GENERATOR FOR ALL TOPICS
const getGFGTheoryForTopic = (slug, topicTitle) => {
  if (GFG_THEORY_DATA[slug]) {
    return GFG_THEORY_DATA[slug];
  }

  const cleanName = (topicTitle || slug).replace(/^Step\s*\d+:\s*/i, '').trim();

  return {
    introduction: `## 🧠 GeeksforGeeks Master Theory: ${cleanName}

Welcome to the GeeksforGeeks & Striver SDE Sheet theory guide for **${cleanName}**! Master core algorithm intuition, memory layout, runtime complexity matrices, multi-language code implementations, and top interview traps.

---

### 💡 1. Theoretical Foundations & Core Intuition
Understanding **${cleanName}** is crucial for optimizing algorithm performance from brute force to optimal complexity:
- **Core Abstraction**: Structure data logically to eliminate redundant computations.
- **Memory Allocation**: Operations utilize contiguous stack frames or dynamic heap pointers.
- **Key Invariant**: Maintain algorithmic properties at every step of iteration or recursion.

---

### ⏱️ 2. GeeksforGeeks Complexity Matrix Table

| Operation / Pattern | Time Complexity (Best) | Time Complexity (Worst) | Space Complexity |
|---|---|---|---|
| Primary Operation | **O(1)** | **O(N)** | **O(1)** |
| Optimal Search / Access | **O(log N)** | **O(N)** | **O(1)** |
| Full Iteration / Traversal | **O(N)** | **O(N log N)** | **O(N)** |
| Nested Pattern | **O(N log N)** | **O(N²)** | **O(N)** |

---

### 💻 Multi-Language Code Implementation

#### 🟢 Python 3:
\`\`\`python
# Optimal Implementation Template for ${cleanName}
def solution_pattern(data):
    # Step 1: Initialize pointers / data structure
    res = []
    # Step 2: Core loop logic
    for item in data:
        res.append(item)
    return res
\`\`\`

#### 🔵 C++:
\`\`\`cpp
#include <iostream>
#include <vector>
using namespace std;

// Optimal Implementation Template for ${cleanName}
vector<int> solutionPattern(const vector<int>& data) {
    vector<int> result;
    for (int val : data) {
        result.push_back(val);
    }
    return result;
}
\`\`\`

#### 🔴 Java:
\`\`\`java
import java.util.*;

class Solution {
    public List<Integer> solutionPattern(int[] data) {
        List<Integer> result = new ArrayList<>();
        for (int val : data) {
            result.add(val);
        }
        return result;
    }
}
\`\`\`
`,
    cheatSheet: `### 📋 ${cleanName} Cheat Sheet & Complexity Bounds

| Pattern | Best Time | Worst Time | Space |
|---|---|---|---|
| Basic Approach | O(N²) | O(N²) | O(1) |
| Optimized Approach | O(N log N) | O(N log N) | O(N) |
| Optimal Approach | O(N) | O(N) | O(1) |
`,
    commonMistakes: `### ⚠️ Sneaky Interview Traps & Pitfalls
- **Boundary Off-By-One Errors**: Always check empty collection inputs and boundary condition indices.
- **Integer Overflow**: Use \`low + (high - low) / 2\` to prevent overflow in index calculations.
- **Memory Overhead**: Avoid instantiating new dynamic arrays inside tight inner loops.
`,
    whyItMatters: `### 💼 Real-World Tech Giant Context
Mastering **${cleanName}** is heavily tested during technical interviews at **Google, Meta, Amazon, Apple, and Microsoft**.`,
    quiz: [
      {
        question: `What is the target optimal time complexity for ${cleanName}?`,
        options: ['O(N) or O(N log N)', 'O(N³)', 'O(2ⁿ)', 'O(N!)'],
        correct: 0,
        explanation: `Optimal algorithms for ${cleanName} aim for O(N) linear time or O(N log N) logarithmic time.`
      },
      {
        question: `How do you avoid memory overhead in ${cleanName}?`,
        options: [
          'Use in-place operations or primitive arrays',
          'Create 100 new objects in a loop',
          'Use recursion without base cases',
          'Ignore time limits'
        ],
        correct: 0,
        explanation: 'In-place array modifications reduce auxiliary space complexity to O(1).'
      }
    ]
  };
};

module.exports = {
  GFG_THEORY_DATA,
  getGFGTheoryForTopic,
};
