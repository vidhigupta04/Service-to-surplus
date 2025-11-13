from .helpers import save_uploaded_file

def handle_image_upload(file):
    return save_uploaded_file(file, 'images')

def handle_document_upload(file):
    return save_uploaded_file(file, 'documents')