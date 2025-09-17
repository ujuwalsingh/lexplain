import os
from google.cloud import storage

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "key.json"

client = storage.Client()
buckets = list(client.list_buckets())

print("Buckets in project:")
for b in buckets:
    print(b.name)
