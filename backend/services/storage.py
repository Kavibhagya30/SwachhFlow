from minio import Minio
from minio.error import S3Error
import os

MINIO_ENDPOINT = "localhost:9000"
MINIO_ACCESS_KEY = "minioadmin"
MINIO_SECRET_KEY = "minioadmin"
MINIO_BUCKET = "swachhflow"

client = Minio(
    MINIO_ENDPOINT,
    access_key=MINIO_ACCESS_KEY,
    secret_key=MINIO_SECRET_KEY,
    secure=False
)

def ensure_bucket_exists():
    if not client.bucket_exists(MINIO_BUCKET):
        client.make_bucket(MINIO_BUCKET)
        print(f"Bucket {MINIO_BUCKET} created.")
    else:
        print(f"Bucket {MINIO_BUCKET} already exists.")

def upload_file(file_data, file_name, content_type):
    ensure_bucket_exists()
    try:
        # Check if file_data is bytes or file-like
        if isinstance(file_data, bytes):
            import io
            data_stream = io.BytesIO(file_data)
            length = len(file_data)
        else:
            data_stream = file_data.file
            # Move to end to get size then back to start
            data_stream.seek(0, 2)
            length = data_stream.tell()
            data_stream.seek(0)

        client.put_object(
            MINIO_BUCKET,
            file_name,
            data_stream,
            length,
            content_type=content_type
        )
        # Generate presigned URL or just return path
        url = f"http://{MINIO_ENDPOINT}/{MINIO_BUCKET}/{file_name}"
        return url
    except S3Error as e:
        print("MinIO Error:", e)
        return None
