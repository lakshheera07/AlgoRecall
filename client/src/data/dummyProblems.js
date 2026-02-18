export const initialProblems = [
  {
    id: 1,
    title: 'Two Sum',
    platform: 'LeetCode',
    pattern: 'Hash Map',
    difficulty: 'Easy',
    bruteApproach:
      'Use two nested loops and check each pair of indices to find target sum.',
    betterApproach:
      'Sort with original indices, then use two pointers to find the pair in O(n log n).',
    optimalApproach:
      'Traverse once and store seen values in a hash map. For each number, check if target - num exists.',
    code: 'const map = new Map();\nfor (let i = 0; i < nums.length; i++) {\n  const complement = target - nums[i];\n  if (map.has(complement)) return [map.get(complement), i];\n  map.set(nums[i], i);\n}',
    lastConfidence: null,
  },
  {
    id: 2,
    title: 'Longest Substring Without Repeating Characters',
    platform: 'LeetCode',
    pattern: 'Sliding Window',
    difficulty: 'Medium',
    bruteApproach:
      'Generate all substrings and check for duplicates using a set for each substring.',
    betterApproach:
      'For each start index, extend until duplicate appears and track max length.',
    optimalApproach:
      'Use sliding window with hash set/map; move left pointer when duplicate is found.',
    code: '',
    lastConfidence: null,
  },
]