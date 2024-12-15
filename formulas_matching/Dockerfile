FROM continuumio/miniconda3:latest

WORKDIR /app

COPY environment.yml /tmp/environment.yml

RUN conda env create -f /tmp/environment.yml

RUN echo "source activate equilLibria" > ~/.bashrc
ENV PATH /opt/conda/envs/equilLibria/bin:$PATH

ENV MODEL_PATH /app/equillibria-bert-model

RUN mkdir /app/equillibria-bert-model
COPY equillibria-bert-model/ /app/equillibria-bert-model/

COPY . /app/

ENV PYTHONUNBUFFERED=1

RUN touch /app/app.log

EXPOSE 8003

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8003"]
