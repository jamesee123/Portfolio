import pygame,sys,math,random

isShrinking, isExpanding = False, False

numbers = []
weirdthingies = []
vectors = []

dot = [50,150,255]

offset = [0,0]

multiplyingScroll = True

pressingW = False
pressingA = False
pressingS = False
pressingD = False

pressingShift = False
pressingR = False
pressingG = False
pressingB = False

# Function to generate N prime numbers using 
# Sieve of Eratosthenes

def generateComposites(primes_):
    global numbers
    numbers_ = []
    n = primes_
     
    # Create a boolean array "prime[0..n]" and
    # initialize all entries it as true. A value
    # in prime[i] will finally be false if i is
    # Not a prime, else true.
    prime = [True for i in range(n + 1)]
     
    p = 2
    while (p * p <= n):
           
        # If prime[p] is not changed,
        # then it is a prime
        if (prime[p] == True):
               
            # Update all multiples of p
            for i in range(p * p, n + 1, p):
                prime[i] = False
                 
        p += 1
       
    # Print all prime numbers
    for p in range(2, n + 1):
        if not prime[p]:
            numbers_.append(p)
    
    numbers += numbers_

def generatePrimes(primes_):
    global numbers
    numbers_ = []
    n = primes_
     
    # Create a boolean array "prime[0..n]" and
    # initialize all entries it as true. A value
    # in prime[i] will finally be false if i is
    # Not a prime, else true.
    prime = [True for i in range(n + 1)]
     
    p = 2
    while (p * p <= n):
           
        # If prime[p] is not changed,
        # then it is a prime
        if (prime[p] == True):
               
            # Update all multiples of p
            for i in range(p * p, n + 1, p):
                prime[i] = False
                 
        p += 1
       
    # Print all prime numbers
    for p in range(2, n + 1):
        if prime[p]:
            numbers_.append(p)
    numbers += numbers_

def generateConstantDistance(n, d):
    global numbers
    numbers_ = [i*d for i in range(n)]
    numbers += numbers_

def generateFromText(text_, repeats, divisor = 1):
    global numbers
    numbers_ = []
    text = text_*repeats
    for i in range(len(text)):
        if (i == 0):
            numbers_.append(ord(text[i])/divisor)
            continue
        
        numbers_.append(numbers_[i-1] + (ord(text[i])/divisor))
    
    numbers += numbers_

def generateFibinachi(n):
    global numbers
    numbers_ = [0.00001,0.00001]

    for i in range(n-2):
        numbers_.append(numbers_[i]+numbers_[i+1])
    
    numbers += numbers_

def generateMultiplicativeDistance(distance,repeats):
    global numbers
    numbers += [i^distance for i in range(repeats)]

def generateMultidimensionalMultiplicativeDistance(distance,repeats,dimension):
    global numbers
    numbers += [(i*(distance*dimension)) for i in range(repeats)]

def generateRandomness(repeats):
    global numbers
    numbers += [random.randint(0,10000000) for i in range(repeats)]

#generatePrimes(100000)
#generateConstantDistance(1000000,22/7)
#generateRandomness(100000)
#generateFromText("Minecraft Gaming all day and all night!",10000,10) very good on etrust me
generateFromText("Minecraft gaming all day and all right!", 10000,10)
#generateComposites(5000)
#generateConstantDistance(10000000, random.randint(0,100))
#generateFibinachi(1000)

#generateComposites(100000)

numbers.sort()

print("1 down")
for p in numbers:
    weirdthingies.append([p,(p*(180/math.pi))])
print("2 down")
for thing in weirdthingies:
    vectors.append([math.cos(thing[1])*thing[0], math.sin(thing[1])*thing[0]])
print("3 down, lets go bois")
pygame.init()
dis=pygame.display.set_mode((800,600))
pygame.display.update()
pygame.display.set_caption('Spiral Generator')
game_over=False
current_prime = 1
scale = 1

clock = pygame.time.Clock()

while not game_over:
    dis.fill((0,0,0))
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()

        if event.type == pygame.KEYDOWN:
            if event.key == pygame.K_m:
                multiplyingScroll = not multiplyingScroll
            if event.key == pygame.K_w:
                pressingW = True
            if event.key == pygame.K_a:
                pressingA = True
            if event.key == pygame.K_s:
                pressingS = True
            if event.key == pygame.K_d:
                pressingD = True
            if event.key == pygame.K_o:
                scale = 1
            if event.key == pygame.K_LEFT:
                isShrinking = True
            
            elif event.key == pygame.K_RIGHT:
                isExpanding = True

            if event.key == pygame.K_LSHIFT:
                pressingShift = True
            
            if event.key == pygame.K_r:
                pressingR = True
            
            if event.key == pygame.K_g:
                pressingG = True
            
            if event.key == pygame.K_b:
                pressingB = True
        elif event.type == pygame.KEYUP:
            if event.key == pygame.K_w:
                pressingW = False
            if event.key == pygame.K_a:
                pressingA = False
            if event.key == pygame.K_s:
                pressingS = False
            if event.key == pygame.K_d:
                pressingD = False
            if event.key == pygame.K_LEFT:
                isShrinking = False
            
            elif event.key == pygame.K_RIGHT:
                isExpanding = False
            
            if event.key == pygame.K_LSHIFT:
                pressingShift = False
            
            if event.key == pygame.K_r:
                pressingR = False
            
            if event.key == pygame.K_g:
                pressingG = False
            
            if event.key == pygame.K_b:
                pressingB = False
    
    if pressingR:
        dot[0] += (pressingShift-.5)*-4
        dot[0] = max(0,min(255,dot[0]))
    if pressingG:
        dot[1] += (pressingShift-.5)*-4
        dot[1] = max(0,min(255,dot[1]))
    if pressingB:
        dot[2] += (pressingShift-.5)*-4
        dot[2] = max(0,min(255,dot[2]))

    if pressingW:
        offset[1] -= 10/scale
    
    if pressingA:
        offset[0] -= 10/scale
    
    if pressingS:
        offset[1] += 10/scale
    
    if pressingD:
        offset[0] += 10/scale

    if multiplyingScroll:
        if isShrinking:
            scale *= 0.95
        
        elif isExpanding:
            scale *= 1.05
    else:
        if isShrinking:
            scale -= 1/120
        
        elif isExpanding:
            scale += 1/120

    for vector in vectors:
        position = (vector[0]*scale+400, vector[1]*scale+300)
        if (position[0] > 800 and position[1]> 600) or (position[0]<0 or position[1]<0):
            break

        #pygame.draw.circle(dis, dot,position,3*(1-(1-scale)*.2))
        pygame.draw.circle(dis, dot,position,1)
        #print(3*(1-(1-scale)*.2))
    pygame.display.update()
    pygame.display.set_caption('Spiral Generator fps: ' + str(int(1000/clock.tick(30))))
    #print(1000/fps)
    #scale *= 0.95