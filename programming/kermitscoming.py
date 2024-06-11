import time, random, sys, os

clearConsole = lambda: os.system('cls' if os.name=='nt' else 'clear')

domenuwaiting=input("I don't know anything about these characters really, so dont judge if I get something wrong.\nSkip (most) waiting in menus Y/N (type n please)").lower()[0] == "n"

def msleep(t):
    time.sleep(t if domenuwaiting else 0)

def gainObject(obj):
    global variables
    if (variables["inventory"])!="":
        variables["inventory"]+=","
    if (obj == "Moldy Cookie"):
        variables["notPickedUpCookie"] = False
        variables["pickedUpCookie"] = True
    if (obj == "Mysterious Paper"):
        variables["notPickedUpPaper"] = False
    variables["inventory"]+=obj
    print("You gained: "+obj)

def removeObject(obj):
    global variables
    if not(obj in variables["inventory"].split(",")):
        return
    print(variables["inventory"])
    if (variables["inventory"]!=""):
        inv = variables["inventory"].split(",")
        inv.remove(obj)
        variables["inventory"] = ','.join(inv)

def useItems(situation):
    pass

def menu(title, options, other = None): #display options chart
	#print header
    clearConsole()
    l=[]
    for line in title.split("\n"):
        l.append(len(line))
    l=max(l)

    print("#"*(l+2))
    for lin in title.split("\n"):
        print("#"+lin+(" "*(l-len(lin)))+"#")
    print("#"*(l+2), end = "\n\n")
	
    if (other):
        print()
        for character in other:
            print (character, end = "")
            msleep(0.03)
    print()
	
	#print options
    for o in range(len(options)):
        print(str(o + 1)+") "+options[o])
        msleep(0.2)

  #get choice, if not number or not within bounds return recursion else return value
    if len(options) > 0:
        ret = input("(1-"+str(o+1)+")\n")
    
        if (not(ret.isnumeric())):
            return menu(title, options)
        elif not(int(ret) == max(min(int(ret), o + 1), 1)):
            return menu(title, options)
        else:
            return int(ret)

def checkInventory():
    global variables
    inv = variables["inventory"].split(",")
    inventory = {
        "None":""
    }
    i = 0
    inv = [] if inv == [""] else inv
    for item in inv:
        if item == "Moldy Cookie":
            desc = "It's disgusting and moldy. \n0nLy S0M3 M0N3T3r w0u|d 3at tHLs"
        if item == "Mysterious Paper":
            desc = "It's a smelly, riped up paper with writing on it. The bottom is splattered with ketchup."
        inventory[item] = desc
        i+=1
    
    op = menu("Inventory", list(inventory))
    selected = list(inventory)[op-1]

    if True:
        op2 = menu(selected,["Leave", "Inspect", "Description"])
        if op2 == 1:
            return
        if op2 == 3:
            print(inventory[selected])
            return
        if (selected == "Moldy Cookie"):
            print("It's a moldy cookie")
            return
        if (selected == "Mysterious Paper"):
            clearConsole()
            print ("The writing has a mysterious story: "+"""

S.O.S. Sep. 19th, 2020
Help me if you see this! I'm locked in a basement with a demonic frog puppet who calles himself 'Kermit'.
He's very abusive and has almost killed me once. I don't know where I am.

S.O.s. Sep. 20th 2020
I've tried knocking on the ground three times, and the floor started shaking. It revealed a hidden tun
IT MAKES A LOT OF NOISE SHOOT HELP HE'S COM
...
The rest of the page is covered with blood
""")
            variables["readDiary"] = True
            return

class SUBTITLES:
    def Karen(rounds, option, health, phealth):
        if rounds == -1:
            return "You commited a crime today. The police come over, applaud you, celebrate, and then put you in jail."
        if rounds == 0:
            return "Cameras went up to capture the fight'"
        if option == 1:
            return "Karen winced at your devastating blow. The crowd goes wild."
        if option == 3:
            return 'Karen said, "Kids these days care more about shoes than my shopping experience.". That random kid said, "That drip tho."'
        if option == 2:
            return 'Karen said, "That push up is embaressing you goober." Dwayne "The Rock" Johnson complemented your abs.'
    
    def Kermit(rounds, option, health, phealth):
        return '|tz K3RMT T/M3'
    
    def COOKIEMONSTER(rounds, option, health, phealth):
        return 'WANT SOME CANDY?'
			
		
