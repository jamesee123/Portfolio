#include <cstring>
#include <fstream>
#include <iostream>
#include <string>
#include <vector>
using namespace std;

void print(string toPrint) { cout << toPrint + "\n"; }

template <class T> class Stack {
private:
  vector<T> arr;
  int pointer;

public:
  Stack(int maxSize) {
    this->pointer = 0;
    arr.resize(maxSize);
  }

  void push(int element) {
    if (pointer == arr.size() - 1) {
      return;
    }

    pointer += 1;
    arr.at(pointer) = element;
  }

  T pop() {
    T tp = top();
    if (pointer == 0) {
      return tp;
    }

    pointer -= 1;
    return tp;
  }
  T top() { return arr[pointer]; }

  bool isEmpty() { return pointer == 0; }

  bool isFull() { return pointer == arr.size() - 1; }

  int size() { return pointer; }
};

int main(int argc, char **argv) {
  cout << "Fork programs to edit bf file and run file directory. To run file at "
          "argument directory, change line 61 to string directory = argv[1];. "
          "Hello, World! example also provided.\nLanguage:   "
          "https://en.m.wikipedia.org/wiki/Brainfuck\n";
  string directory = "text.cs";

  bool comment = true;

  string userInput = "";

  print(to_string('['));
  // Reads file and puts it in string code

  ifstream file(directory);

  unsigned char bytes[30000] = {0};

  int pointer = 0;
  Stack<int> loops(100);
  string code = "";
  int character = 0;
  print("Reading code...");
  while (file) {
    code += file.get();
  }
  bool debug = false;
  print("Executing code...");
  for (int i = 0; i < code.length(); i++) {
    // cout <<to_string(i
    if (code[i] == '>') { // If it's a right arrow move pointer to the right
      // cout << ">";
      pointer += 1;
      if (pointer == 30000) {
        pointer = 0;
      }
    }
    if (code[i] == '<') { // If it's a left arrow move pointer to the left
      // cout << "<";
      pointer -= 1;
      if (pointer == -1) {
        pointer = 29999;
      }
    }
    if (code[i] == '-') { // Decrement byte by 1 if character is -
      // cout << "-";
      if (bytes[pointer] == 0) {
        bytes[pointer] = 255;
      } else {
        bytes[pointer]--;
      }
    }
    if (code[i] == '+') { // Increment byte by 1 if character is +
      // cout << "+";
      if (bytes[pointer] == 255) {
        bytes[pointer] = 0;
      } else {
        bytes[pointer]++;
      }
    }
    if (code[i] == '[') { // If opening bracket add 1 to loops
      // cout << "[";
      loops.push(i);
    }

    if (code[i] == '.') {
      // cout << ".";
      cout << bytes[pointer];
    }

    if (code[i] == ']') {
      // cout << "]";
      if (bytes[pointer] != 0) {
        i = loops.top();
      } else {
        loops.pop();
      }
    }

    if (code[i] == ',') {
      /*char input;
      if (character == userInput.length()){
          i=0;
          userInput = "";
          cin >> userInput;
      }

      if (character == userInput.length()){
          input = '';
      }
      else {

      }*/
      cout << "Type your character: \n";
      cin >> bytes[pointer];
    }

    if (code[i] == '\\') {
      i++;
      bytes[pointer] = code[i];
    }
  }
  return EXIT_SUCCESS;
}