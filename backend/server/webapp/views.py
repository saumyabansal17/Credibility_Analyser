from django.shortcuts import render
from .apps import PredictorConfig
from django.http import JsonResponse
from rest_framework.views import APIView

import pandas as pd
import numpy as np
from torch.utils.data import Dataset, DataLoader
from torch.utils.data import BatchSampler, SequentialSampler
import pyrebase
config={
    "apiKey": "AIzaSyB1S6V1jdDMCK8RLihSlJ0kR1uMVeDJZlM",
    "authDomain": "credibility-analyser.firebaseapp.com",
    "databaseURL": "https://credibility-analyser-default-rtdb.firebaseio.com/",
    "projectId": "credibility-analyser",
    "storageBucket": "credibility-analyser.appspot.com",
    "messagingSenderId": "937128837506",
    "appId": "1:937128837506:web:11e508fda0baf94c570f9b"
}
firebase=pyrebase.initialize_app(config)
authe = firebase.auth()
database=firebase.database()

#
class MyDataset(Dataset):
    def __init__(self, df, tokenizer, labels=False):
        self.inputs = df.loc[:, ['premise', 'hypothesis']].values
        self.tokenizer = tokenizer
        self.labels = labels
        if self.labels:
            self.tgt = df['label'].values

    def __len__(self):
        return len(self.inputs)

    def __getitem__(self, idx):
        inputs = PredictorConfig.tokenizer(self.inputs[idx].tolist(), add_special_tokens=True, padding=True,
                                           return_tensors='pt')
        if self.labels:
            inputs['labels'] = self.tgt[idx]
            return inputs
        return inputs


def submission_predict(model, dataloader, device):
    model.eval()
    predicts = np.array([])
    for i, batch in enumerate(dataloader):
        inp_ids = batch['input_ids'].squeeze().to(device)
        mask = batch['attention_mask'].squeeze().to(device)
        out = model(input_ids=inp_ids, attention_mask=mask)
        batch_preds = out[0].argmax(dim=1)
        predicts = np.concatenate((predicts, batch_preds.cpu().detach().numpy()))
    return predicts


class call_model(APIView):
    def post(self, request):
        print(request.data)
        print(request.data["premise"])
        print(request.data["hypothesis"])

        data = [[request.data["premise"], request.data["hypothesis"]], ['i am good', 'I am great']]
        temp_data = pd.DataFrame(data, columns=['premise', 'hypothesis'])
        temp_dataset = MyDataset(temp_data, PredictorConfig.tokenizer, labels=False)
        temp_dataloader = DataLoader(dataset=temp_dataset,
                                     sampler=BatchSampler(
                                         SequentialSampler(temp_dataset),
                                         batch_size=8, drop_last=False), shuffle=False)
        temp_preds = submission_predict(PredictorConfig.model, temp_dataloader, PredictorConfig.device)
        if temp_preds[0] == 0:
            str = "Contradiction"
        elif temp_preds[0] == 1:
            str = "Neutral"
        else:
            str = "Entailment"
        print(temp_preds[0])
        database.child("ans").set({"result":str})
        return JsonResponse({"result":temp_preds[0]})

       # temp_preds = [1.0,2]
       #return JsonResponse({"result":int(temp_preds[0])})