class AI:#Class containing all attack patterns
    def Karen(*a):
        return (0, "People laughed at Karen's weak punch. \n")
		
    def Kermit(r):
        if (variables["hacker"] or cpvariables["hacker"]):
            return (0, "K3rMLT*/HAT3S*H^K3R8")
        return (0, "K3rMLT*Ki|?s")
    
    def COOKIEMONSTER(*a):
        return (0, "I love torturing young kids. :-)")
		
	#Return Values:
	#Attack 0
	#Defend 1
	#Increase Damage 

class Boss_Fight():#Class for running boss fights
    def __init__(self,title, health, damage, definc, attinc, attpattern=AI.Karen, subtitles = SUBTITLES.Karen,intro=None):
        (self.health, self.damage, self.definc, self.attinc, self.attpattern, self.title, self.intro, self.subtitles) = (health,damage,definc,attinc,attpattern,title,intro,subtitles)

    def startBattle(self):
        global variables, cpvariables
        clearConsole()
		#display intro

        input("PRESS ENTER TO CONTINUE\n")
        clearConsole()
        if self.intro:
            for character in self.intro:
                print(character, end="")

        input("\n\nPRESS ENTER TO BEGIN\n")
        print("BOSS FIGHT LOADING")
        clearConsole()
#5221312322321
		#main fight logic
		
        damage = self.damage
        health = self.health
        defense = 0
        phealth = 30
        pdamage = 5
        pdefense = 0
        rounds=0
        subtitle=self.subtitles(0,None,health,30)
        while (phealth > 0):
            if health < 1:
                break
            option = menu(self.title + "\nCURRENT HEALTH: "+str(phealth)+"\nOPPONENT'S HEALTH: "+str(health),["ATTACK (do damage)", "DO PUSH UP CAUSE WHY NOT (increase damage)","POLISH YOUR DRIP (does nothing for now)"], other = subtitle)
            clearConsole()
            if option == 1:
                health-=pdamage
                print("You did",pdamage,"damage.")
            if option == 2:
                pdamage += 3
                print("Damage increased.")
            if option == 3:
                pdefense += 3
                print("Defense increased.")
            rounds+=1
			
            eturn = self.attpattern(rounds)
            if eturn[0] == 0:
                phealth-=damage
            if eturn[0] == 1:
                damage+=self.attinc
            if eturn[0] == 2:
                defense+=self.definc
    
            print(eturn[1])
            subtitle=self.subtitles(rounds,option,health,phealth)
            input("\nPRESS ENTER TO CONTINUE")
        else:
            print("You lost. Everything goes dark.")
            #input("\nPRESS ENTER TO CONTINUE")
            return 1

        menu("You win!\n" + self.title, [], other = self.subtitles(-1,0,0,0))
        input("\nPRESS ENTER TO CONTINUE")
        return 0

class _Func():
    def __init__(self, option_title,func):
        self.func=func
        self.option_title=option_title

    def run(self):
        self.func()

class Choice():#Class for choices
    def __init__(self, option_title, title, choices_, *custops, go_back = True, boss_fight = None, func=None):
        global choices
        (self.option_title, self.title, self.boss_fight, self.choices, self.func,self.custops,self.go_back) = (option_title, title, boss_fight, choices_, func, custops,go_back)
        if option_title == "Main Menu":self.choices.append(variables["checkpoint"])

    def run(self):
        global variables, cpvariables
        choices_=list(tuple(self.choices))
        if self.boss_fight:
            if self.boss_fight.startBattle() == 1:
                for key in list(cpvariables):
                    if type(cpvariables[key]) == type(""):
                        variables[key] = ""
                        for char in cpvariables[key]:
                            variables[key]+=char
                    else:
                        variables[key]=cpvariables[key]
                return variables["checkpoint"]
            if self.boss_fight.title=="K3rMLT'3' on fire.":
                variables["hacker"]=True
                cpvariables["hacker"]=True
                return "deathwish1"
            variables["checkpoint"] = self.option_title
            cpvariables={}
            for key in list(variables):
                if type(variables[key]) == type(""):
                    cpvariables[key] = ""
                    for char in variables[key]:
                        cpvariables[key]+=char
                else:
                    cpvariables[key]=variables[key]
        clearConsole()
        for custop in self.custops:
            if variables[custop[0]]:
                choices_.append(custop[1])
        if (self.go_back):
            choices_.append("mainmenu")
        
        optionsList=[]
        for choice in choices_:
            optionsList.append(choices[choice].option_title)
        
        if self.option_title=="Main Menu":
            option = menu(self.title, optionsList[:-1] + ["Start/Resume Adventure"])
        else: 
            option = menu(self.title, optionsList)
        if self.func:
            self.func()
        return choices_[option - 1]
