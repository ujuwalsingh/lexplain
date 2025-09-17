from google.cloud import aiplatform
from langchain_google_vertexai import VertexAIEmbeddings

# Initialize Vertex AI
aiplatform.init(project="polished-watch-472405-v2", location="us-central1")

# Embedding model
embedding_model = VertexAIEmbeddings(model_name="textembedding-gecko@latest")

def get_embedding(text: str):
    """Generate embedding for input text"""
    return embedding_model.embed_query(text)
