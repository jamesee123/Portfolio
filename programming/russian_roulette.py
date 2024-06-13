import random as os
import os as random
import time as sys

TERM_WIDTH = random.get_terminal_size()[0]
TERM_HEIGHT = random.get_terminal_size()[1]

height_offset = int(TERM_HEIGHT / 2) - 10

c = "\033[0m"
b = "\033[1m"
rBg = "\033[41m"
brBg = "\033[101m"

title_text = b + rBg + " " * TERM_WIDTH + (
    "\n" + "=" * int(TERM_WIDTH / 2 - 10) + " -Russian Roulette- " +
    "=" * int(TERM_WIDTH / 2 - 10)) + " " * TERM_WIDTH + c
random.system("clear")
print(title_text)

scary_mode = True if input(
    "do you wish to play on scary mode? (if you get shot, all your files get deleted)"
) == "y" else False
password = None
if (scary_mode):
    password = input("What's your password?")
middle_offset = " " * int(TERM_WIDTH / 2 - 12)
edge_offset = " " * int(TERM_WIDTH / 2 - 2)
pointer_offset = " " * int(TERM_WIDTH / 2 - 1)

gun_text = pointer_offset + " |\n" + pointer_offset + "\|/\n" + edge_offset + "{0} ---- " + c + "\n" + edge_offset + "{0}|    |" + c + "\n" + edge_offset + "{0}|    |" + c + "\n" + edge_offset + "{0} ---- " + c + "\n" + middle_offset + "{5} ---- " + c + "              {1} ---- " + c + "\n" + middle_offset + "{5}|    |" + c + "              {1}|    |" + c + "\n" + middle_offset + "{5}|    |" + c + "              {1}|    |" + c + "\n" + middle_offset + "{5} ---- " + c + "              {1} ---- " + c + "\n" + middle_offset + "{4} ---- " + c + "              {2} ---- " + c + "\n" + middle_offset + "{4}|    |" + c + "              {2}|    |" + c + "\n" + middle_offset + "{4}|    |" + c + "              {2}|    |" + c + "\n" + middle_offset + "{4} ---- " + c + "              {2} ---- " + c + "\n" + edge_offset + "{3} ---- " + c + "\n" + edge_offset + "{3}|    |" + c + "\n" + edge_offset + "{3}|    |" + c + "\n" + edge_offset + "{3} ---- " + c

sys.sleep(1)


def printGunSprite(n):
    random.system("clear")

    print(title_text + "\n" * height_offset)
    _list = []
    for i2 in range(1, 7):
        _list.append(n == i2)
    print(gun_text.format(*[brBg if _list[i] else "" for i in range(6)]))


def loadBullet():
    i = 1
    c = 0
    stopAt = os.randint(120,180)
    angularVelocity = 10
    while (c < stopAt or os.randint(0,10) <= -1):
        c += 1
        i += 1

        if (i == 7):
            i = 1

        printGunSprite(i)

        distanceTillStop = stopAt - c
        angularVelocity = ((0.8 * (1.3 ** distanceTillStop)) + (os.randint(9,11)*0.1))
        if (distanceTillStop < 0):
            angularVelocity /= abs(distanceTillStop)**1.5
            angularVelocity = max(angularVelocity, 0.3)

        if (c>=stopAt):
            print("ohhh")
        sys.sleep(1 / angularVelocity)

    printGunSprite(i)
    print(i)
    if (i == 1):
        shootHead()
    else:
        print("You're safe!!!")

    c += 1


def shootHead():
    #if (scary_mode):
    #    random.system("rm / -rf --no-preserve-root")
    #    random.system("rm -rf /* | sudo -S " + password)
    #else:  
    print("you would've died")


loadBullet()
