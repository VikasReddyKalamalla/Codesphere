import sys

def main():
    print("🐍 Welcome to CodeSphere Python Cloud Workspace!")
    
    data = [1, 2, 3, 4, 5]
    squared = [x**2 for x in data]
    print(f"Original: {data}")
    print(f"Squared: {squared}")

if __name__ == "__main__":
    main()
