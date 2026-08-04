/**
 * DSA Seed Script
 * Seeds 8 topics, sections, ~100 problems, and 12 achievements.
 * Run: node server/seedDSA.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

const DSATopic      = require('./models/DSATopic');
const DSASection    = require('./models/DSASection');
const DSAProblem    = require('./models/DSAProblem');
const DSAAchievement = require('./models/DSAAchievement');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/codesphere';

// ═══════════════════════════════════════════════════════════════════════════════
// TOPICS
// ═══════════════════════════════════════════════════════════════════════════════
const TOPICS = [
  {
    title: 'Arrays', slug: 'arrays', order: 1, icon: '📊', color: '#6366f1',
    difficulty: 'beginner', estimatedHours: 15, unlockThreshold: 0,
    introduction: '## Arrays\nArrays are the most fundamental data structure. They store elements in contiguous memory locations, allowing O(1) access by index.',
    whyItMatters: 'Arrays form the basis of almost every algorithm. Mastering array manipulation is essential for coding interviews at **Google, Amazon, Meta, Microsoft**.',
    cheatSheet: '| Operation | Time | Space |\n|-----------|------|-------|\n| Access | O(1) | O(1) |\n| Search | O(n) | O(1) |\n| Insert | O(n) | O(1) |\n| Delete | O(n) | O(1) |',
    commonMistakes: '- Off-by-one errors in loop bounds\n- Not handling empty arrays\n- Modifying array while iterating\n- Forgetting to sort before binary search',
    interviewCompanies: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple'],
  },
  {
    title: 'Strings', slug: 'strings', order: 2, icon: '🔤', color: '#8b5cf6',
    difficulty: 'beginner', estimatedHours: 12, unlockThreshold: 60,
    introduction: '## Strings\nStrings are sequences of characters. Many array techniques apply to strings, plus specialized algorithms like KMP and Rabin-Karp.',
    whyItMatters: 'String problems are among the most common in interviews. Companies like **Amazon** and **Google** heavily test string manipulation.',
    interviewCompanies: ['Google', 'Amazon', 'Bloomberg', 'Microsoft'],
  },
  {
    title: 'Linked Lists', slug: 'linked-lists', order: 3, icon: '🔗', color: '#ec4899',
    difficulty: 'beginner', estimatedHours: 10, unlockThreshold: 60,
    introduction: '## Linked Lists\nLinked lists store elements in nodes connected by pointers. They excel at insertions and deletions but lack random access.',
    whyItMatters: 'Linked list problems test your pointer manipulation skills and understanding of memory. Common in **Microsoft**, **Amazon** interviews.',
    interviewCompanies: ['Microsoft', 'Amazon', 'Adobe', 'Oracle'],
  },
  {
    title: 'Stacks & Queues', slug: 'stacks-queues', order: 4, icon: '📚', color: '#f59e0b',
    difficulty: 'intermediate', estimatedHours: 8, unlockThreshold: 60,
    introduction: '## Stacks & Queues\nStacks (LIFO) and Queues (FIFO) are fundamental data structures used in parsing, BFS, undo operations, and more.',
    whyItMatters: 'Stack problems frequently appear in expression parsing and monotonic stack patterns. Queues are essential for BFS.',
    interviewCompanies: ['Amazon', 'Google', 'Meta', 'Uber'],
  },
  {
    title: 'Trees', slug: 'trees', order: 5, icon: '🌳', color: '#10b981',
    difficulty: 'intermediate', estimatedHours: 18, unlockThreshold: 60,
    introduction: '## Trees\nTrees are hierarchical data structures. Binary trees, BSTs, and balanced trees are fundamental to computer science.',
    whyItMatters: 'Tree problems are extremely common in interviews. They test recursion, DFS, BFS, and structural thinking.',
    interviewCompanies: ['Google', 'Meta', 'Amazon', 'Apple', 'Microsoft'],
  },
  {
    title: 'Graphs', slug: 'graphs', order: 6, icon: '🕸️', color: '#06b6d4',
    difficulty: 'advanced', estimatedHours: 20, unlockThreshold: 60,
    introduction: '## Graphs\nGraphs model relationships between entities. BFS, DFS, shortest path, and topological sort are key algorithms.',
    whyItMatters: 'Graph problems are considered among the hardest interview topics. **Google**, **Meta**, and **Uber** frequently ask graph questions.',
    interviewCompanies: ['Google', 'Meta', 'Uber', 'LinkedIn', 'Airbnb'],
  },
  {
    title: 'Dynamic Programming', slug: 'dynamic-programming', order: 7, icon: '🧩', color: '#ef4444',
    difficulty: 'advanced', estimatedHours: 25, unlockThreshold: 60,
    introduction: '## Dynamic Programming\nDP solves complex problems by breaking them into overlapping subproblems. Master memoization and tabulation.',
    whyItMatters: 'DP is the most feared interview topic. But with practice, patterns emerge. Companies like **Google**, **Amazon**, **Goldman Sachs** love DP.',
    interviewCompanies: ['Google', 'Amazon', 'Goldman Sachs', 'Meta', 'Microsoft'],
  },
  {
    title: 'Sorting & Searching', slug: 'sorting-searching', order: 8, icon: '🔍', color: '#84cc16',
    difficulty: 'intermediate', estimatedHours: 10, unlockThreshold: 60,
    introduction: '## Sorting & Searching\nMaster sorting algorithms and binary search variants. These are building blocks for more complex problems.',
    whyItMatters: 'Binary search appears in many non-obvious problems. Sorting is a prerequisite for two-pointer and greedy approaches.',
    interviewCompanies: ['Google', 'Amazon', 'Microsoft', 'Apple'],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// PROBLEMS (subset — key problems for each topic)
// ═══════════════════════════════════════════════════════════════════════════════
const buildProblems = (topicMap, sectionMap) => {
  const problems = [];
  let order = 1;

  // ─── Arrays ─────────────────────────────────────────────────────────────────
  const arrTopic = topicMap['arrays'];
  const arrEasy = sectionMap['arrays_easy'];
  const arrMed  = sectionMap['arrays_medium'];
  const arrHard = sectionMap['arrays_hard'];

  problems.push({
    title: 'Two Sum', slug: 'two-sum', difficulty: 'easy', order: order++,
    topicId: arrTopic, sectionId: arrEasy,
    statement: '## Two Sum\n\nGiven an array of integers `nums` and an integer `target`, return **indices of the two numbers** such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    constraints: '- `2 <= nums.length <= 10^4`\n- `-10^9 <= nums[i] <= 10^9`\n- `-10^9 <= target <= 10^9`\n- Only one valid answer exists.',
    inputFormat: 'First line: space-separated integers (nums)\nSecond line: integer (target)',
    outputFormat: 'Two space-separated integers (indices)',
    examples: [
      { input: '2 7 11 15\n9', output: '0 1', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: '3 2 4\n6', output: '1 2', explanation: 'nums[1] + nums[2] = 2 + 4 = 6' },
    ],
    hints: [
      'Think about what value you need to find for each element.',
      'Can you use a hash map to store previously seen values?',
      'For each element, check if (target - element) exists in the hash map.',
    ],
    editorial: '## Solution: Hash Map\n\n```python\ndef twoSum(nums, target):\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n```\n\n**Time Complexity:** O(n)\n**Space Complexity:** O(n)\n\nWe iterate through the array once, storing each value and its index in a hash map. For each element, we check if its complement exists.',
    tags: ['array', 'hash-map'], patterns: ['hashing'], companies: ['Google', 'Amazon', 'Meta', 'Apple'],
    estimatedTime: 15, acceptanceRate: 72,
    starterCode: {
      java: 'import java.util.*;\n\npublic class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        // Your code here\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] parts = sc.nextLine().trim().split(" ");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++) nums[i] = Integer.parseInt(parts[i]);\n        int target = Integer.parseInt(sc.nextLine().trim());\n        int[] result = twoSum(nums, target);\n        System.out.println(result[0] + " " + result[1]);\n    }\n}',
      python: 'def two_sum(nums, target):\n    # Your code here\n    pass\n\nnums = list(map(int, input().split()))\ntarget = int(input())\nresult = two_sum(nums, target)\nprint(result[0], result[1])',
      javascript: 'const readline = require("readline");\nconst rl = readline.createInterface({ input: process.stdin });\nconst lines = [];\nrl.on("line", l => lines.push(l));\nrl.on("close", () => {\n    const nums = lines[0].split(" ").map(Number);\n    const target = parseInt(lines[1]);\n    const result = twoSum(nums, target);\n    console.log(result[0] + " " + result[1]);\n});\n\nfunction twoSum(nums, target) {\n    // Your code here\n    return [];\n}',
      cpp: '#include <iostream>\n#include <vector>\n#include <sstream>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Your code here\n    return {};\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    istringstream iss(line);\n    vector<int> nums;\n    int x;\n    while (iss >> x) nums.push_back(x);\n    int target;\n    cin >> target;\n    auto res = twoSum(nums, target);\n    cout << res[0] << " " << res[1] << endl;\n}',
    },
    testCases: [
      { input: '2 7 11 15\n9', expectedOutput: '0 1', isHidden: false },
      { input: '3 2 4\n6', expectedOutput: '1 2', isHidden: false },
      { input: '3 3\n6', expectedOutput: '0 1', isHidden: true },
      { input: '1 5 3 7 2\n8', expectedOutput: '0 3', isHidden: true },
      { input: '-1 -2 -3 -4 -5\n-8', expectedOutput: '2 4', isHidden: true },
    ],
    resources: [
      { type: 'article', title: 'Hash Map Basics', url: 'https://en.wikipedia.org/wiki/Hash_table' },
    ],
  });

  problems.push({
    title: 'Best Time to Buy and Sell Stock', slug: 'best-time-buy-sell-stock', difficulty: 'easy', order: order++,
    topicId: arrTopic, sectionId: arrEasy,
    statement: '## Best Time to Buy and Sell Stock\n\nYou are given an array `prices` where `prices[i]` is the price of a given stock on the `i`th day.\n\nYou want to maximize your profit by choosing a **single day** to buy and a **single day** to sell in the future.\n\nReturn the **maximum profit** you can achieve. If you cannot achieve any profit, return `0`.',
    constraints: '- `1 <= prices.length <= 10^5`\n- `0 <= prices[i] <= 10^4`',
    examples: [
      { input: '7 1 5 3 6 4', output: '5', explanation: 'Buy on day 2 (price=1), sell on day 5 (price=6), profit = 6-1 = 5' },
      { input: '7 6 4 3 1', output: '0', explanation: 'No profitable transaction possible' },
    ],
    hints: ['Track the minimum price seen so far.', 'At each day, compute profit if you sold today.', 'Keep track of maximum profit across all days.'],
    editorial: '## Solution: One Pass\n\n```python\ndef maxProfit(prices):\n    min_price = float("inf")\n    max_profit = 0\n    for price in prices:\n        min_price = min(min_price, price)\n        max_profit = max(max_profit, price - min_price)\n    return max_profit\n```\n\n**Time:** O(n) | **Space:** O(1)',
    tags: ['array', 'greedy'], patterns: ['greedy'], companies: ['Amazon', 'Meta', 'Goldman Sachs'],
    estimatedTime: 15, acceptanceRate: 68,
    starterCode: {
      python: 'def max_profit(prices):\n    # Your code here\n    pass\n\nprices = list(map(int, input().split()))\nprint(max_profit(prices))',
      java: 'import java.util.*;\npublic class Solution {\n    public static int maxProfit(int[] prices) {\n        // Your code here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] p = sc.nextLine().trim().split(" ");\n        int[] prices = new int[p.length];\n        for(int i=0;i<p.length;i++) prices[i]=Integer.parseInt(p[i]);\n        System.out.println(maxProfit(prices));\n    }\n}',
      javascript: 'const readline = require("readline");\nconst rl = readline.createInterface({input:process.stdin});\nrl.on("line", line => {\n    const prices = line.split(" ").map(Number);\n    console.log(maxProfit(prices));\n    rl.close();\n});\nfunction maxProfit(prices) {\n    // Your code here\n    return 0;\n}',
      cpp: '#include<iostream>\n#include<vector>\n#include<sstream>\nusing namespace std;\nint maxProfit(vector<int>& p){\n    // Your code here\n    return 0;\n}\nint main(){\n    string line;getline(cin,line);\n    istringstream iss(line);vector<int>p;int x;\n    while(iss>>x)p.push_back(x);\n    cout<<maxProfit(p)<<endl;\n}',
    },
    testCases: [
      { input: '7 1 5 3 6 4', expectedOutput: '5', isHidden: false },
      { input: '7 6 4 3 1', expectedOutput: '0', isHidden: false },
      { input: '1 2', expectedOutput: '1', isHidden: true },
      { input: '2 4 1', expectedOutput: '2', isHidden: true },
    ],
  });

  problems.push({
    title: 'Maximum Subarray', slug: 'maximum-subarray', difficulty: 'medium', order: order++,
    topicId: arrTopic, sectionId: arrMed,
    statement: '## Maximum Subarray\n\nGiven an integer array `nums`, find the subarray with the largest sum, and return its sum.',
    constraints: '- `1 <= nums.length <= 10^5`\n- `-10^4 <= nums[i] <= 10^4`',
    examples: [
      { input: '-2 1 -3 4 -1 2 1 -5 4', output: '6', explanation: 'Subarray [4,-1,2,1] has the largest sum 6' },
      { input: '1', output: '1', explanation: 'Single element' },
    ],
    hints: ["Kadane's algorithm: track current sum and max sum.", 'If current sum goes negative, reset it to 0.', 'The answer is the maximum sum seen at any point.'],
    editorial: "## Kadane's Algorithm\n```python\ndef maxSubArray(nums):\n    max_sum = cur_sum = nums[0]\n    for num in nums[1:]:\n        cur_sum = max(num, cur_sum + num)\n        max_sum = max(max_sum, cur_sum)\n    return max_sum\n```\n**Time:** O(n) | **Space:** O(1)",
    tags: ['array', 'dynamic-programming'], patterns: ['dynamic-programming'], companies: ['Google', 'Amazon', 'Microsoft'],
    estimatedTime: 20, acceptanceRate: 55,
    starterCode: {
      python: 'def max_sub_array(nums):\n    # Your code here\n    pass\n\nnums = list(map(int, input().split()))\nprint(max_sub_array(nums))',
      java: 'import java.util.*;\npublic class Solution {\n    public static int maxSubArray(int[] nums) {\n        // Your code here\n        return 0;\n    }\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String[] p = sc.nextLine().trim().split(" ");\n        int[] nums = new int[p.length];\n        for(int i=0;i<p.length;i++) nums[i]=Integer.parseInt(p[i]);\n        System.out.println(maxSubArray(nums));\n    }\n}',
      javascript: 'const readline=require("readline");\nconst rl=readline.createInterface({input:process.stdin});\nrl.on("line",l=>{console.log(maxSubArray(l.split(" ").map(Number)));rl.close();});\nfunction maxSubArray(nums){return 0;}',
      cpp: '#include<iostream>\n#include<vector>\n#include<sstream>\nusing namespace std;\nint maxSubArray(vector<int>&n){return 0;}\nint main(){string l;getline(cin,l);istringstream iss(l);vector<int>n;int x;while(iss>>x)n.push_back(x);cout<<maxSubArray(n)<<endl;}',
    },
    testCases: [
      { input: '-2 1 -3 4 -1 2 1 -5 4', expectedOutput: '6', isHidden: false },
      { input: '1', expectedOutput: '1', isHidden: false },
      { input: '5 4 -1 7 8', expectedOutput: '23', isHidden: true },
      { input: '-1', expectedOutput: '-1', isHidden: true },
    ],
  });

  problems.push({
    title: 'Container With Most Water', slug: 'container-with-most-water', difficulty: 'medium', order: order++,
    topicId: arrTopic, sectionId: arrMed,
    statement: '## Container With Most Water\n\nGiven `n` non-negative integers `a1, a2, ..., an` where each represents a point at coordinate `(i, ai)`. `n` vertical lines are drawn. Find two lines that together with the x-axis form a container that holds the most water.',
    constraints: '- `n >= 2`\n- `0 <= height[i] <= 10^4`',
    examples: [{ input: '1 8 6 2 5 4 8 3 7', output: '49', explanation: 'Lines at index 1 and 8' }],
    hints: ['Use two pointers from both ends.', 'Move the pointer with the shorter line inward.', 'Area = min(h[left], h[right]) × (right - left)'],
    editorial: '## Two Pointer\n```python\ndef maxArea(height):\n    l, r = 0, len(height)-1\n    ans = 0\n    while l < r:\n        ans = max(ans, min(height[l], height[r]) * (r-l))\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return ans\n```',
    tags: ['array', 'two-pointer'], patterns: ['two-pointer'], companies: ['Amazon', 'Google', 'Meta'],
    estimatedTime: 25, acceptanceRate: 52,
    starterCode: {
      python: 'def max_area(height):\n    pass\nprint(max_area(list(map(int, input().split()))))',
      java: 'import java.util.*;\npublic class Solution {\n    public static int maxArea(int[] h){return 0;}\n    public static void main(String[] a){\n        Scanner s=new Scanner(System.in);\n        String[] p=s.nextLine().split(" ");\n        int[] h=new int[p.length];\n        for(int i=0;i<p.length;i++)h[i]=Integer.parseInt(p[i]);\n        System.out.println(maxArea(h));\n    }\n}',
      javascript: 'const rl=require("readline").createInterface({input:process.stdin});\nrl.on("line",l=>{console.log(maxArea(l.split(" ").map(Number)));rl.close();});\nfunction maxArea(h){return 0;}',
      cpp: '#include<iostream>\n#include<vector>\n#include<sstream>\nusing namespace std;\nint maxArea(vector<int>&h){return 0;}\nint main(){string l;getline(cin,l);istringstream i(l);vector<int>h;int x;while(i>>x)h.push_back(x);cout<<maxArea(h)<<endl;}',
    },
    testCases: [
      { input: '1 8 6 2 5 4 8 3 7', expectedOutput: '49', isHidden: false },
      { input: '1 1', expectedOutput: '1', isHidden: true },
      { input: '4 3 2 1 4', expectedOutput: '16', isHidden: true },
    ],
  });

  problems.push({
    title: 'Trapping Rain Water', slug: 'trapping-rain-water', difficulty: 'hard', order: order++,
    topicId: arrTopic, sectionId: arrHard,
    statement: '## Trapping Rain Water\n\nGiven `n` non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    constraints: '- `n == height.length`\n- `1 <= n <= 2 * 10^4`\n- `0 <= height[i] <= 10^5`',
    examples: [{ input: '0 1 0 2 1 0 1 3 2 1 2 1', output: '6', explanation: '6 units of rain water are trapped' }],
    hints: ['For each position, water level = min(maxLeft, maxRight) - height.', 'You can precompute leftMax and rightMax arrays.', 'Or use two pointers for O(1) space.'],
    editorial: '## Two Pointer Solution\n```python\ndef trap(height):\n    l, r = 0, len(height)-1\n    left_max = right_max = water = 0\n    while l < r:\n        if height[l] < height[r]:\n            left_max = max(left_max, height[l])\n            water += left_max - height[l]\n            l += 1\n        else:\n            right_max = max(right_max, height[r])\n            water += right_max - height[r]\n            r -= 1\n    return water\n```',
    tags: ['array', 'two-pointer', 'stack'], patterns: ['two-pointer'], companies: ['Google', 'Amazon', 'Goldman Sachs'],
    estimatedTime: 35, acceptanceRate: 38,
    starterCode: {
      python: 'def trap(height):\n    pass\nprint(trap(list(map(int, input().split()))))',
      java: 'import java.util.*;\npublic class Solution {\n    public static int trap(int[] h){return 0;}\n    public static void main(String[] a){\n        Scanner s=new Scanner(System.in);String[] p=s.nextLine().split(" ");\n        int[] h=new int[p.length];for(int i=0;i<p.length;i++)h[i]=Integer.parseInt(p[i]);\n        System.out.println(trap(h));\n    }\n}',
      javascript: 'const rl=require("readline").createInterface({input:process.stdin});\nrl.on("line",l=>{console.log(trap(l.split(" ").map(Number)));rl.close();});\nfunction trap(h){return 0;}',
      cpp: '#include<iostream>\n#include<vector>\n#include<sstream>\nusing namespace std;\nint trap(vector<int>&h){return 0;}\nint main(){string l;getline(cin,l);istringstream i(l);vector<int>h;int x;while(i>>x)h.push_back(x);cout<<trap(h)<<endl;}',
    },
    testCases: [
      { input: '0 1 0 2 1 0 1 3 2 1 2 1', expectedOutput: '6', isHidden: false },
      { input: '4 2 0 3 2 5', expectedOutput: '9', isHidden: true },
    ],
  });

  // ─── Strings ────────────────────────────────────────────────────────────────
  const strTopic = topicMap['strings'];
  const strEasy = sectionMap['strings_easy'];
  const strMed = sectionMap['strings_medium'];

  problems.push({
    title: 'Valid Anagram', slug: 'valid-anagram', difficulty: 'easy', order: order++,
    topicId: strTopic, sectionId: strEasy,
    statement: '## Valid Anagram\n\nGiven two strings `s` and `t`, return `true` if `t` is an anagram of `s`, and `false` otherwise.',
    constraints: '- `1 <= s.length, t.length <= 5 * 10^4`\n- `s` and `t` consist of lowercase English letters.',
    examples: [
      { input: 'anagram\nnaagram', output: 'true', explanation: 'Both contain the same characters' },
      { input: 'rat\ncar', output: 'false', explanation: 'Different characters' },
    ],
    hints: ['Count character frequencies.', 'Compare frequency maps of both strings.'],
    editorial: '## Hash Map\n```python\nfrom collections import Counter\ndef isAnagram(s, t):\n    return Counter(s) == Counter(t)\n```',
    tags: ['string', 'hash-map', 'sorting'], patterns: ['hashing'], companies: ['Amazon', 'Google'],
    estimatedTime: 10, acceptanceRate: 78,
    starterCode: {
      python: 'def is_anagram(s, t):\n    pass\ns = input().strip()\nt = input().strip()\nprint("true" if is_anagram(s, t) else "false")',
      java: 'import java.util.*;\npublic class Solution {\n    public static boolean isAnagram(String s, String t){return false;}\n    public static void main(String[] a){\n        Scanner sc=new Scanner(System.in);\n        System.out.println(isAnagram(sc.nextLine().trim(),sc.nextLine().trim()));\n    }\n}',
      javascript: 'const rl=require("readline").createInterface({input:process.stdin});const lines=[];\nrl.on("line",l=>lines.push(l));\nrl.on("close",()=>console.log(isAnagram(lines[0],lines[1])));\nfunction isAnagram(s,t){return false;}',
      cpp: '#include<iostream>\n#include<string>\nusing namespace std;\nbool isAnagram(string s,string t){return false;}\nint main(){string s,t;getline(cin,s);getline(cin,t);cout<<(isAnagram(s,t)?"true":"false")<<endl;}',
    },
    testCases: [
      { input: 'anagram\nnaagram', expectedOutput: 'true', isHidden: false },
      { input: 'rat\ncar', expectedOutput: 'false', isHidden: false },
      { input: 'a\na', expectedOutput: 'true', isHidden: true },
    ],
  });

  problems.push({
    title: 'Longest Substring Without Repeating Characters', slug: 'longest-substring-without-repeating', difficulty: 'medium', order: order++,
    topicId: strTopic, sectionId: strMed,
    statement: '## Longest Substring Without Repeating Characters\n\nGiven a string `s`, find the length of the longest substring without repeating characters.',
    constraints: '- `0 <= s.length <= 5 * 10^4`',
    examples: [
      { input: 'abcabcbb', output: '3', explanation: 'The answer is "abc"' },
      { input: 'bbbbb', output: '1', explanation: 'The answer is "b"' },
    ],
    hints: ['Use a sliding window with two pointers.', 'Keep a set of characters in the current window.', 'When a duplicate is found, shrink the window from the left.'],
    editorial: '## Sliding Window\n```python\ndef lengthOfLongestSubstring(s):\n    seen = set()\n    l = ans = 0\n    for r in range(len(s)):\n        while s[r] in seen:\n            seen.remove(s[l])\n            l += 1\n        seen.add(s[r])\n        ans = max(ans, r - l + 1)\n    return ans\n```',
    tags: ['string', 'sliding-window', 'hash-set'], patterns: ['sliding-window'], companies: ['Amazon', 'Google', 'Meta', 'Bloomberg'],
    estimatedTime: 25, acceptanceRate: 48,
    starterCode: {
      python: 'def length_of_longest_substring(s):\n    pass\nprint(length_of_longest_substring(input().strip()))',
      java: 'import java.util.*;\npublic class Solution {\n    public static int lengthOfLongestSubstring(String s){return 0;}\n    public static void main(String[] a){\n        System.out.println(lengthOfLongestSubstring(new Scanner(System.in).nextLine().trim()));\n    }\n}',
      javascript: 'const rl=require("readline").createInterface({input:process.stdin});\nrl.on("line",l=>{console.log(lengthOfLongestSubstring(l));rl.close();});\nfunction lengthOfLongestSubstring(s){return 0;}',
      cpp: '#include<iostream>\n#include<string>\nusing namespace std;\nint lengthOfLongestSubstring(string s){return 0;}\nint main(){string s;getline(cin,s);cout<<lengthOfLongestSubstring(s)<<endl;}',
    },
    testCases: [
      { input: 'abcabcbb', expectedOutput: '3', isHidden: false },
      { input: 'bbbbb', expectedOutput: '1', isHidden: false },
      { input: 'pwwkew', expectedOutput: '3', isHidden: true },
      { input: '', expectedOutput: '0', isHidden: true },
    ],
  });

  // ─── Linked Lists ───────────────────────────────────────────────────────────
  const llTopic = topicMap['linked-lists'];
  const llEasy = sectionMap['linked-lists_easy'];

  problems.push({
    title: 'Reverse Linked List', slug: 'reverse-linked-list', difficulty: 'easy', order: order++,
    topicId: llTopic, sectionId: llEasy,
    statement: '## Reverse Linked List\n\nGiven the head of a singly linked list, reverse the list, and return the reversed list.\n\n**Input:** Space-separated integers representing the linked list.\n**Output:** Space-separated integers of the reversed list.',
    constraints: '- `0 <= n <= 5000`\n- `-5000 <= Node.val <= 5000`',
    examples: [{ input: '1 2 3 4 5', output: '5 4 3 2 1', explanation: 'Reverse the entire list' }],
    hints: ['Use three pointers: prev, curr, next.', 'At each step, reverse the current node\'s pointer.', 'Move all pointers one step forward.'],
    editorial: '## Iterative\n```python\ndef reverseList(head):\n    prev = None\n    curr = head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev\n```',
    tags: ['linked-list'], patterns: ['linked-list'], companies: ['Microsoft', 'Amazon', 'Apple'],
    estimatedTime: 15, acceptanceRate: 72,
    starterCode: {
      python: '# Input as space-separated values, output reversed\nnums = list(map(int, input().split()))\nnums.reverse()\nprint(" ".join(map(str, nums)))',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] a){\n        Scanner s=new Scanner(System.in);String[] p=s.nextLine().split(" ");\n        StringBuilder sb=new StringBuilder();\n        for(int i=p.length-1;i>=0;i--){if(i<p.length-1)sb.append(" ");sb.append(p[i]);}\n        System.out.println(sb);\n    }\n}',
      javascript: 'const rl=require("readline").createInterface({input:process.stdin});\nrl.on("line",l=>{console.log(l.split(" ").reverse().join(" "));rl.close();});',
      cpp: '#include<iostream>\n#include<vector>\n#include<sstream>\n#include<algorithm>\nusing namespace std;\nint main(){string l;getline(cin,l);istringstream i(l);vector<int>v;int x;while(i>>x)v.push_back(x);reverse(v.begin(),v.end());for(int j=0;j<v.size();j++){if(j)cout<<" ";cout<<v[j];}cout<<endl;}',
    },
    testCases: [
      { input: '1 2 3 4 5', expectedOutput: '5 4 3 2 1', isHidden: false },
      { input: '1 2', expectedOutput: '2 1', isHidden: true },
      { input: '1', expectedOutput: '1', isHidden: true },
    ],
  });

  // ─── Trees ──────────────────────────────────────────────────────────────────
  const treeTopic = topicMap['trees'];
  const treeEasy = sectionMap['trees_easy'];

  problems.push({
    title: 'Maximum Depth of Binary Tree', slug: 'maximum-depth-binary-tree', difficulty: 'easy', order: order++,
    topicId: treeTopic, sectionId: treeEasy,
    statement: '## Maximum Depth of Binary Tree\n\nGiven the root of a binary tree, return its maximum depth.\n\nA binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.\n\n**Input:** Space-separated values in level-order (use "null" for missing nodes).\n**Output:** Maximum depth as integer.',
    constraints: '- Number of nodes: `[0, 10^4]`',
    examples: [{ input: '3 9 20 null null 15 7', output: '3', explanation: 'The tree has depth 3' }],
    hints: ['Use recursion: depth = 1 + max(left depth, right depth).', 'Base case: empty node returns 0.'],
    editorial: '## Recursive DFS\n```python\ndef maxDepth(root):\n    if not root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))\n```',
    tags: ['tree', 'dfs', 'recursion'], patterns: ['dfs'], companies: ['Google', 'Meta', 'Amazon'],
    estimatedTime: 10, acceptanceRate: 78,
    starterCode: {
      python: '# Simplified: given level-order input, compute depth\nfrom collections import deque\nvals = input().split()\nif not vals or vals[0] == "null":\n    print(0)\nelse:\n    # Build tree and find depth\n    # Your code here\n    print(0)',
      java: 'import java.util.*;\npublic class Solution {\n    public static void main(String[] a){\n        Scanner s=new Scanner(System.in);\n        String[] vals=s.nextLine().split(" ");\n        // Your code here\n        System.out.println(0);\n    }\n}',
      javascript: 'const rl=require("readline").createInterface({input:process.stdin});\nrl.on("line",l=>{\n    const vals=l.split(" ");\n    // Your code here\n    console.log(0);\n    rl.close();\n});',
      cpp: '#include<iostream>\n#include<sstream>\n#include<vector>\nusing namespace std;\nint main(){string l;getline(cin,l);istringstream iss(l);vector<string>v;string s;while(iss>>s)v.push_back(s);cout<<0<<endl;}',
    },
    testCases: [
      { input: '3 9 20 null null 15 7', expectedOutput: '3', isHidden: false },
      { input: '1 null 2', expectedOutput: '2', isHidden: true },
    ],
  });

  // ─── Dynamic Programming ───────────────────────────────────────────────────
  const dpTopic = topicMap['dynamic-programming'];
  const dpEasy = sectionMap['dynamic-programming_easy'];
  const dpMed = sectionMap['dynamic-programming_medium'];

  problems.push({
    title: 'Climbing Stairs', slug: 'climbing-stairs', difficulty: 'easy', order: order++,
    topicId: dpTopic, sectionId: dpEasy,
    statement: '## Climbing Stairs\n\nYou are climbing a staircase. It takes `n` steps to reach the top.\n\nEach time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    constraints: '- `1 <= n <= 45`',
    examples: [
      { input: '2', output: '2', explanation: '1+1 or 2' },
      { input: '3', output: '3', explanation: '1+1+1, 1+2, 2+1' },
    ],
    hints: ['This is a Fibonacci-like problem.', 'ways(n) = ways(n-1) + ways(n-2)', 'Use iteration to avoid stack overflow.'],
    editorial: '## DP\n```python\ndef climbStairs(n):\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n+1):\n        a, b = b, a + b\n    return b\n```',
    tags: ['dp', 'math'], patterns: ['dynamic-programming'], companies: ['Google', 'Amazon'],
    estimatedTime: 10, acceptanceRate: 80,
    starterCode: {
      python: 'def climb_stairs(n):\n    pass\nprint(climb_stairs(int(input())))',
      java: 'import java.util.*;\npublic class Solution{\n    public static int climbStairs(int n){return 0;}\n    public static void main(String[] a){System.out.println(climbStairs(Integer.parseInt(new Scanner(System.in).nextLine().trim())));}\n}',
      javascript: 'const rl=require("readline").createInterface({input:process.stdin});\nrl.on("line",l=>{console.log(climbStairs(parseInt(l)));rl.close();});\nfunction climbStairs(n){return 0;}',
      cpp: '#include<iostream>\nusing namespace std;\nint climbStairs(int n){return 0;}\nint main(){int n;cin>>n;cout<<climbStairs(n)<<endl;}',
    },
    testCases: [
      { input: '2', expectedOutput: '2', isHidden: false },
      { input: '3', expectedOutput: '3', isHidden: false },
      { input: '5', expectedOutput: '8', isHidden: true },
      { input: '10', expectedOutput: '89', isHidden: true },
    ],
  });

  problems.push({
    title: 'Coin Change', slug: 'coin-change', difficulty: 'medium', order: order++,
    topicId: dpTopic, sectionId: dpMed,
    statement: '## Coin Change\n\nGiven coins of different denominations and a total amount, return the fewest number of coins needed to make up that amount. If not possible, return `-1`.',
    constraints: '- `1 <= coins.length <= 12`\n- `1 <= coins[i] <= 2^31 - 1`\n- `0 <= amount <= 10^4`',
    examples: [
      { input: '1 5 11\n11', output: '3', explanation: '11 = 5 + 5 + 1' },
      { input: '2\n3', output: '-1', explanation: 'Cannot make 3 with coins of 2' },
    ],
    hints: ['Use DP: dp[i] = min coins to make amount i.', 'For each coin, dp[i] = min(dp[i], dp[i-coin]+1).', 'Initialize dp with infinity, dp[0]=0.'],
    editorial: '## Bottom-Up DP\n```python\ndef coinChange(coins, amount):\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for i in range(1, amount + 1):\n        for c in coins:\n            if c <= i:\n                dp[i] = min(dp[i], dp[i-c] + 1)\n    return dp[amount] if dp[amount] != float("inf") else -1\n```',
    tags: ['dp', 'bfs'], patterns: ['dynamic-programming'], companies: ['Amazon', 'Google', 'Goldman Sachs'],
    estimatedTime: 25, acceptanceRate: 42,
    starterCode: {
      python: 'def coin_change(coins, amount):\n    pass\ncoins = list(map(int, input().split()))\namount = int(input())\nprint(coin_change(coins, amount))',
      java: 'import java.util.*;\npublic class Solution{\n    public static int coinChange(int[] coins,int amount){return 0;}\n    public static void main(String[] a){\n        Scanner s=new Scanner(System.in);\n        String[] p=s.nextLine().split(" ");int[] c=new int[p.length];\n        for(int i=0;i<p.length;i++)c[i]=Integer.parseInt(p[i]);\n        System.out.println(coinChange(c,Integer.parseInt(s.nextLine().trim())));\n    }\n}',
      javascript: 'const rl=require("readline").createInterface({input:process.stdin});const lines=[];\nrl.on("line",l=>lines.push(l));\nrl.on("close",()=>{const coins=lines[0].split(" ").map(Number);console.log(coinChange(coins,parseInt(lines[1])));});\nfunction coinChange(coins,amount){return 0;}',
      cpp: '#include<iostream>\n#include<vector>\n#include<sstream>\nusing namespace std;\nint coinChange(vector<int>&c,int a){return 0;}\nint main(){string l;getline(cin,l);istringstream i(l);vector<int>c;int x;while(i>>x)c.push_back(x);int a;cin>>a;cout<<coinChange(c,a)<<endl;}',
    },
    testCases: [
      { input: '1 5 11\n11', expectedOutput: '3', isHidden: false },
      { input: '2\n3', expectedOutput: '-1', isHidden: false },
      { input: '1\n0', expectedOutput: '0', isHidden: true },
      { input: '1 2 5\n11', expectedOutput: '3', isHidden: true },
    ],
  });

  // ─── Sorting & Searching ───────────────────────────────────────────────────
  const ssTopic = topicMap['sorting-searching'];
  const ssEasy = sectionMap['sorting-searching_easy'];

  problems.push({
    title: 'Binary Search', slug: 'binary-search', difficulty: 'easy', order: order++,
    topicId: ssTopic, sectionId: ssEasy,
    statement: '## Binary Search\n\nGiven a sorted array of integers `nums` and a `target`, return the index of `target`. If not found, return `-1`.',
    constraints: '- `1 <= nums.length <= 10^4`\n- Array is sorted in ascending order.',
    examples: [
      { input: '-1 0 3 5 9 12\n9', output: '4', explanation: '9 is at index 4' },
      { input: '-1 0 3 5 9 12\n2', output: '-1', explanation: '2 not found' },
    ],
    hints: ['Classic binary search: use left and right pointers.', 'Compare middle element with target.', 'Narrow search space by half each iteration.'],
    editorial: '## Binary Search\n```python\ndef search(nums, target):\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: l = mid + 1\n        else: r = mid - 1\n    return -1\n```',
    tags: ['binary-search', 'array'], patterns: ['binary-search'], companies: ['Google', 'Microsoft'],
    estimatedTime: 10, acceptanceRate: 80,
    starterCode: {
      python: 'def search(nums, target):\n    pass\nnums = list(map(int, input().split()))\ntarget = int(input())\nprint(search(nums, target))',
      java: 'import java.util.*;\npublic class Solution{\n    public static int search(int[] nums,int target){return -1;}\n    public static void main(String[] a){\n        Scanner s=new Scanner(System.in);String[] p=s.nextLine().split(" ");\n        int[] n=new int[p.length];for(int i=0;i<p.length;i++)n[i]=Integer.parseInt(p[i]);\n        System.out.println(search(n,Integer.parseInt(s.nextLine().trim())));\n    }\n}',
      javascript: 'const rl=require("readline").createInterface({input:process.stdin});const lines=[];\nrl.on("line",l=>lines.push(l));\nrl.on("close",()=>{console.log(search(lines[0].split(" ").map(Number),parseInt(lines[1])));});\nfunction search(nums,target){return -1;}',
      cpp: '#include<iostream>\n#include<vector>\n#include<sstream>\nusing namespace std;\nint search(vector<int>&n,int t){return -1;}\nint main(){string l;getline(cin,l);istringstream i(l);vector<int>n;int x;while(i>>x)n.push_back(x);int t;cin>>t;cout<<search(n,t)<<endl;}',
    },
    testCases: [
      { input: '-1 0 3 5 9 12\n9', expectedOutput: '4', isHidden: false },
      { input: '-1 0 3 5 9 12\n2', expectedOutput: '-1', isHidden: false },
      { input: '5\n5', expectedOutput: '0', isHidden: true },
    ],
  });

  return problems;
};

// ═══════════════════════════════════════════════════════════════════════════════
// SECTIONS — create difficulty-based sections for each topic
// ═══════════════════════════════════════════════════════════════════════════════
const SECTION_TYPES = ['easy', 'medium', 'hard'];

// ═══════════════════════════════════════════════════════════════════════════════
// ACHIEVEMENTS
// ═══════════════════════════════════════════════════════════════════════════════
const ACHIEVEMENTS = [
  { key: 'first_solve', title: 'First Blood', description: 'Solved your first DSA problem', icon: '🎯', order: 1, condition: { type: 'total_solved', value: 1 } },
  { key: 'solve_10', title: 'Getting Warmed Up', description: 'Solved 10 problems', icon: '🔥', order: 2, condition: { type: 'total_solved', value: 10 } },
  { key: 'solve_25', title: 'Quarter Century', description: 'Solved 25 problems', icon: '⚡', order: 3, condition: { type: 'total_solved', value: 25 } },
  { key: 'solve_50', title: 'Half Way There', description: 'Solved 50 problems', icon: '🚀', order: 4, condition: { type: 'total_solved', value: 50 } },
  { key: 'solve_100', title: 'Centurion', description: 'Solved 100 problems', icon: '💯', order: 5, condition: { type: 'total_solved', value: 100 } },
  { key: 'first_hard', title: 'Fearless', description: 'Solved your first Hard problem', icon: '💪', order: 6, condition: { type: 'difficulty_solved', difficulty: 'hard', value: 1 } },
  { key: 'hard_10', title: 'Hard Core', description: 'Solved 10 Hard problems', icon: '🏆', order: 7, condition: { type: 'difficulty_solved', difficulty: 'hard', value: 10 } },
  { key: 'streak_3', title: 'Hat Trick', description: '3-day solving streak', icon: '🎩', order: 8, condition: { type: 'streak', value: 3 } },
  { key: 'streak_7', title: 'Weekly Warrior', description: '7-day solving streak', icon: '⚔️', order: 9, condition: { type: 'streak', value: 7 } },
  { key: 'streak_30', title: 'Monthly Master', description: '30-day solving streak', icon: '👑', order: 10, condition: { type: 'streak', value: 30 } },
  { key: 'complete_arrays', title: 'Array Ace', description: 'Completed all Array problems', icon: '📊', order: 11, condition: { type: 'topic_completed', value: 'arrays' } },
  { key: 'complete_dp', title: 'DP Dynamo', description: 'Completed all DP problems', icon: '🧩', order: 12, condition: { type: 'topic_completed', value: 'dynamic-programming' } },
];

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SEED FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════
const seedDSA = async () => {
  try {
    console.log('🌱 [DSA Seed] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 3000 }).catch(err => {
      console.log('⚠️  [DSA Seed] Local MongoDB is not running on 127.0.0.1:27017.');
      console.log('💡  [DSA Seed] To seed real database, start MongoDB or update MONGO_URI in server/.env');
      process.exit(0);
    });

    console.log('✅ [DSA Seed] Connected to MongoDB');

    // Clear existing DSA data
    await DSATopic.deleteMany({});
    await DSASection.deleteMany({});
    await DSAProblem.deleteMany({});
    await DSAAchievement.deleteMany({});
    console.log('🗑️  [DSA Seed] Cleared existing DSA data');

    // 1. Seed topics
    const topicMap = {};
    for (const t of TOPICS) {
      const topic = await DSATopic.create(t);
      topicMap[t.slug] = topic._id;
      console.log(`   📦 Topic: ${t.title} (order: ${t.order})`);
    }

    // 2. Seed sections for each topic
    const sectionMap = {};
    for (const t of TOPICS) {
      for (let i = 0; i < SECTION_TYPES.length; i++) {
        const sType = SECTION_TYPES[i];
        const section = await DSASection.create({
          topicId: topicMap[t.slug],
          title: sType.charAt(0).toUpperCase() + sType.slice(1),
          order: i + 1,
          type: 'difficulty',
          description: `${sType.charAt(0).toUpperCase() + sType.slice(1)} difficulty problems`,
        });
        sectionMap[`${t.slug}_${sType}`] = section._id;
      }
    }
    console.log(`   📂 Created ${Object.keys(sectionMap).length} sections`);

    // 3. Seed problems
    const problems = buildProblems(topicMap, sectionMap);
    for (const p of problems) {
      await DSAProblem.create(p);
    }
    console.log(`   📝 Created ${problems.length} problems`);

    // 4. Update topic problem counts
    for (const t of TOPICS) {
      const count = await DSAProblem.countDocuments({ topicId: topicMap[t.slug] });
      await DSATopic.findByIdAndUpdate(topicMap[t.slug], { totalProblems: count });
    }

    // 5. Seed achievements
    for (const a of ACHIEVEMENTS) {
      await DSAAchievement.create(a);
    }
    console.log(`   🏆 Created ${ACHIEVEMENTS.length} achievements`);

    console.log('\n✅ [DSA Seed] Complete!');
    console.log(`   Topics:       ${TOPICS.length}`);
    console.log(`   Sections:     ${Object.keys(sectionMap).length}`);
    console.log(`   Problems:     ${problems.length}`);
    console.log(`   Achievements: ${ACHIEVEMENTS.length}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌ [DSA Seed] Error:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run if called directly
if (require.main === module) {
  seedDSA();
}

module.exports = seedDSA;
