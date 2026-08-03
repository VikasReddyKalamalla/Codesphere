#include <iostream>
#include <vector>
#include <algorithm>

int main() {
    std::cout << "🚀 CodeSphere Data Structures & Algorithms Playground" << std::endl;
    
    std::vector<int> nums = {42, 12, 88, 3, 27};
    std::sort(nums.begin(), nums.end());

    std::cout << "Sorted Numbers: ";
    for (int n : nums) {
        std::cout << n << " ";
    }
    std::cout << std::endl;

    return 0;
}
