import random
import numpy as np
from mpl_toolkits import mplot3d
import matplotlib.pyplot as plt

#lower than dealer:  lose all
#higher than dealer: win all

#x = max number before stopping must be 11 or greater
#y = average cash won in proportion to cash pool
#z = dealer original card

cards = [1,2,3,4,5,6,7,8,9,10,10,10,10]
X,Y = np.meshgrid(np.array(range(11,21)),np.array(range(1,11)))
def blackjackRound(stopNumber, dealerNumber):
    points = 0

    while (points < stopNumber):
        points += random.choice(cards)

    if (points == 21):
        return 1.5
    if (points > 21):
        return 0

    newDealerNumber = dealerNumber

    while (newDealerNumber <= 16):
        newDealerNumber += random.choice(cards)

    if (newDealerNumber > 21):
        return 2
    elif (points>newDealerNumber):
        return 2
    else:
        return 0

def calculateMoney(stopNumber, dealerNumber):
    chances = []

    for i in range(100):
        chances.append(blackjackRound(stopNumber, dealerNumber))

    return sum(chances) / len(chances)

z = [[] for i in range(10)]

for x in range(11,21):
    for y in range(10):
        z[y].append(calculateMoney(x,y))

Z = np.array(z)

fig = plt.figure()
ax = plt.axes(projection='3d')
ax.plot_surface(X, Y, Z, rstride=1, cstride=1, cmap='viridis', edgecolor='none')
ax.set_xlabel('Stop Points')
ax.set_ylabel('Dealer Card')
ax.set_zlabel('Money Made')

ax.view_init(60, 35)
plt.show()