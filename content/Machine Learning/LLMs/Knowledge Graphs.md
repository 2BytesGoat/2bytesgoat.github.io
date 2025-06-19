## Why would you need it?
Baseline RAG works by taking a private dataset -> you create chunks using embeddings -> you store those chunks in a vector database. Once the information is chunked you perform nearest neighbor search based on a query -> and you use the result of the search to augment the context window. 

- vector DB is limited when you scale your knowledge base
	- additional topics
	- more text on same topic 
- retrieving the N-chunks may skip relevant data or broader themes

## What is it? 
Storing semantic dependencies between two entities.
Made out of nodes and edges.
Use cases: 
* search engines
* recommendation systems

You extract from your raw text entities -> you find out if there is a relationship between those entities and get the strength of the relationship

LLMs can be leveraged today in order to get deeper meaning / contextual information rather than simple concurrence-based relationships.

Use GraphML to do:
- semantical aggregation 
- hierarchical agglomerations 

## Additional reading 
* Knowledge Graphs
	- YouTube video [What is a Knowledge Graph?](https://www.youtube.com/watch?v=y7sXDpffzQQ) - 5:35 min
- GraphRAG
	- YouTube Video [GraphRAG: LLM-Derived Knowledge Graphs for RAG] https://www.youtube.com/watch?v=r09tJfON6kE - 15:59 min
	*  YouTube Video [Knowledge Graph or Vector Database… Which is Better?](https://www.youtube.com/watch?v=6vG_amAshTk) - 41:06 min

