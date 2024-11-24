from django.apps import AppConfig
import pickle
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

class WebappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'webapp'

class PredictorConfig(AppConfig):
    model = pickle.load(open('D:/Vs Code/CredibilityAnalyzer-master/backend/server/model.sav','rb'))
    device = 'cpu'
    tokenizer = AutoTokenizer.from_pretrained("joeddav/xlm-roberta-large-xnli", padding=True)