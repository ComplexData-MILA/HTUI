# FROM python:3.8
FROM rayproject/ray:nightly

WORKDIR /app
ADD requirements.txt /tmp
RUN pip install -r /tmp/requirements.txt 
# && rm /tmp/requirements.txt