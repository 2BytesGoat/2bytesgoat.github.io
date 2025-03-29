# What 
Large Language Models (or LLMs for short) are [[Machine Learning Models]] that:
* are really good at understanding human language
* are made out of a large number of parameters 

![[donald-trump-billions.gif]]
# Why
LLMs exist because humans use language as their primary communication medium. Thus there is a lot of information that stored as text. Information so vast and sparse that no one person can remember or go through. 

In come LLMs with their capacity of storing complex mapping between words, that humans can now use to: 
* efficiently automate tasks
* navigate unstructured data
* or even have a chat with
# How
Broadly speaking, LLMs are [[optimized]] to remember the words and word relationships based on the text they see during the [[training phase]]. The more often they see words together, the stronger the bound between them is. And the more parameters the models have, the more complex relationships they can remember.

> [!Warning] Disclaimer
> This is a oversimplification of the complexities that go into training a generic Large Language Model. 
>
> Also, the training process itself is different based on the type of LLM.

# Types
And they come in different shapes and sizes depending on their purpose:
* **[[Generative Models]]** - are models that generate new text based on input prompts
	* Example: GPT (Generative Pre-trained Transformer), Llama, Claude
* **Masked Language Models** - are models that predict missing words in a given text
	* Example: BERT (Bidirectional Encoder Representations from Transformers)
	* it's used for tasks like **fill-in-the-gaps** where one ore more words are missing and it looks what word may fit in based on the context
* **Seq2Seq (Encooder-Decoder) Models** - are models that encode an input sequence and then decode it into an output sequence
	* Example: T5 (Text-to-Text Transfer Transformer)
	* they're useful for tasks like text translation and summarization 
* **Retrieval-Augmented Models** - are models that combine a language model with an external knowledge retrieval mechanism
	* Example RAG (Retrieval-Augmented Generation)


