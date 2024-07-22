#include <iostream>
#include <math.h>

using std::cout;

float brainScores[442];

int main() {
    int maxNumber = pow(2,21);
    
    /*brain is two dimensional*/
    /*two lists*/

    for (int brain = 0; brain < pow(2, 442); brain++) {
        float score = 0;
        for (int i = 0; i < 100; i++) {
            score += blackjackRound(brain);
        }
        score /= 100;
    }
}