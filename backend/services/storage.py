from google.cloud import storage as gcs

BUCKET_NAME = "lexplain-docs-bucket"

def upload_file(file, filename):
    client = gcs.Client()
    bucket = client.bucket(BUCKET_NAME)
    blob = bucket.blob(filename)
    blob.upload_from_file(file, content_type=file.content_type)
    return f"gs://{BUCKET_NAME}/{filename}"
