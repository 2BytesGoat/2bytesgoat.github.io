
# Picking the right AI

There are multiple ways to design AI systems. But usually, if someone asks you to make them an AI, your mind should go through a series of questions, that when asked will narrow down the possible algorithms you may use:
- **[[#Regarding Complexity]]**
	- Can I use simple logic? Do I even need to train an AI for this?
- **[[#Regarding Data Types]]** 
	- How will my AI see the world? Is it through sensors, cameras, text?
- **[[#Regarding Knowledge Sources]]**
	- Do we have a behaviour we want to imitate? Or do we just want to look for patters?

The last question should be about available **resources** - cuz you won't be able to run a custom Large Language Model on a Raspberry Pi.

# Regarding Complexity

> [!tip] Hot Take 
> I'm going to call AI any piece of code that behaves intelligently, even if it's simple. For example, if there's an "if" statement with a number you got through trial and error, I'll consider that a basic form of AI.
## 1.  Hand-Coded Logic (Static)
These are:
- **If-else statements** - if this, then that kind of scenarios
- **Linear functions** - simple `output = input * w + b`
- **Utility functions** - the rules-based logic that was used to make the Sims's AI
You are the brain, and the computer follows your lead. It's great for simple tasks but brittle when complexity grows or things keep changing.
## 2. Search & Optimisation (Heuristics)
These are:
- A-Star - a pathfinding algorithm 
- Genetic algorithms - a family cool semi-random search algorithms
These are good for when you want your computer to **explore** a map of possibilities.
## 3. Pattern-Finders (ML and Deep Learning)
These are:
- Decision Trees - if-else statements that you don't design by hand
- Support Vector Machines
- Neural Networks
These are good when you have access to data and you want the algorithm to build the logic around it.

# Regarding Data Types

Each data type can be seen as either a snapshot in time or a series of events. With that in mind, I tried grouping them in pairs so you'll be able to see that any type of data can be broken down like that. 

Often systems that don't care about temporal information are easier to develop and maintain. However, sometimes you just can't make do without encoding temporal information in some form.

> [!info] Tip
> Usually when building an AI you'd try to start with a version that doesn't care about time. Then use that as a building block to develop a more complex system. 

## 1. Images and Videos
Videos are just a sequence of images that play in quick succession which give the illusion of movement (similar to a [flip book](https://en.wikipedia.org/wiki/Flip_book)). Thus we can say that an image is the state of the world frozen in time. 

There are a bunch of applications where we can make do only using a single image (face recognition, object detection). However, without some trickery or fancy math, you won't be able to figure out how an object moves (left to right, coming closer or further from the camera). To infer movement or distance you'll need two or more frames in succession.

> [!info] Tip
> You can first train an Image Encoder - that would extract features from images. Then we can use the image embedding with a recurrent network to support videos. 
>
>*If this example doesn't make full sense to you, that's ok, we'll go into more details in further blog posts*

Here are a few applications for image and video AIs
### Applications - Image AI:
- **security cameras** - some casinos have face detecting software for bad clients. Also in China there surveillance systems that can identify you even in crowded areas
- **sorting facilities** - around Europe you have machines that collect bottles and cans for recycling. These objects have a QR code or symbol that tells the system if the material is recyclable or not
- **medical imaging** - there are pre-screening software that can interpret X-Ray scans with higher accuracy and help speed up the diagnosis process
- **optical character recognition (OCR)** - extracting text from images. It's useful for digitising books or documents
- **automotive** - lane detection, traffic sign recognition, weather conditions, driver drowsiness detection 
### Applications - Video AI:
- **advanced security** - identifying shoplifting by analysing human behaviour 
- **sports** - they sometimes do object tracking (for balls or players) in order to pan / zoom cameras during live events
- **motion tracking** - in the fitness industry they sometimes use AI for [repetition counting](https://sites.google.com/view/repnet)

## 2. Text and Text generation
From checking whether a tweet you wrote is racist to talking to ChatGPT, these are the kinds of things NLP (Natural Language Processing) focuses on.

Text AIs usually take some chunk of text as input and output a label or a score. Like: "is this spam?", "what's the sentiment?", "what topic is this?", "is this toxic?"

Text-generation AIs do the opposite. They take some prompt / context and output new text. Like: "finish this sentence", "write me an email", "summarise this", "translate this", "answer this question"

Here are a few applications for text and text-generation AIs
### Applications - Text AI:
- **spam filtering** - deciding whether an email is spam or not
- **topic classification** - auto-tagging news articles or support tickets so they get routed to the right place
- **toxicity / moderation** - flagging hateful content or harassment in comments
- **information extraction** - pulling out names, dates, prices, or addresses from messy text
### Applications - Text-generation AI:
- **chatbots / assistants** - answering questions using a knowledge base or company docs
- **summarisation** - turning a long article / meeting transcript into a short summary
- **translation** - converting text between languages while preserving meaning
- **code generation** - helping write / refactor code from a prompt

## 3. Tabular data and Time series
Tabular data is what you get in spreadsheets: each row is an example, each column is a feature. Usually the rows don't have an order, you can shuffle them around and nothing changes.

Time series is tabular data where the order ***does*** matter. Each row is a snapshot at a specific time (or a time window), so if you shuffle the rows you lose information.

Tabular AIs usually output a number or a category. Like: "will this customer churn?", "is this transaction fraud?", "what's the price of this house?"

Time-series AIs usually output a forecast, a warning, or an anomaly score. Like: "what will sales look like next week?", "is this sensor acting weird?", "are we about to run out of stock?"

Here are a few applications for tabular and time-series AIs
### Applications - Tabular AI:
- **credit scoring** - predicting whether someone is likely to repay a loan
- **fraud detection** - catching suspicious transactions based on patterns in the metadata
- **churn prediction** - estimating whether a user will cancel their subscription
- **pricing** - predicting house prices, insurance premiums, or ad bids
- **recommendation ranking** - deciding what items to show higher in a feed (based on user/item features)
### Applications - Time-series AI:
- **forecasting** - predicting demand, revenue, website traffic, or energy usage
- **anomaly detection** - spotting weird behaviour in servers, sensors, or payments
- **predictive maintenance** - guessing when a machine is about to fail based on vibration / temperature logs
- **algorithmic trading** - using market history to trigger buys/sells (with lots of caveats)
- **inventory / supply chain** - predicting stockouts and lead times so you can plan ahead


# Regarding Knowledge Sources
## 1. Supervised Learning

You gather examples of the desired behaviour and design an AI to model a function around it. You are the teacher, and you have the **Answer Key**.

> [!example] 
> You know the flashcards we use on babies to learn words. You show the AI a card with a picture of a "Dog" and the word "Dog" written on the back. You do this thousands of times with different dog pictures. Eventually, you show it a picture of a dog it’s never seen before,  and it should correctly guesses "Dog."

## 2. Unsupervised Learning

You give your AI and a pile of data and say: "I don't know what's in there, but tell me when you find some patterns". You don't expect an answer - you just want to see how the data clusters together.

> [!example] 
> You give the AI the books in your library. Then you tell it to sort them, doesn't matter how. Maybe it will use the colours of the cover, or the length of the titles or size of the book. The goal is that the AI will find patterns you might never have noticed, giving you a totally new way to look at your collection.

## 3. Reinforcement Learning

You have access to a simulator and know exactly when your model does "good" or "bad." The AI plays in the simulator, gathers experience, and does its best to accumulate favour points (rewards).

> [!example] 
> Your AI is trapped in the movie [**Groundhog Day**](https://en.wikipedia.org/wiki/Groundhog_Day_(film)). It keeps repeating the same day over and over until it gets the correct sequence of events. In the mean time the AI learns the environment so well that it starts speed running certain interactions.


