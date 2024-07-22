import random
import os

RANDOM_PARAGRAPHS = False
DO_NEW_LINE = True
TWO_LAYERS = False
PROGRESS_BAR = True

def progressBar(percent,label,firstPrint=False):
    if firstPrint:
        os.system("cls")
        os.system("clear")
        print(label)
    bar = "\r\r[" + "="*percent + "-"*(100-percent) + "] " + str(percent) + "%"
    bar = bar[:percent+2] + " " + bar[percent+3:]
    print(bar,end="\r\x1b[" + str(percent) + "C")

def findPatterns(text):
    patterns = {}
    twosteppatterns = {}

    contents = text.split('\n')
    linesdone=0
    for content in contents:
        content = content.replace(" . ", "&*(")
        content = content.replace(". ", "&*(")
        content = content.replace(".", "&*(")
        content = content.replace("&*(", " . ")
        
        words = content.split(' ')
        words = list([string for string in words if string != '' and string != ' '])
        if TWO_LAYERS:
            for i in range(0, len(words)-2):
                if (words[i] + " " + words[i+1] not in twosteppatterns):
                    twosteppatterns[words[i] + " " + words[i+1]] = {}
                if words[i+2] not in twosteppatterns[words[i] + " " + words[i+1]]:
                    twosteppatterns[words[i] + " " + words[i+1]][words[i+2]] = 0
                    
                twosteppatterns[words[i] + " " + words[i+1]][words[i+2]] += 1
        for i in range(0, len(words)-1):
            if (words[i] not in patterns):
                patterns[words[i]] = {}
            if (words[i+1] not in patterns[words[i]]):
                patterns[words[i]][words[i+1]] = 0
            patterns[words[i]][words[i+1]] += 1
        linesdone+=1
    return (patterns, twosteppatterns)

def makeStory(patterns, twosteppatterns, tokens):
    story = "\t"

    word = random.choice(list(patterns.keys()))

    pastPercentage = 0
    for i in range(0, tokens):
        choice = ""
        if (TWO_LAYERS):
            try:
                choice = random.choices(list(twosteppatterns[word].keys()), weights=list(twosteppatterns[word].values()))[0]
            except:
                choice = random.choices(list(patterns[word.split(" ")[1]].keys()), weights=list(patterns[word.split(" ")[1]].values()))[0]
        else:
            choice = random.choices(list(patterns[word].keys()), weights=list(patterns[word].values()))[0]
        word += " " + choice
        word = " ".join(word.split(" ")[1:])
        story += choice.replace(".","\b.") + " "
        if (random.randint(0,1000000000)==0):
            story += "this has a one in one billion chance of playing for every word."
        if (round(i*100/tokens)>pastPercentage and PROGRESS_BAR):
            pastPercentage += 1
            progressBar(pastPercentage, "Generating Text")
        
    story = story.replace(" i ", " I ")
    story = story.replace(" lets ", " Let's ")
    story = story.replace(" kai ", " Kai ")
    story = story.replace(" cenat ", " Cenat ")
    story = story.replace(" because ", " cause ")
    story = story.replace(" do not ", " don't ")
    story = story.replace(" should not ", " shouldn't ")
    story = story.replace(" todays ", " shouldn't ")
    story = story.replace(" im ", " I'm ")
    if (DO_NEW_LINE):
        story = story.replace(" *** ", "\n")
    else:
        story = story.replace(" *** ", ". ")
    story = story.replace("( ", "(")
    story = story.replace(") ", ")")
    sentences = story.split(". ")
    for i in range(len(sentences)-1):
        sentences[i] = sentences[i][0].upper() + sentences[i][1:]
        sentences[i] += ". "
        if (random.randint(0,12)==0 and RANDOM_PARAGRAPHS):
            sentences[i]+="\n\t"
    story = "".join(sentences)
    story = story[0:-1]
    return story