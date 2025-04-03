# What 
Large Language Models (or LLMs for short) are [[Machine Learning Models]] that:
* are really good at understanding human language
* are made out of a large number of parameters 

![[donald-trump-billions.gif]]
# Why
The main way people exchange information directly is by talking (face-to-face, video calls, phone calls). If people can't talk directly to each other, they record data in some text form (messages, blogs, notes). Thus there is a lot of information that stored as text. Information so vast and sparse that no one person can remember it or go through it all. 

In come LLMs with their capacity of storing complex mappings between words. LLMs that humans can now use to: 
* efficiently automate tasks
* navigate unstructured data
* or have a chat with
# How
Broadly speaking, LLMs are [[optimized]] to remember the words and word relationships based on the text they see during the [[training phase]]. More often they see words together, the stronger the bound between them is. And the more parameters a model has, the more complex relationships it can remember.

> [!Warning] Disclaimer
> This is a over simplification of how training a LLM works. 
> The training process itself is different based on the type of LLM.
> Please consult your ML Engineer before 

# Types
And they come in different shapes and sizes depending on their purpose:
* **[[Generative Language Models]]** - are models that generate new text based on input prompts
	* Example: GPT (Generative Pre-trained Transformer), Llama, Claude
* **Masked Language Models** - are models that predict missing words in a given text
	* Example: BERT (Bidirectional Encoder Representations from Transformers)
	* it's used for tasks like **fill-in-the-gaps** where one ore more words are missing and it looks what word may fit in based on the context
* **Seq2Seq (Encooder-Decoder) Models** - are models that encode an input sequence and then decode it into an output sequence
	* Example: T5 (Text-to-Text Transfer Transformer)
	* they're useful for tasks like text translation and summarization 
* **Retrieval-Augmented Models** - are models that combine a language model with an external knowledge retrieval mechanism
	* Example RAG (Retrieval-Augmented Generation)

# Next steps
If you're curious to know more or to take a glance of what things you can build using LLMs, here's [[Large Language Models Mindmap |mindmap]] I built that may help.