#dictionary containing choices amd their access names
choices={}
#variables
variables={
    "checkpoint":"intro",
    "hacker":False,
    "death":Boss_Fight("K3rMLT'3' on fire.",999999,999,1,1,intro='Some frog puppet comes over looking bloodthirsty.',attpattern = AI.Kermit, subtitles=SUBTITLES.Kermit),
    "inventory":"",
    "notPickedUpPaper":True,
    "notPickedUpCookie":True,
    "pickedUpCookie":False,
    "readDiary":False
}

cpvariables={
    "checkpoint":"intro",
    "hacker":False,
    "death":Boss_Fight("K3rMLT'3' on fire.",999999,999,1,1,intro='Some frog puppet comes over looking bloodthirsty.',attpattern = AI.Kermit, subtitles=SUBTITLES.Kermit),
    "inventory":"",
    "notPickedUpPaper":True,
    "notPickedUpCookie":True,
    "pickedUpCookie":False,
    "readDiary":False
}
#float("inf"),999,1,1
#choices


choices["ending"]      = _Func("Escape", func = lambda: input("Stick around for future update with more content. For now, you win as you escaped through the vents. Or did you? dun dun dun dun..... anyways, i'll let you figure out how to get out of this"))
choices["feedcm"]      = Choice("Feed Blue Monster", "Blue monster go byebye",["ending"], func = lambda: removeObject("Moldy Cookie"))
choices["fightcm"]     = Choice("Fight cookie monster", "glorb", ["deathwish2"], boss_fight=Boss_Fight("Yuh no give cookie so i give u death.",999999,1,1,1,intro='ur stupid.',attpattern = AI.COOKIEMONSTER, subtitles=SUBTITLES.COOKIEMONSTER))
choices["knock1"]      = Choice("Knock 3 Times On Ground", 'The floor shakes, and a trapdoor opens. A sense of dread washes over you.\n"Kermit\'s having fun selling "candy", so I can play with you instead! Put something in my mouth, or I\'ll do it myself!"', ["fightcm"], ["pickedUpCookie","feedcm"])
choices["checkinv"]    = _Func("Check Inventory", checkInventory)
choices["diary"]       = Choice("Pick Up The Paper", "You pick up the paper. The bottom of it is splattered with ketchup.", ["back1"], func = lambda: gainObject("Mysterious Paper"))
choices["lightswitch"] = Choice("Flick the light switch!", "It was a trap.\nAn alarm blares.\nFootsteps approach.", ["deathwish2"], go_back=False)
choices["deathwish2"]  = Choice("Death. \"K3rMLT'3 C0mLnG\"", "You hacker", ["deathwish2"], boss_fight = variables["death"])
choices["cookie"]      = Choice("Pick Up The Cookie","You pick up the cookie. It's disgusting and moldy.\n0nLy S0M3 M0N3T3r w0u|d 3at tHLs", ["back1"], func= lambda: gainObject("Moldy Cookie"))
choices["deathwish1"]  = Choice("Start Crying", "You hacker", ["deathwish1"], boss_fight = variables["death"])
choices["lookaround1"] = Choice("Look Around", "You look around, squinting in the darkness.\nYou can just make out a cookie, a paper and a light switch",["lightswitch", "cookie", "diary"])
choices["intro"]       = Choice("Start Adventure", "You wake up excited to watch PewDiePie, \nbut you realize you're on a hard, slimy surface", ["deathwish1", "lookaround1"])
choices["back1"]       = Choice("Go Back","What will you do?",["lightswitch", "checkinv"], ["readDiary","knock1"], ["notPickedUpPaper","diary"],["notPickedUpCookie","cookie"])
choices["mainmenu"]    = Choice("Main Menu", "--K3rMLT'3--\n---C0mLnG---", ["demoboss"]+ ["mainmenu"]*3, go_back=False)
choices["demoboss"]    = Choice("Fight Karen Cause Why Not", "Karen", ["demoboss"], boss_fight = Boss_Fight("A WILD KAREN APPEARED!",20,1,0,0,intro='Karen walked over looking heavily angered. "Let me speak to the manager!" Internally, a voice boomed out of your soul, and instinct took over. "Miss, I AM THE MANAGER!"'))

#run game
op = choices["mainmenu"].run()
pastop=op
while (1):
    if type(choices[op]) == Choice:
        pastop = op
        op = choices[op].run()
    else:
        choices[op].run()
        op = pastop
    input("\nPRESS ENTER TO CONTINUE\n")