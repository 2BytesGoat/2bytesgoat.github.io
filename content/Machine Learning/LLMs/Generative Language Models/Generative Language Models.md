# What
They are a type of [[Generative Models]] that produce words. 

Simpler put, they are AI-based autocomplete systems that generate **words** based on the input they get (a question, a request, a image).

By the way, I'll call Generative Language Models as GLMs because I'm lazy to type that all the time.
# Why
Generative models were built to store information, find patterns inside that information and to make said information more available to people.

Nowadays people use GLMs (like ChatGPT) for a bunch of stuff. However I like splitting them in three buckets:
* getting information: question answering based on what the AI knows
* processing text: summarizing text, extracting information
* automating stuff: telling the AI that I need a cupon code so it 
	* uses a function to search the internet
	* then another function to grab the contents of the page
	* then it extracts the information from the webpage
	* and then it answers my request

There are a ton of things you can do with GLMs, but you'll have to keep in mind that they have some limitations.
# How
There were a bunch of iterations GLMs needed to go through to get to ChatGPT. 

First, the engineers got a small set of sentences and trained the AI to predict the next word that comes next.

> [!Info] Example
> Say you have a conversation with a GLM and you ask it
> - Hey Generative Language Model! How are you today?
> 
> The GLM will need to predict what's the next word that comes next. In this case let's say it's "Hey". But any similar word should also be fine like: Hello, Hi or Buongiorno.

Then, once they saw that the AI had a high accuracy on the data used for training, they tried new sentences. They saw that the AI keeps remembering information, regardless of how much they give it. So they fed it the internet (part of it at least). Conversations, blogposts, video transcriptions, you name it.

Then they thought: What if we condition the AI to speak like a human? That way, maybe it will be easier for people to use the information it remembered.

And that kids is how I met ChatGPT.

![video](https://heits.digital/_next/image?url=%2Fmedia%2Farticles%2Fchatgpt-vs-deepseek%2Fimg_0.gif&w=750&q=75)
source: [animated-transformer](https://prvnsmpth.github.io/animated-transformer/)

# Limitations
Cool stuff. So now, since GLMs are so powerful, why don't we use them for everything? Why do we even need other kinds of Language Models?

Well ... there are a few reasons

## GLMs like shrooms
There's a thing with GLMs called hallucinations. What it means is that they will sometimes make things up because you showed them information they haven't seen before. Similar to how you'd show a caveman a smartphone and ask it what it is, if you present a GLM a piece of text it knows nothing about it will start making things up.

If you remember, GLMs are just AIs that are good at autocompleting. So they'll just output words that think go well together. They don't have the notion of saying "I don't know", not yet at least. So they'll just make things up if you ask them about things they don't know.

The downside is that you don't know what they don't know, most of the times.

But there's a fix for this, you can [[Prompting |give them some context]], and then they'll use the context to answer the question. Similar to doing a extraction + summarization.

## GLMs only know the training data
Tying back to the previous section, we don't know what the GLM has seen during training. And if we were to use a GLM, for example, as a translator we will need to properly test it. Mainly because we don't know how much it has seen from both languages to be able to map words from one language to another.

I really wanted to give you an example of how GPT miss-translates Romanian idioms, but unfortunately it seems that they included that in the training data 🥲

## With great power comes great power bills
Because GLMs are so versatile and easy to use, it also means that maybe they do a bit more than you need them for.

> [!Info] Example
> Say you want to buy a laptop. When looking for a laptop there're a lot of options you may look for:
> * good battery - so it will last longer
> * good screen - so you'll see the image clearer 
> * good hardware - so you can play games or learn machine learning
> * good form-factor - so you can actually carry it with you
> And the more thing you want your laptop to do, the more expensive it's going to get to buy it.
>
> So if a laptop is more expensive than a tablet because it has more features, some Generative Models are more costly than other LLMs because they require more hardware and are harder to train.

So not only do GLMs require more hardware than other LLMs to run, but they also require a lot more hardware to train them on. 

They're wonderful for testing out stuff and validating that the thing you want is doable, but if you have the time to learn how other models work and train them, you'll end up having a less bulky and cheaper model.