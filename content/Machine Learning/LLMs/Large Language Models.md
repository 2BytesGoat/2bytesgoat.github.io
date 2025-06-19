
# What 
Large Language Models (or **LLMs** for short) are [[Machine Learning Models]] that:
* are really good at understanding human language
* are made out of a huge number of parameters 

![[donald-trump-billions.gif]]
# Why
The main way people exchange information is through language. The most common way to record information is through writing. And ain't nobody got time to go through all them blog posts and books and flyers and cave writings in one lifetime. 

In come the LLMs and their ability to store complex relationships between words. With those LLMs we can then: 
* automate tasks
* go through unstructured data
* or have just a chat with

# How
Broadly speaking, LLMs are [[optimized]] to discover and remember **statistical patterns** given the pletora of text they are exposed to during the [[training phase]]. The more often certain words appear together, the stronger the connection the model forms between them. And the more parameters a model has, the more complex relationships it can remember.

> [!Warning] Disclaimer
> * This is an over simplification of what and how LLMs learn. 
> * The training process itself is different based on the type of LLM.
> * Please consult your local ML Engineer before training your own LLM.
# Types

Language Models come in different shapes and sizes depending on their purpose. To name a few, you have:
 * **[[Generative Language Models]]** - **generate new text** based on a given input prompt by predicting the next word in a sequence
	* **Example**: GPT (Generative Pre-trained Transformer), Llama, Claude
	* **Use Cases**: Chatbots, AI agents, code generation, content creation, question answering
> These are typically **unidirectional**, meaning they generate tokens one at a time in a left-to-right fashion.


* **Masked Language Models** - **predict missing or masked tokens** within a sentence
	* **Example**: BERT (Bidirectional Encoder Representations from Transformers)
	* **Use Cases**: Text classification, named entity recognition (NER), sentence similarity, embeddings
> These are **bidirectional**, leveraging both left and right context, which makes them great for understanding tasks rather than generation.

* **Sequence-to-Sequence (Seq2Seq) / Encoder-Decoder Models** - **encode an input sequence** into a latent representation and then **decode it into an output sequence**.
	* **Examples**: T5 (Google), BART (Facebook), MarianMT
	- **Use Cases**: Translation, summarization, text-to-text tasks
> These are flexible for tasks where the **input and output are both text**, often of different structure or language.

Sure, you can use ChatGPT (generative models) for most tasks. But in case you want a more **cost-efficient** model, that you can train yourself on **your custom data** and avoid dealing with **hallucinations**, you may want to keep your mind open for other options.

# Next steps

LLMs are freaking ***everywhere*** these days and - as we say in Romania - people are gobbling them like hot bread. That's why I think it's important to not only know **how to use them** but also **how they work**.

Generative Models, for instance, are very resource-intensive and have the habit of surprising you with your pants down when you over-rely on them. 

But to get to the point, I feel everyone should know:
* how to use Generative Models at their maximum potential 
	- by learning the basics of prompt engineering - the better the prompts, the time and money you waste using ChatGPT
* what's prompt injection and how to protect yourself from it
	* especially if you want to build your own user-facing product that uses LLMs
	* you can check out my game [[Prompt-it!]] if you wanna get a taste of that

* how to make Generative Models produce more reliable outputs 
	- be it through parameter tuning
	- developing tools that the models should use
	- or giving them access to a RAG-based system so they can make cheat-sheets

If you're curious to know more or to take a glance of what things you can build using LLMs, here's [[Large Language Models Mindmap |mindmap]] I built that may help.